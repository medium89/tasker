<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

// --- Авторизация (SPA + Sanctum) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- Профиль (по желанию оставляем как было) ---
Route::middleware('auth:sanctum')->put('/user', function (Request $request) {
    $user = $request->user();
    $user->update($request->only(['name', 'email']));
    return $user;
});
Route::middleware('auth:sanctum')->put('/user/password', function (Request $request) {
    $data = $request->validate([
        'password' => ['required', 'confirmed', Password::min(8)],
    ]);
    $user = $request->user();
    $user->update([
        'password' => Hash::make($data['password']),
    ]);
    return response()->json(['message' => 'Password updated']);
});
Route::middleware('auth:sanctum')->delete('/user', function (Request $request) {
    $user = $request->user();
    $user->delete();
    return response()->json(['message' => 'Account deleted']);
});

// --- Задачи (всё через TaskController) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get   ('/tasks',                  [TaskController::class, 'index']);
    Route::post  ('/tasks',                  [TaskController::class, 'store']);
    Route::get   ('/tasks/{task}',           [TaskController::class, 'show']);
    Route::match (['put','patch'], '/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}',           [TaskController::class, 'destroy']);

    // Привязки пользователей к задаче
    Route::post  ('/tasks/{task}/users',           [TaskController::class, 'attachUser']);
    Route::delete('/tasks/{task}/users/{user}',    [TaskController::class, 'detachUser']);

    // Комментарии
    Route::post  ('/tasks/{task}/comments',        [TaskController::class, 'addComment']);

    // Route::get('/{any}', function () {
    //     return view('index'); // или 'welcome', в зависимости от названия вашего файла
    // })->where('any', '.*');
});
