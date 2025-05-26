<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salão Agendamento - Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body class="min-h-screen flex flex-col bg-gray-100">
  <section class="min-h-screen flex flex-col">
    <header class="bg-white shadow-md p-4 sticky top-0 z-40">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">
          Salão <span class="text-blue-600">Agendamento</span>
        </h1>

        <nav class="hidden md:flex space-x-6 items-center">
          <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Visão Geral</a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Relatórios</a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition duration-300 font-medium">Configurações</a>

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
        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-300">Visão Geral</a>
        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-300">Relatórios</a>
        <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-300">Configurações</a>
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
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Olá, {{ $cliente->nome }}!</h2>

        <div id="agendamentos" class="tab-content">
          <h3 class="text-xl font-semibold text-gray-700 mb-6">Lista de Agendamentos</h3>
          <button id="addAgendamentoBtn"
            class="btn-primary text-white py-2 px-6 rounded-lg text-lg font-medium shadow-lg mb-6">
            Adicionar Agendamento
          </button>

          <div id="agendamentosList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {{-- Conteúdo dinâmico via JS --}}
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-white p-4 text-center mt-8">
      <p>&copy; 2025 Salão Agendamento. Todos os direitos reservados.</p>
    </footer>
  </section>

  {{-- Modais e Mensagens --}}
  <div id="modal" class="modal-overlay fixed inset-0 flex items-center justify-center z-50 hidden">
    <div class="modal-content bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
      <h3 id="modalTitle" class="text-2xl font-bold mb-6 text-gray-800"></h3>
      <form id="modalForm" class="space-y-4">
        <div class="flex justify-end space-x-4 mt-6">
          <button type="button" id="cancelBtn" class="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition duration-300">Cancelar</button>
          <button type="submit" id="saveBtn" class="btn-primary text-white py-2 px-5 rounded-lg">Salvar</button>
        </div>
      </form>
    </div>
  </div>

  <div id="messageBox" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 hidden opacity-0"></div>

  <div id="confirmationModal" class="modal-overlay fixed inset-0 flex items-center justify-center z-50 hidden">
    <div class="modal-content bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
      <h3 class="text-xl font-bold mb-4 text-gray-800">Confirmar Exclusão</h3>
      <p id="confirmationMessage" class="text-gray-700 mb-6">Tem certeza que deseja excluir este item?</p>
      <div class="flex justify-center space-x-4">
        <button type="button" id="confirmCancelBtn"
          class="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition duration-300">Cancelar</button>
        <button type="button" id="confirmDeleteBtn"
          class="bg-red-500 text-white py-2 px-5 rounded-lg hover:bg-red-600 transition duration-300">Excluir</button>
      </div>
    </div>
  </div>

  <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
