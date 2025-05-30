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
        Schema::create('agendamentos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cliente_id')->constrained()->onDelete('cascade');
    $table->foreignId('profissional_id')->constrained()->onDelete('cascade');
    $table->foreignId('servico_id')->constrained()->onDelete('cascade');
    $table->foreignId('salao_id')->constrained()->onDelete('cascade');
    $table->dateTime('data_hora');
    $table->enum('status', ['pendente', 'confirmado', 'cancelado'])->default('pendente');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendamentos');
    }
};
