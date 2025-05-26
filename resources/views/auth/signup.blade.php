<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Salao Agendamento - Cadastro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="{{ asset('css/app.css') }}" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>

<body class="min-h-screen flex flex-col bg-gray-100">
  <section class="flex-grow flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 animate-gradient-shift">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-white opacity-10 rounded-full mix-blend-overlay animate-blob"></div>
      <div class="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white opacity-10 rounded-full mix-blend-overlay animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 right-1/4 w-72 h-72 bg-white opacity-10 rounded-full mix-blend-overlay animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative z-10 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-500 ease-in-out scale-95 opacity-0 pointer-events-none"
         id="login-card">
      <h2 class="text-4xl font-extrabold text-center text-gray-800 mb-8">Criar conta</h2>

      @if ($errors->any())
        <div class="mb-4 text-red-600 text-center font-semibold">
          {{ $errors->first() }}
        </div>
      @endif

      <form method="POST" action="{{ route('signup') }}" class="space-y-6">
        @csrf
        <div>
          <label for="nome" class="block text-gray-700 text-sm font-semibold mb-2">Nome</label>
          <input type="text" name="nome" id="nome" required
                 class="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition duration-300"
                 placeholder="Seu nome completo">
        </div>

        <div>
          <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input type="email" name="email" id="email" required
                 class="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition duration-300"
                 placeholder="Seu email">
        </div>

        <div>
          <label for="telefone" class="block text-gray-700 text-sm font-semibold mb-2">Telefone</label>
          <input type="tel" name="telefone" id="telefone"
                 class="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition duration-300"
                 placeholder="Ex: 923000000">
        </div>

        <div>
          <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Senha</label>
          <input type="password" name="password" id="password" required
                 class="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition duration-300"
                 placeholder="Crie uma senha">
        </div>

        <div>
          <label for="password_confirmation" class="block text-gray-700 text-sm font-semibold mb-2">Confirmar senha</label>
          <input type="password" name="password_confirmation" id="password_confirmation" required
                 class="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition duration-300"
                 placeholder="Digite a senha novamente">
        </div>

        <button type="submit"
                class="w-full btn-primary text-white py-3 px-6 rounded-lg text-xl font-bold shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
          Registar
        </button>
      </form>

      <p class="text-center text-gray-600 text-sm mt-6">
        Já possui uma conta?
        <a href="{{ route('login.form') }}" class="text-blue-600 hover:underline font-medium">Faça login aqui</a>
      </p>
    </div>
  </section>
</body>

</html>
