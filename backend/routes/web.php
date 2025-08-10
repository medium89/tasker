<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Task;

// Текущий пользователь
Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

// Все задачи (если нужно)
Route::middleware('auth:sanctum')->get('/tasks', function () {
    return Task::with(['comments.user', 'users'])->get();
});

// Дашборд: задачи текущего пользователя
Route::middleware('auth:sanctum')->get('/dashboard', function (Request $r) {
    $user = $r->user();
    return Task::with(['comments.user','users'])
        ->whereHas('users', fn($q) => $q->where('users.id', $user->id))
        ->orderByDesc('id')
        ->get();
});

Route::middleware('auth:sanctum')->put('/user', function (Request $request) {
    $user = $request->user();
    $user->update($request->only(['name', 'email']));
    return $user;
});

Route::middleware('auth:sanctum')->delete('/user', function (Request $request) {
    $user = $request->user();
    $user->delete();
    return response()->json(['message' => 'Account deleted']);
});

// Breeze/Fortify маршруты
require __DIR__.'/auth.php';
