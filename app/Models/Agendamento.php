<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agendamento extends Model
{
    //
    protected $fillable = [
        'data_hora', 'status', 'cliente_id', 'profissional_id', 'servico_id', 'salao_id'
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
    public function salao()
{
    return $this->belongsTo(Salao::class);
}


}
