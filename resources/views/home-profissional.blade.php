<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salão Agendamento - Profissional</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link href='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/main.min.css' rel='stylesheet' />
</head>

<body class="min-h-screen flex flex-col bg-gray-100">
  <section id="dashboard-screen" class="min-h-screen flex flex-col">
    <header class="bg-white shadow-md p-4 sticky top-0 z-40">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">
          Salão <span class="text-blue-600">Agendamento</span>
        </h1>

        <nav class="hidden md:flex space-x-6 items-center">
          <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 font-medium" data-tab-button="agendamentos">Meus Agendamentos</a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 font-medium" data-tab-button="calendario">Calendário</a>
          <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
              class="text-red-500 hover:text-red-700 transition duration-300 font-medium py-2 px-4 rounded-lg border border-red-500 hover:bg-red-50 hover:border-red-700">
              Sair
            </button>
          </form>
        </nav>

        <button id="mobile-menu-button"
          class="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 transition duration-300">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>

      <div id="mobile-menu"
        class="md:hidden hidden bg-white py-2 shadow-lg transition-all duration-330 ease-in-out transform -translate-y-full opacity-0">
        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-300" data-tab-button="agendamentos">Meus Agendamentos</a>
        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-300" data-tab-button="calendario">Calendário</a>
        <form method="POST" action="{{ route('logout') }}">
          @csrf
          <button type="submit"
            class="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition duration-300">
            Sair
          </button>
        </form>
      </div>
    </header>

    <main class="flex-grow container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Olá, {{ $profissional->nome }}!</h2>

        <div id="agendamentos" class="tab-content">
          <h3 class="text-xl font-semibold text-gray-700 mb-6">Seus Agendamentos</h3>
          <div id="agendamentosList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-profissional-id="{{ $profissional->id }}">
            {{-- Conteúdo dinâmico via JS --}}
          </div>
        </div>

        <div id="calendario" class="tab-content hidden">
          <h2 class="text-2xl font-semibold text-gray-700 mb-6">Calendário de Agendamentos</h2>
          <div id="calendar"></div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-white p-4 text-center mt-8">
      <p>&copy; 2025 Salão Agendamento. Todos os direitos reservados.</p>
    </footer>
  </section>

  <script src="{{ asset('js/app.js') }}"></script>
  <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js'></script>
</body>
</html>
