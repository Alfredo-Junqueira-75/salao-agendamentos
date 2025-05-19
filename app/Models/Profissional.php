<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profissional extends Model
{
    protected $fillable = [
        'nome', 'email', 'senha', 'tipo', 'telefone',
        'especialidade', 'horarioTrabalho', 'agendamentos',
    ];

    public function agendamentos() {
        return $this->hasMany(Agendamento::class);
    }

    public function salao() {
        return $this->belongsTo(Salao::class);
    }

}
