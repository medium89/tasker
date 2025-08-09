<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// регистрация
Route::post('/register', [RegisteredUserController::class, 'store']);

// вход
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// выход
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

// получить текущего пользователя
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return $request->user();
});

// SPA fallback — отдаём Vue
Route::any('/{any}', fn () => view('app'))
    ->where('any', '.*');
