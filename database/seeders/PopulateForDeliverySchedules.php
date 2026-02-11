<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Testing\Fakes\Fake;

class PopulateForDeliverySchedules extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        collect(range(1, 10))->each(function () {
            \App\Models\Order::firstOrCreate([
                'code' => ucwords(Str::random(3).'-'.Str::random(4).'-'.Str::random(3)),
            ]);
        });

        $driver_user_instance = \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        collect(range(1, 10))->each(function () use ($driver_user_instance) {
            \App\Models\Driver::firstOrCreate([
                'code' => fake()->name(),
                'user_id' => $driver_user_instance->id,
            ]);
        });

        DB::commit();
    }
}
