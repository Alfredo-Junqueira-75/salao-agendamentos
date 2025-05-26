<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Profissional;

class AuthAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $id = session('cliente_id');

        if (!$id) {
            return redirect()->route('admin.login.form')->with('error', 'Faça login primeiro.');
        }

        $user = Profissional::find($id);

        if (!$user || $user->tipo !== 'administrador') {
            return redirect()->route('admin.login.form')->with('error', 'Acesso restrito a administradores.');
        }

        return $next($request);
    }
}
