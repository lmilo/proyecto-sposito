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
        // 1. Agente de soporte obligatorio
        User::create([
            'name'     => 'Support Agent',
            'email'    => 'agent@test.com',
            'password' => Hash::make('password'),
            'role'     => 'agent',
        ]);

        // 2. Cliente de prueba obligatorio
        User::create([
            'name'     => 'Test Customer',
            'email'    => 'customer@test.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);
    }
}
