<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByStatus(Builder $query, $status): Builder
    {
        if (!$status) return $query;
        return $query->where('status', $status);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
