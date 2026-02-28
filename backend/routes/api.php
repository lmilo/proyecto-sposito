<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// Ruta de Login
Route::post('auth/login', [AuthController::class, 'login']);

// Rutas protegidas por JWT
Route::middleware('auth:api')->group(function () {

    Route::get('me', [AuthController::class, 'me']);

    Route::get('tickets', [TicketController::class, 'index']);
    Route::get('tickets/{id}', [TicketController::class, 'show']);

    // Ruta de Logout
    Route::post('auth/logout', [AuthController::class, 'logout']);
});
