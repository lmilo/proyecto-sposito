<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Comment;
use App\Jobs\NotifyNewComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TicketController extends Controller
{
    use AuthorizesRequests; // Habilita $this->authorize()

    public function index(Request $request)
    {
        $user = Auth::user();
        $page = $request->get('page', 1);
        $status = $request->get('status');
        $search = $request->get('q');

        $cacheKey = "tickets_user_{$user->id}_role_{$user->role}_page_{$page}_status_{$status}_q_{$search}";

        return Cache::remember($cacheKey, 60, function () use ($user, $status, $search) {
            $query = Ticket::query();

            if ($user->role !== 'agent') {
                $query->where('user_id', $user->id);
            }

            if ($status) {
                $query->where('status', $status);
            }

            if ($search) {
                $query->where('title', 'LIKE', "%{$search}%");
            }

            return $query->latest()->paginate(10);
        });
    }

    // REQUISITO: Crear Ticket (Solo Customer según la Policy)
    public function store(Request $request)
    {
        $this->authorize('create', Ticket::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => 'open',
            'user_id' => Auth::id(),
        ]);

        return response()->json($ticket, 201);
    }

    /**
     * MODIFICADO: Ahora carga comentarios y usuarios para el Front
     */
    public function show($id)
    {
        // Eager loading: traemos el ticket con sus comentarios y el autor de cada comentario
        $ticket = Ticket::with(['user', 'comments.user'])->find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket no encontrado'], 404);
        }

        $this->authorize('view', $ticket); // Usamos la Policy

        return response()->json($ticket);
    }

    // REQUISITO: Solo Agent cambia el estado
    public function updateStatus(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $this->authorize('updateStatus', $ticket);

        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved'
        ]);

        $ticket->update(['status' => $validated['status']]);

        // REQUISITO: Limpiar cache para que el cambio se vea reflejado
        Cache::flush();

        return response()->json([
            'message' => 'Estado actualizado',
            'ticket' => $ticket
        ]);
    }
    public function addComment(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $this->authorize('view', $ticket);

        $validated = $request->validate([
            'message' => 'required|string|min:3'
        ]);

        $comment = Comment::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $validated['message']
        ]);

        // REQUISITO: Cola de Redis
        NotifyNewComment::dispatch($comment);

        return response()->json([
            'message' => 'Comentario añadido y notificación en cola',
            'comment' => $comment->load('user')
        ], 201);
    }
}
