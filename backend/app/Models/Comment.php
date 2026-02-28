<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'ticket_id',
        'user_id'
    ];

    /**
     * Relación: El comentario pertenece a un Ticket.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Relación: El comentario pertenece a un Usuario (autor).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
