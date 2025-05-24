<?php

namespace App\Http\Controllers;

use App\Models\Servico;
use Illuminate\Http\Request;

class ServicoController extends Controller
{
    public function index()
    {
        $servicos = Servico::all(); // removido with('salao')
        return response()->json($servicos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'duracao' => 'required|date_format:H:i:s',
        ]);

        $servico = Servico::create([
            'nome' => $request->nome,
            'preco' => $request->preco,
            'duracao' => $request->duracao,
        ]);

        return response()->json($servico, 201);
    }

    public function show($id)
    {
        $servico = Servico::findOrFail($id);
        return response()->json($servico);
    }

    public function update(Request $request, $id)
    {
        $servico = Servico::findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'preco' => 'sometimes|required|numeric|min:0',
            'duracao' => 'sometimes|required|date_format:H:i:s',
        ]);

        $servico->update($request->only([
            'nome', 'preco', 'duracao'
        ]));

        return response()->json($servico);
    }

    public function destroy($id)
    {
        Servico::destroy($id);
        return response()->json(['message' => 'Serviço removido com sucesso.']);
    }
}
