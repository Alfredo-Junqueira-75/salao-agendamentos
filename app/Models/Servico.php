<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servico extends Model
{
    protected $fillable = [
        'nome', 'preco', 'duracao'
    ];
    public function salao() {
        return $this->belongsTo(Salao::class);
    }

    public function agendamentos() {
        return $this->hasMany(Agendamento::class);
    }

}
