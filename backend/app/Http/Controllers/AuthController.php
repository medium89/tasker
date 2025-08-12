<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    // POST /register
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Автовход после регистрации
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json($user, 201);
    }

    // POST /login
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // ВАЖНО: перед логином фронт должен вызвать GET /sanctum/csrf-cookie,
        // чтобы установить XSRF-TOKEN (SPA+Sanctum)
        if (! Auth::attempt($request->only('email', 'password'), true)) {
            return response()->json(['message' => 'Неверный email или пароль'], 422);
        }

        $request->session()->regenerate();

        return response()->json($request->user());
    }

    // POST /logout
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}
