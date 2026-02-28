<?php

namespace App\Jobs;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NotifyNewComment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $comment;

    /**
     * Recibimos el modelo Comment.
     * SerializesModels se encarga de que viaje liviano por Redis.
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    /**
     * Aquí ocurre la magia en segundo plano (Redis).
     */
    public function handle(): void
    {
        // Simulamos una acción pesada o notificación
        Log::info("QUEUE [Redis]: Nuevo comentario detectado.");
        Log::info("Ticket ID: {$this->comment->ticket_id} - Autor ID: {$this->comment->user_id}");
        Log::info("Contenido: " . substr($this->comment->message, 0, 30) . "...");
    }
}
