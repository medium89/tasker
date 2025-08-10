<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Текущий пользователь по cookie-сессии
Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

// Пример защищённого маршрута
Route::middleware('auth:sanctum')->get('/tasks', function () {
    return \App\Models\Task::all();
});

// Стандартные Breeze/Fortify маршруты
require __DIR__.'/auth.php';
