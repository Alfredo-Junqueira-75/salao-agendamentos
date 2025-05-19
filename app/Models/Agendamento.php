<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agendamento extends Model
{
    //
    protected $fillable = [
        'dataHora', 'status', 'cliente_id', 'profissional_id', 'servico_id',
    ];

    public function cliente() {
        return $this->belongsTo(Cliente::class);
    }

    public function profissional() {
        return $this->belongsTo(Profissional::class);
    }  

    public function servico() {
        return $this->belongsTo(Servico::class);
    }

}
