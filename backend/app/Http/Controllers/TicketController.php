<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // REQUISITO: La key debe variar por usuario, filtros y página
        $page = $request->get('page', 1);
        $status = $request->get('status');
        $search = $request->get('q');

        $cacheKey = "tickets_user_{$user->id}_role_{$user->role}_page_{$page}_status_{$status}_q_{$search}";

        // REQUISITO: Cachear el listado con TTL 60s
        return Cache::remember($cacheKey, 60, function () use ($user, $status, $search) {

            $query = Ticket::query();

            // REQUISITO: Agent ve todos, Customer solo los suyos
            if ($user->role !== 'agent') {
                $query->where('user_id', $user->id);
            }

            // REQUISITO: Filtros opcionales status y q (búsqueda) [cite: 30, 31]
            if ($status) {
                $query->where('status', $status);
            }

            if ($search) {
                $query->where('title', 'LIKE', "%{$search}%");
            }

            // REQUISITO: Listar tickets paginado [cite: 29]
            return $query->latest()->paginate(10);
        });
    }

    public function show($id)
    {
        $user = Auth::user();
        $ticket = Ticket::findOrFail($id);

        // REQUISITO: Autorización (Customer no puede ver otros) [cite: 54]
        if ($user->role !== 'agent' && $ticket->user_id !== $user->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($ticket);
    }
}
