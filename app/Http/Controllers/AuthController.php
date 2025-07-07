<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Profissional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showSignupForm()
    {
        return view('auth.signup');
    }

    public function signup(Request $request)
    {
        $request->validate([
            'nome' => 'required',
            'email' => 'required|email|unique:clientes,email',
            'telefone' => 'nullable',
            'password' => 'required|min:6|confirmed',
        ]);

        $cliente = Cliente::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'telefone' => $request->telefone,
            'password' => Hash::make($request->password),
        ]);

        session(['cliente_id' => $cliente->id]);

        return redirect()->route('cliente.home');
    }

   public function showLoginForm()
    {
        return view('auth.login');
    }

    public function showAdminLoginForm()
    {
        return view('auth.admin-login');
    }


    public function login(Request $request)
    {
        $cliente = Cliente::where('email', $request->email)->first();

        if ($cliente && Hash::check($request->password, $cliente->password)) {
            session(['cliente_id' => $cliente->id, 'user_type' => 'cliente']);
            return redirect()->route('cliente.home');
        }

        $profissional = Profissional::where('email', $request->email)->first();

        if ($profissional && Hash::check($request->password, $profissional->senha)) {
            session(['cliente_id' => $profissional->id, 'user_type' => 'profissional']);
            return redirect()->route('profissional.home');
        }

        return back()->with('error', 'Credenciais inválidas.');
    }
    public function adminLogin(Request $request)
{
    $admin = Profissional::where('email', $request->email)
        ->where('tipo', 'administrador')
        ->first();

    if (!$admin || !Hash::check($request->password, $admin->senha)) {
        return back()->with('error', 'Credenciais inválidas ou não é um administrador.');
    }

    session(['cliente_id' => $admin->id]); // usamos a mesma session
    return redirect()->route('admin.home');
}



    public function clienteHome()
    {
        $cliente = Cliente::find(session('cliente_id'));
        return view('home-cliente', compact('cliente'));
    }

    public function adminHome()
{
    $admin = Profissional::where('id', session('cliente_id'))
              ->where('tipo', 'administrador')
              ->firstOrFail();

    return view('home-admin', compact('admin'));
}

    public function profissionalHome()
    {
        $profissional = Profissional::find(session('cliente_id'));
        return view('home-profissional', compact('profissional'));
    }


    public function logout()
    {
        session()->forget('cliente_id');
        return redirect()->route('login.form');
    }
}
