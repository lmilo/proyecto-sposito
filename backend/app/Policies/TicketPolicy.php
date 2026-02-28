<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * REQUISITO: El Agent ve todo. El Customer solo lo suyo.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        return $user->role === 'agent' || $user->id === $ticket->user_id;
    }

    /**
     * REQUISITO: Solo el Agent puede cambiar el estado.
     */
    public function updateStatus(User $user, Ticket $ticket): bool
    {
        return $user->role === 'agent';
    }

    /**
     * REQUISITO: Solo el Customer puede crear tickets.
     */
    public function create(User $user): bool
    {
        return $user->role === 'customer';
    }
}
