<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function myTasks(Request $request)
    {
        return Task::with(['comments.user','users'])
            ->whereHas('users', fn($q) => $q->where('users.id', $request->user()->id))
            ->orderByDesc('id')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create($data);
        $task->users()->attach($request->user()->id);

        return $task;
    }

    public function update(Request $request, Task $task)
    {
        // Здесь можно добавить проверку прав
        $data = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task->update($data);

        return $task;
    }

    public function destroy(Task $task)
    {
        // Здесь можно добавить проверку прав
        $task->delete();

        return response()->noContent();
    }
}
