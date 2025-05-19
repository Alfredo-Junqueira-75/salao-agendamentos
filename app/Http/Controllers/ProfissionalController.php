<?php

namespace App\Http\Controllers;

use App\Models\Profissional;
use Illuminate\Http\Request;

class ProfissionalController extends Controller
{
    public function index()
    {
        $profissionais = Profissional::with('salao')->get();
        return response()->json($profissionais);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:profissionals,email',
            'telefone' => 'nullable|string|max:20',
            'especialidade' => 'required|string|max:255',
        ]);

        $profissional = Profissional::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'telefone' => $request->telefone,
            'especialidade' => $request->especialidade,
        ]);

        return response()->json($profissional, 201);
    }

    public function show($id)
    {
        $profissional = Profissional::with('salao')->findOrFail($id);
        return response()->json($profissional);
    }

    public function update(Request $request, $id)
    {
        $profissional = Profissional::findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:profissionals,email,' . $id,
            'telefone' => 'nullable|string|max:20',
            'especialidade' => 'sometimes|required|string|max:255',
            'salao_id' => 'sometimes|required|exists:salaos,id',
        ]);

        $profissional->update($request->only([
            'nome', 'email', 'telefone', 'especialidade', 'salao_id'
        ]));

        return response()->json($profissional);
    }

    public function destroy($id)
    {
        Profissional::destroy($id);
        return response()->json(['message' => 'Profissional removido com sucesso.']);
    }
}
