<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@isdn.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'phone' => '0400 111 111',
            'address' => 'ISDN Headquarters, Brisbane',
            'preferred_rdc' => null,
            'email_verified_at' => now(),
        ]);

        // Create Customer users for each RDC
        $customers = [
            [
                'name' => 'John Customer',
                'email' => 'customer@isdn.com',
                'phone' => '0400 222 222',
                'address' => '123 Main St, Brisbane QLD 4000',
                'preferred_rdc' => User::RDC_NORTH,
            ],
            [
                'name' => 'Sarah Brisbane',
                'email' => 'sarah@customer.com',
                'phone' => '0400 222 223',
                'address' => '456 Queen St, Brisbane QLD 4001',
                'preferred_rdc' => User::RDC_NORTH,
            ],
            [
                'name' => 'Mike Sydney',
                'email' => 'mike@customer.com',
                'phone' => '0400 222 224',
                'address' => '789 George St, Sydney NSW 2000',
                'preferred_rdc' => User::RDC_SOUTH,
            ],
            [
                'name' => 'Lisa Melbourne',
                'email' => 'lisa@customer.com',
                'phone' => '0400 222 225',
                'address' => '321 Bourke St, Melbourne VIC 3000',
                'preferred_rdc' => User::RDC_EAST,
            ],
            [
                'name' => 'Tom Perth',
                'email' => 'tom@customer.com',
                'phone' => '0400 222 226',
                'address' => '654 Murray St, Perth WA 6000',
                'preferred_rdc' => User::RDC_WEST,
            ],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password'),
                'role' => User::ROLE_CUSTOMER,
                'phone' => $customer['phone'],
                'address' => $customer['address'],
                'preferred_rdc' => $customer['preferred_rdc'],
                'email_verified_at' => now(),
            ]);
        }

        // Create RDC Staff users for each location
        $rdcStaff = [
            ['name' => 'North RDC Staff', 'email' => 'staff.north@isdn.com', 'rdc' => User::RDC_NORTH],
            ['name' => 'South RDC Staff', 'email' => 'staff.south@isdn.com', 'rdc' => User::RDC_SOUTH],
            ['name' => 'East RDC Staff', 'email' => 'staff.east@isdn.com', 'rdc' => User::RDC_EAST],
            ['name' => 'West RDC Staff', 'email' => 'staff.west@isdn.com', 'rdc' => User::RDC_WEST],
        ];

        foreach ($rdcStaff as $staff) {
            User::create([
                'name' => $staff['name'],
                'email' => $staff['email'],
                'password' => Hash::make('password'),
                'role' => User::ROLE_RDC_STAFF,
                'preferred_rdc' => $staff['rdc'],
                'email_verified_at' => now(),
            ]);
        }

        // Create Logistics user
        User::create([
            'name' => 'Logistics Manager',
            'email' => 'logistics@isdn.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_LOGISTICS,
            'email_verified_at' => now(),
        ]);

        // Create Driver users
        $drivers = [
            ['name' => 'Driver North 1', 'email' => 'driver1.north@isdn.com', 'rdc' => User::RDC_NORTH],
            ['name' => 'Driver South 1', 'email' => 'driver1.south@isdn.com', 'rdc' => User::RDC_SOUTH],
            ['name' => 'Driver East 1', 'email' => 'driver1.east@isdn.com', 'rdc' => User::RDC_EAST],
            ['name' => 'Driver West 1', 'email' => 'driver1.west@isdn.com', 'rdc' => User::RDC_WEST],
        ];

        foreach ($drivers as $driver) {
            User::create([
                'name' => $driver['name'],
                'email' => $driver['email'],
                'password' => Hash::make('password'),
                'role' => User::ROLE_DRIVER,
                'preferred_rdc' => $driver['rdc'],
                'email_verified_at' => now(),
            ]);
        }

        // Create Accounts user
        User::create([
            'name' => 'Accounts Manager',
            'email' => 'accounts@isdn.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ACCOUNTS,
            'email_verified_at' => now(),
        ]);
    }
}
