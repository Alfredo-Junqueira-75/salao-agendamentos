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
        Schema::create('notificacoes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cliente_id')->nullable()->constrained()->onDelete('cascade');
    $table->foreignId('agendamento_id')->nullable()->constrained()->onDelete('cascade');
    $table->string('mensagem');
    $table->boolean('lida')->default(false);
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificacaos');
    }
};
