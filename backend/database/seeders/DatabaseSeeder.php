<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Support Agent',
            'email' => 'agent@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent', // [cite: 19]
        ]);

        $customer = \App\Models\User::create([
            'name' => 'Test Customer',
            'email' => 'customer@test.com',
            'password' => bcrypt('password'),
            'role' => 'customer', // [cite: 19]
        ]);

        for ($i = 1; $i <= 3; $i++) {
            \App\Models\Ticket::create([
                'title' => "Ticket de prueba $i",
                'description' => "Este es el problema reportado número $i",
                'status' => 'open',
                'user_id' => $customer->id,
            ]);
        }
    }
}
