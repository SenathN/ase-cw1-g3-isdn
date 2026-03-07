<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class Driver extends Model
{
    use SoftDeletes, RevisionableTrait; 

    protected $revisionEnabled = true;
    protected $revisionCreationsEnabled = true;

    protected $fillable = [
        'code',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
