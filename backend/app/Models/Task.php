<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'task_id',
        'status',
        'priority',
        'due_date',
    ];
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'tasks_users')
            ->using(TaskUser::class)
            ->withPivot(['role', 'created_at']); // без withTimestamps()
    }
}
