<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::all();
        return response()->json($clientes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'telefone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6'
        ]);

        $cliente = Cliente::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'telefone' => $request->telefone,
            'password' => bcrypt($request->password)
        ]);

        return response()->json($cliente, 201);
    }

    public function show($id)
    {
        $cliente = Cliente::findOrFail($id);
        return response()->json($cliente);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);

        $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:clientes,email,' . $id,
            'telefone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6'
        ]);

        $cliente->nome = $request->nome ?? $cliente->nome;
        $cliente->email = $request->email ?? $cliente->email;
        $cliente->telefone = $request->telefone ?? $cliente->telefone;

        if ($request->filled('password')) {
            $cliente->password = bcrypt($request->password);
        }

        $cliente->save();

        return response()->json($cliente);
    }

    public function destroy($id)
    {
        Cliente::destroy($id);
        return response()->json(['message' => 'Cliente removido com sucesso.']);
    }
}
