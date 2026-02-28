<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Ruta de Login
Route::post('auth/login', [AuthController::class, 'login']);

// Rutas protegidas por JWT
Route::middleware('auth:api')->group(function () {

    Route::get('me', [AuthController::class, 'me']);

    // Ruta de Logout
    Route::post('auth/logout', [AuthController::class, 'logout']);
});
