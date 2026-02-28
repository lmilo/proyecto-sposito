<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // IMPORTANTE para usar policies

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

            // Usamos el scope que pusimos en el modelo para que sea más limpio
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

        return response()->json($ticket, 21);
    }

    public function show($id)
    {
        $ticket = Ticket::findOrFail($id);
        $this->authorize('view', $ticket); // Usamos la Policy

        return response()->json($ticket);
    }

    // REQUISITO: Solo Agent cambia el estado
    public function updateStatus(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        // Esto llama al método updateStatus de tu TicketPolicy
        $this->authorize('updateStatus', $ticket);

        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved'
        ]);

        $ticket->update(['status' => $validated['status']]);

        // REQUISITO: Limpiar cache para que el cambio se vea reflejado
        Cache::flush(); // Forma rápida, o puedes borrar la key específica

        return response()->json([
            'message' => 'Estado actualizado',
            'ticket' => $ticket
        ]);
    }
}
