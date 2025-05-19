<?php

namespace App\Http\Controllers;

use App\Models\Salao;
use Illuminate\Http\Request;

class SalaoController extends Controller
{
    public function index()
    {
        $saloes = Salao::all();
        return response()->json($saloes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string|max:255',
            'telefone' => 'required|string|max:20',
        ]);

        $salao = Salao::create([
            'nome' => $request->nome,
            'endereco' => $request->endereco,
            'telefone' => $request->telefone,
        ]);

        return response()->json($salao, 201);
    }

    public function show($id)
    {
        $salao = Salao::findOrFail($id);
        return response()->json($salao);
    }

    public function update(Request $request, $id)
    {
        $salao = Salao::findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'endereco' => 'sometimes|required|string|max:255',
            'telefone' => 'sometimes|required|string|max:20',
        ]);

        $salao->update($request->only(['nome', 'endereco', 'telefone']));

        return response()->json($salao);
    }

    public function destroy($id)
    {
        Salao::destroy($id);
        return response()->json(['message' => 'Salão removido com sucesso.']);
    }
}
