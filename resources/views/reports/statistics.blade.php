<!DOCTYPE html>
<html>
<head>
    <title>Relatório de Estatísticas do Salão</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Relatório de Estatísticas do Salão</h1>
    <p>Gerado em: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</p>

    <h2>Resumo Geral</h2>
    <table>
        <tr>
            <th>Métrica</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>Total de Clientes</td>
            <td>{{ $totalClientes }}</td>
        </tr>
        <tr>
            <td>Total de Profissionais</td>
            <td>{{ $totalProfissionais }}</td>
        </tr>
        <tr>
            <td>Total de Serviços</td>
            <td>{{ $totalServicos }}</td>
        </tr>
        <tr>
            <td>Total de Agendamentos</td>
            <td>{{ $totalAgendamentos }}</td>
        </tr>
    </table>

    <h2>Agendamentos por Status</h2>
    <table>
        <tr>
            <th>Status</th>
            <th>Quantidade</th>
        </tr>
        @foreach($agendamentosPorStatus as $status => $count)
        <tr>
            <td>{{ ucfirst($status) }}</td>
            <td>{{ $count }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>
