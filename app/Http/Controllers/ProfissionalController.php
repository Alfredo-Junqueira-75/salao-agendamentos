<?php

namespace App\Http\Controllers;

use App\Models\Profissional;
use Illuminate\Http\Request;

class ProfissionalController extends Controller
{
    public function index()
    {
        $profissionais = Profissional::all(); // Removido with('salao')
        return response()->json($profissionais);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'especialidade' => 'required|string|max:255',
            'horarioTrabalho' => 'required|string|max:255',
            'email' => 'required|email|unique:profissionals,email',
            'senha' => 'required|string|min:6',
            'tipo' => 'required|in:profissional,administrador',
            'telefone' => 'nullable|string|max:20',
        ]);

        $profissional = Profissional::create([
            'nome' => $request->nome,
            'especialidade' => $request->especialidade,
            'horarioTrabalho' => $request->horarioTrabalho,
            'email' => $request->email,
            'senha' => bcrypt($request->senha), // senha criptografada
            'tipo' => $request->tipo,
            'telefone' => $request->telefone,
        ]);

        return response()->json($profissional, 201);
    }

    public function show($id)
    {
        $profissional = Profissional::findOrFail($id);
        return response()->json($profissional);
    }

    public function update(Request $request, $id)
    {
        $profissional = Profissional::findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'especialidade' => 'sometimes|required|string|max:255',
            'horarioTrabalho' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:profissionals,email,' . $id,
            'senha' => 'nullable|string|min:6',
            'tipo' => 'sometimes|required|in:profissional,administrador',
            'telefone' => 'nullable|string|max:20',
        ]);

        $profissional->fill($request->only([
            'nome', 'especialidade', 'horarioTrabalho',
        ]));

        if ($request->filled('senha')) {
            $profissional->senha = bcrypt($request->senha);
        }

        $profissional->save();

        return response()->json($profissional);
    }

    public function destroy($id)
    {
        $profissional = Profissional::findOrFail($id);
        $profissional->delete();
        return response()->json(['message' => 'Profissional removido com sucesso.']);
    }
}
