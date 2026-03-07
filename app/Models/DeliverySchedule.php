<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Venturecraft\Revisionable\RevisionableTrait;

class DeliverySchedule extends Model
{
    use SoftDeletes, RevisionableTrait; 

    protected $revisionEnabled = true;
    protected $revisionCreationsEnabled = true;
    
    protected $fillable = [
        'code',
        'order_id',
        'driver_id',
        'scheduled_date',
        'scheduled_time',
        'route_notes',
        'status',
        'created_by'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
