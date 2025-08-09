<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;

// Аутентификация
Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest');
Route::post('/login',    [AuthenticatedSessionController::class, 'store'])->middleware('guest');
Route::post('/logout',   [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Текущий пользователь
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return $request->user();
});

// (опционально) остаются оригинальные Breeze-маршруты
require __DIR__.'/auth.php';
