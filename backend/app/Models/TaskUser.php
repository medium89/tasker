<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TaskUser extends Pivot
{
    protected $table = 'tasks_users';

    public $timestamps = false;

    protected $fillable = [
        'task_id',
        'user_id',
        'role',
    ];
}
