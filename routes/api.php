<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProfissionalController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\AgendamentoController;
use App\Http\Controllers\SalaoController;
use App\Http\Controllers\NotificacaoController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Defina suas rotas de API aqui
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('profissionais', ProfissionalController::class);
Route::apiResource('servicos', ServicoController::class);
Route::apiResource('agendamentos', AgendamentoController::class);
Route::apiResource('saloes', SalaoController::class);
Route::apiResource('notificacoes', NotificacaoController::class);