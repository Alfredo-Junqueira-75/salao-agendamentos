<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $fillable = [
        'nome', 'email', 'telefone', 'password', 
    ];

    public function agendamentos() {
         return $this->hasMany(Agendamento::class);
    }

    public function notificacoes() {
        return $this->hasMany(Notificacao::class);
    }

}
