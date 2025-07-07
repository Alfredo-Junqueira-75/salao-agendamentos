<?php

namespace App\Http\Controllers;

use App\Models\Agendamento;
use App\Models\Cliente;
use App\Models\Profissional;
use App\Models\Servico;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generateReport()
    {
        $totalClientes = Cliente::count();
        $totalProfissionais = Profissional::count();
        $totalServicos = Servico::count();
        $totalAgendamentos = Agendamento::count();

        $agendamentosPorStatus = Agendamento::select('status')
            ->selectRaw('count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $data = [
            'totalClientes' => $totalClientes,
            'totalProfissionais' => $totalProfissionais,
            'totalServicos' => $totalServicos,
            'totalAgendamentos' => $totalAgendamentos,
            'agendamentosPorStatus' => $agendamentosPorStatus,
        ];

        $pdf = Pdf::loadView('reports.statistics', $data);
        return $pdf->download('relatorio_estatistico.pdf');
    }
}
