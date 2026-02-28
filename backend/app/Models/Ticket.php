<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <--- Nuevo
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory;

    /**
     * Atributos asignables. [cite: 28]
     */
    protected $fillable = [
        'title',
        'description',
        'status',
        'user_id'
    ];

    /**
     * REQUISITO: Un ticket pertenece a un usuario (Customer). [cite: 17, 19]
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
