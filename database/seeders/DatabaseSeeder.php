<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin', // 'admin' is the highest role as defined in our system
        ]);

        // You can add more admins with different roles if needed
        Admin::create([
            'name' => 'Editor',
            'email' => 'editor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'editor',
        ]);



    }
}
