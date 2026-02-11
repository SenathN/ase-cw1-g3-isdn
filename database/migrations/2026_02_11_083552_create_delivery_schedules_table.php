<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delivery_schedules', function (Blueprint $table) {
            $table->id();

            $table->string('code')->unique();
            $table->foreignId('order_id')->constrained();
            $table->foreignId('driver_id')->constrained();
            $table->foreignId('created_by')->constrained('users');
            $table->date('scheduled_date');
            $table->time('scheduled_time');
            $table->enum('status', [
                'pending',
                'scheduled',
                'out_for_delivery',
                'delivered',
                'failed'
            ])->default('pending');
            $table->text('route_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_schedules');
    }
};
