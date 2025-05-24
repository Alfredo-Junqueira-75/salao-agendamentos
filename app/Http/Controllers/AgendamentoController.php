<?php

namespace App\Http\Controllers;

use App\Models\Agendamento;
use App\Models\Cliente;
use App\Models\Profissional;
use App\Models\Servico;
use Illuminate\Http\Request;

class AgendamentoController extends Controller
{
    public function index()
    {
        $agendamentos = Agendamento::with(['cliente', 'profissional', 'servico'])->get();
        return response()->json($agendamentos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'profissional_id' => 'required|exists:profissionals,id',
            'servico_id' => 'required|exists:servicos,id',
            'salao_id' => 'required|exists:salaos,id',
            'data_hora' => 'required|date',
        ]);

        $agendamento = Agendamento::create([
            'cliente_id' => $request->cliente_id,
            'profissional_id' => $request->profissional_id,
            'servico_id' => $request->servico_id,
            'salao_id' => $request->salao_id,
            'data_hora' => $request->data_hora,
            'status' => 'pendente',
        ]);

        return response()->json($agendamento, 201);
    }

    public function show($id)
    {
        $agendamento = Agendamento::with(['cliente', 'profissional', 'servico'])->findOrFail($id);
        return response()->json($agendamento);
    }

    public function update(Request $request, $id)
    {
        $agendamento = Agendamento::findOrFail($id);

        $request->validate([
            'data_hora' => 'sometimes|date',
            'status' => 'sometimes|in:pendente,confirmado,cancelado',
            'salao_id' => 'sometimes|exists:salaos,id',
        ]);

        $agendamento->update($request->only(['data_hora', 'status', 'salao_id']));

        return response()->json($agendamento);
    }

    public function destroy($id)
    {
        Agendamento::destroy($id);
        return response()->json(['message' => 'Agendamento cancelado.']);
    }
}
