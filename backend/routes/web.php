<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;

// API аутентификация под /api
Route::post('/api/register', [RegisteredUserController::class, 'store'])->middleware('guest');
Route::post('/api/login',    [AuthenticatedSessionController::class, 'store'])->middleware('guest');
Route::post('/api/logout',   [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Текущий пользователь
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return $request->user();
});

// (опционально) остаются оригинальные Breeze-маршруты
require __DIR__.'/auth.php';
