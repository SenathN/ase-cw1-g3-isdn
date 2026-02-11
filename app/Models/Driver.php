<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'code',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
