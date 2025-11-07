<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Jade Cruz',
            'email' => 'jade@example.com',
            'password' => Hash::make('password.123'),
        ]);

        User::create([
            'name' => 'Raizel James',
            'email' => 'raizel@example.com',
            'password' => Hash::make('password.123'),
        ]);
    }
}
