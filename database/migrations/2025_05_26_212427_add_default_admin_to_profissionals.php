<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('profissionals')->insert([
            'nome' => 'Administrador Padrão',
            'email' => 'admin@salao.com',
            'senha' => Hash::make('123456'), // senha padrão
            'tipo' => 'administrador',
            'telefone' => '900000000',
            'especialidade' => 'gerente',
            'horarioTrabalho' => '08:00-18:00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }

    public function down(): void
    {
        DB::table('profissionals')
            ->where('email', 'admin@salao.com')
            ->delete();
    }
};
