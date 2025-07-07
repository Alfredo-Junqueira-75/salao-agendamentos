const BASE_URL = 'http://localhost:8000/api/'; // URL da API atualizada para a porta 8000

// Elementos da tela de login (apenas para login.html)
const loginForm = document.getElementById('loginForm'); // Pode ser null se estiver no index.html
const loginCard = document.getElementById('login-card'); // Pode ser null se estiver no index.html

// Elementos do Dashboard (apenas para index.html)
const dashboardScreen = document.getElementById('dashboard-screen'); // Pode ser null se estiver no login.html
const logoutBtn = document.getElementById('logoutBtn'); // Pode ser null se estiver no login.html
const mobileLogoutBtn = document.getElementById('mobile-logoutBtn'); // Novo botão de logout para mobile

// Elementos do Modal (presente em ambos os ficheiros, mas usado no dashboard)
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const cancelBtn = document.getElementById('cancelBtn'); // Este é o botão de cancelar do modal principal

// Elementos do Message Box (presente em ambos os ficheiros)
const messageBox = document.getElementById('messageBox');

// Elementos do Confirmation Modal (presente em ambos os ficheiros, mas usado no dashboard)
const confirmationModal = document.getElementById('confirmationModal');
const confirmationMessage = document.getElementById('confirmationMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Elementos do menu mobile
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

let currentEntityType = '';
let currentEntityId = null;
let currentEntityData = null; // Variável para armazenar os dados da entidade sendo editada
let deleteConfirmedCallback = null; // Callback para o modal de confirmação

// Definições de especialidades e status para select
const especialidadesProfissional = ['Cabelereiro(a)', 'Manicure', 'Pedicure', 'Esteticista', 'Maquiador(a)', 'Barbeiro(a)', 'Outro'];
const statusAgendamento = ['Pendente', 'Confirmado', 'Concluído', 'Cancelado'];
const tiposProfissional = ['profissional', 'administrador'];

// Variáveis globais para armazenar dados de lookup
let allClientes = [];
let allProfissionais = [];
let allServicos = [];
let allSaloes = [];


/**
 * Exibe uma mensagem de notificação para o utilizador.
 * Pode receber uma string ou um objeto de erros para formatação.
 * @param {string|Object} message - A mensagem ou objeto de erros a ser exibida.
 * @param {'info'|'success'|'error'} type - O tipo da mensagem (info, success, error).
 */
function showMessage(message, type = 'info') {
  if (!messageBox) return; // Garante que o elemento existe

  let displayMessage = '';
  if (typeof message === 'string') {
    displayMessage = message;
  } else if (typeof message === 'object' && message.errors) {
    // Se for um objeto de erros do Laravel, formata-o
    displayMessage = Object.values(message.errors).flat().join('<br>');
  } else if (typeof message === 'object' && message.message) {
    displayMessage = message.message;
  } else {
    displayMessage = 'Ocorreu um erro desconhecido.';
  }

  messageBox.innerHTML = displayMessage; // Usa innerHTML para quebrar linhas
  messageBox.classList.remove('hidden', 'bg-green-500', 'bg-red-500', 'bg-blue-500');
  messageBox.classList.add('opacity-0'); // Garante que começa transparente para a animação

  if (type === 'success') {
    messageBox.classList.add('bg-green-500');
  } else if (type === 'error') {
    messageBox.classList.add('bg-red-500');
  } else {
    messageBox.classList.add('bg-blue-500');
  }

  messageBox.classList.remove('opacity-0');
  messageBox.classList.add('animate-fadeIn'); // Aplica a animação

  setTimeout(() => {
    messageBox.classList.add('opacity-0'); // Começa a desaparecer
    messageBox.classList.remove('animate-fadeIn');
    setTimeout(() => {
      messageBox.classList.add('hidden'); // Esconde após a transição
    }, 300); // Tempo da transição de opacidade
  }, 5000); // Mensagem visível por mais tempo para erros (5 segundos)
}

/**
 * Abre o modal de confirmação personalizado.
 * @param {string} message - A mensagem a ser exibida no modal.
 * @param {function} onConfirm - A função a ser executada se o utilizador confirmar.
 */
function openConfirmationModal(message, onConfirm) {
  if (!confirmationModal) return; // Garante que o elemento existe

  confirmationMessage.textContent = message;
  deleteConfirmedCallback = onConfirm;
  confirmationModal.classList.remove('hidden');
}

/**
 * Fecha o modal de confirmação personalizado.
 */
function closeConfirmationModal() {
  if (!confirmationModal) return; // Garante que o elemento existe
  confirmationModal.classList.add('hidden');
  deleteConfirmedCallback = null;
}

// Event listeners para o modal de confirmação (apenas se os elementos existirem)
if (confirmCancelBtn) {
  confirmCancelBtn.addEventListener('click', closeConfirmationModal);
}
if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener('click', () => {
    if (deleteConfirmedCallback) {
      deleteConfirmedCallback();
    }
    closeConfirmationModal();
  });
}


/**
 * Busca dados da API.
 * @param {string} endpoint - O endpoint da API (ex: 'clientes').
 * @returns {Promise<Array>} - Uma promessa que resolve com os dados.
 */
async function fetchData(endpoint, params = {}) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    showMessage(`Erro ao carregar ${endpoint}.`, 'error');
    throw error; // Re-throw the error so loadData can handle it
  }
}

let calendarInstance = null; // Global variable to hold the calendar instance

async function initializeCalendar(calendarEl, professionalId = null) {
  if (!calendarEl) return;

  if (calendarInstance) {
    calendarInstance.destroy(); // Destroy existing calendar instance if any
  }

  calendarInstance = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: async (fetchInfo, successCallback, failureCallback) => {
      try {
        const params = {
          start: fetchInfo.startStr,
          end: fetchInfo.endStr,
        };
        if (professionalId) {
          params.profissional_id = professionalId;
        }
        const agendamentos = await fetchData('agendamentos', params);
        const events = agendamentos.map(agendamento => ({
          id: agendamento.id,
          title: `${getServiceName(agendamento.servico_id)} - ${getClientName(agendamento.cliente_id)}`,
          start: agendamento.data_hora,
          extendedProps: {
            status: agendamento.status,
            cliente_id: agendamento.cliente_id,
            profissional_id: agendamento.profissional_id,
            servico_id: agendamento.servico_id,
            salao_id: agendamento.salao_id,
          },
          color: agendamento.status === 'confirmado' ? '#34D399' : (agendamento.status === 'cancelado' ? '#EF4444' : '#F59E0B'), // Tailwind green, red, yellow
        }));
        successCallback(events);
      } catch (error) {
        failureCallback(error);
      }
    },
    eventClick: function(info) {
      // Reutiliza o modal existente para edição/visualização
      openModal('agendamentos', info.event.id);
    },
    dateClick: function(info) {
      // Permite adicionar um novo agendamento ao clicar em uma data
      // Preenche a data/hora no modal
      openModal('agendamentos');
      setTimeout(() => {
        const dateTimeInput = modalForm.querySelector('input[name="data_hora"]');
        if (dateTimeInput) {
          dateTimeInput.value = info.dateStr.slice(0, 16); // Format to YYYY-MM-DDTHH:MM
        }
      }, 100);
    }
  });
  calendarInstance.render();
}

// Funções auxiliares para obter nomes a partir de IDs
function getClientName(id) {
  const client = allClientes.find(c => c.id == id);
  return client ? client.nome : `Cliente #${id}`;
}

function getProfessionalName(id) {
  const professional = allProfissionais.find(p => p.id == id);
  return professional ? professional.nome : `Profissional #${id}`;
}

function getServiceName(id) {
  const service = allServicos.find(s => s.id == id);
  return service ? service.nome : `Serviço #${id}`;
}

function getSalaoName(id) {
  const salao = allSaloes.find(s => s.id == id);
  return salao ? salao.nome : `Salão #${id}`;
}


/**
 * Renderiza a lista de clientes na UI.
 * @param {Array<Object>} clientes - Array de objetos cliente.
 */
function renderClientes(clientes) {
  const clientesList = document.getElementById('clientesList');
  if (!clientesList) return;
  clientesList.innerHTML = '';
  if (clientes.length === 0) {
    clientesList.innerHTML = '<p class="text-gray-500">Nenhum cliente encontrado.</p>';
    return;
  }
  clientes.forEach(cliente => {
    const card = `
            <div class="card bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${cliente.nome}</h3>
                <p class="text-gray-600"><strong>Email:</strong> ${cliente.email}</p>
                <p class="text-gray-600"><strong>Telefone:</strong> ${cliente.telefone}</p>
                <div class="mt-4 flex space-x-2">
                    <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300" data-id="${cliente.id}" data-type="cliente">Editar</button>
                    <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300" data-id="${cliente.id}" data-type="cliente">Excluir</button>
                </div>
            </div>
        `;
    clientesList.innerHTML += card;
  });
  attachEventListeners();
}

/**
 * Renderiza a lista de profissionais na UI.
 * @param {Array<Object>} profissionais - Array de objetos profissional.
 */
function renderProfissionais(profissionais) {
  const profissionaisList = document.getElementById('profissionaisList');
  if (!profissionaisList) return;
  profissionaisList.innerHTML = '';
  if (profissionais.length === 0) {
    profissionaisList.innerHTML = '<p class="text-gray-500">Nenhum profissional encontrado.</p>';
    return;
  }
  profissionais.forEach(profissional => {
    const card = `
            <div class="card bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${profissional.nome}</h3>
                <p class="text-gray-600"><strong>Email:</strong> ${profissional.email}</p>
                <p class="text-gray-600"><strong>Telefone:</strong> ${profissional.telefone}</p>
                <p class="text-gray-600"><strong>Especialidade:</strong> ${profissional.especialidade}</p>
                <p class="text-gray-600"><strong>Tipo:</strong> ${profissional.tipo || 'N/A'}</p>
                <p class="text-gray-600"><strong>Horário:</strong> ${profissional.horarioTrabalho || 'N/A'}</p>
                <div class="mt-4 flex space-x-2">
                    <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300" data-id="${profissional.id}" data-type="profissionais">Editar</button>
                    <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300" data-id="${profissional.id}" data-type="profissionais">Excluir</button>
                </div>
            </div>
        `;
    profissionaisList.innerHTML += card;
  });
  attachEventListeners();
}

/**
 * Renderiza a lista de serviços na UI.
 * @param {Array<Object>} servicos - Array de objetos serviço.
 */
function renderServicos(servicos) {
  const servicosList = document.getElementById('servicosList');
  if (!servicosList) return;
  servicosList.innerHTML = '';
  if (servicos.length === 0) {
    servicosList.innerHTML = '<p class="text-gray-500">Nenhum serviço encontrado.</p>';
    return;
  }
  servicos.forEach(servico => {
    const card = `
            <div class="card bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${servico.nome}</h3>
                <p class="text-gray-600"><strong>Preço:</strong> ${servico.preco} Kz</p>
                <p class="text-gray-600"><strong>Duração:</strong> ${servico.duracao}</p>
                <div class="mt-4 flex space-x-2">
                    <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300" data-id="${servico.id}" data-type="servicos">Editar</button>
                    <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300" data-id="${servico.id}" data-type="servicos">Excluir</button>
                </div>
            </div>
        `;
    servicosList.innerHTML += card;
  });
  attachEventListeners();
}

/**
 * Renderiza a lista de agendamentos na UI.
 * @param {Array<Object>} agendamentos - Array de objetos agendamento.
 */
function renderAgendamentos(agendamentos) {
  const agendamentosList = document.getElementById('agendamentosList');
  if (!agendamentosList) return;
  agendamentosList.innerHTML = '';
  if (agendamentos.length === 0) {
    agendamentosList.innerHTML = '<p class="text-gray-500">Nenhum agendamento encontrado.</p>';
    return;
  }

  const isProfessionalPage = agendamentosList.dataset.profissionalId !== undefined;
  const isClientPage = agendamentosList.dataset.clienteId !== undefined;

  agendamentos.forEach(agendamento => {
    let buttonsHtml = '';

    if (!isProfessionalPage && !isClientPage) { // Admin page
      buttonsHtml += `
            <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300" data-id="${agendamento.id}" data-type="agendamentos">Editar</button>
            <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300" data-id="${agendamento.id}" data-type="agendamentos">Excluir</button>
        `;
    }

    if (isProfessionalPage && agendamento.status === 'pendente') {
      buttonsHtml += `
            <button class="confirm-btn bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-300" data-id="${agendamento.id}">Confirmar</button>
            <button class="cancel-btn bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-300" data-id="${agendamento.id}">Cancelar</button>
        `;
    }

    const card = `
            <div class="card bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Agendamento #${agendamento.id}</h3>
                <p class="text-gray-600"><strong>Data/Hora:</strong> ${new Date(agendamento.data_hora).toLocaleString('pt-BR')}</p>
                <p class="text-gray-600"><strong>Status:</strong> ${agendamento.status}</p>
                <p class="text-gray-600"><strong>Cliente:</strong> ${getClientName(agendamento.cliente_id)}</p>
                <p class="text-gray-600"><strong>Profissional:</strong> ${getProfessionalName(agendamento.profissional_id)}</p>
                <p class="text-gray-600"><strong>Serviço:</strong> ${getServiceName(agendamento.servico_id)}</p>
                <p class="text-gray-600"><strong>Salão:</strong> ${getSalaoName(agendamento.salao_id)}</p>
                <div class="mt-4 flex space-x-2">
                    ${buttonsHtml}
                </div>
            </div>
        `;
    agendamentosList.innerHTML += card;
  });
  attachEventListeners();
}

/**
 * Renderiza a lista de salões na UI.
 * @param {Array<Object>} saloes - Array de objetos salão.
 */
function renderSaloes(saloes) {
  const saloesList = document.getElementById('saloesList');
  if (!saloesList) return;
  saloesList.innerHTML = '';
  if (saloes.length === 0) {
    saloesList.innerHTML = '<p class="text-gray-500">Nenhum salão encontrado.</p>';
    return;
  }
  saloes.forEach(salao => {
    const card = `
            <div class="card bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${salao.nome}</h3>
                <p class="text-gray-600"><strong>Endereço:</strong> ${salao.endereco}</p>
                <p class="text-gray-600"><strong>Telefone:</strong> ${salao.telefone}</p>
                <div class="mt-4 flex space-x-2">
                    <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300" data-id="${salao.id}" data-type="saloes">Editar</button>
                    <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300" data-id="${salao.id}" data-type="saloes">Excluir</button>
                </div>
            </div>
        `;
    saloesList.innerHTML += card;
  });
  attachEventListeners();
}

// Mapeamento de endpoints para funções de renderização
const renderFunctions = {
  clientes: renderClientes,
  profissionais: renderProfissionais,
  servicos: renderServicos,
  agendamentos: renderAgendamentos,
  saloes: renderSaloes
};

// Mapeamento de campos para cada tipo de entidade (consultado na documentação da API e fillable)
const entityFields = {
  clientes: [
    { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: João Silva' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Ex: joao.silva@email.com' },
    { name: 'telefone', label: 'Telefone', type: 'tel', required: true, placeholder: 'Ex: 999999999' },
    { name: 'password', label: 'Senha', type: 'password', required: false, placeholder: 'Mínimo 6 caracteres' } // 'password' no fillable do Cliente
  ],
  profissionais: [
    { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: Maria Oliveira' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Ex: maria.o@email.com' },
    { name: 'telefone', label: 'Telefone', type: 'tel', required: true, placeholder: 'Ex: 923000000' },
    { name: 'senha', label: 'Senha', type: 'password', required: false, placeholder: 'Mínimo 6 caracteres' }, // 'senha' no fillable do Profissional
    { name: 'tipo', label: 'Tipo', type: 'select', options: tiposProfissional, required: true }, // 'tipo' agora é um select com opções corrigidas
    { name: 'especialidade', label: 'Especialidade', type: 'select', options: especialidadesProfissional, required: true },
    { name: 'horarioTrabalho', label: 'Horário de Trabalho', type: 'text', required: false, placeholder: 'Ex: Seg-Sex 09:00-18:00', helperText: 'Formato: Dia(s) HH:MM-HH:MM' } // 'horarioTrabalho' adicionado com placeholder e helperText
    // 'agendamentos' é um relacionamento, não um campo de formulário direto
  ],
  servicos: [
    { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: Corte de Cabelo' },
    { name: 'preco', label: 'Preço', type: 'number', required: true, placeholder: 'Ex: 3000' },
    { name: 'duracao', label: 'Duração (HH:MM:SS)', type: 'text', required: true, placeholder: 'Ex: 00:30:00', helperText: 'Formato: HH:MM:SS' } // 'duracao' no fillable com placeholder e helperText
  ],
  agendamentos: [
    { name: 'data_hora', label: 'Data e Hora', type: 'datetime-local', required: true }, // 'data_hora' no fillable
    { name: 'status', label: 'Status', type: 'select', options: statusAgendamento, required: true }, // 'status' no fillable
    { name: 'cliente_id', label: 'Cliente', type: 'select-dynamic', endpoint: 'clientes', displayField: 'nome', required: true }, // 'cliente_id' no fillable
    { name: 'profissional_id', label: 'Profissional', type: 'select-dynamic', endpoint: 'profissionais', displayField: 'nome', required: true }, // 'profissional_id' no fillable
    { name: 'servico_id', label: 'Serviço', type: 'select-dynamic', endpoint: 'servicos', displayField: 'nome', required: true }, // 'servico_id' no fillable
    { name: 'salao_id', label: 'Salão', type: 'select-dynamic', endpoint: 'saloes', displayField: 'nome', required: true } // 'salao_id' no fillable
  ],
  saloes: [
    { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: Salão Beleza Total' },
    { name: 'endereco', label: 'Endereço', type: 'text', required: true, placeholder: 'Ex: Rua Principal, 123' },
    { name: 'telefone', label: 'Telefone', type: 'tel', required: true, placeholder: 'Ex: 912345678' }
  ]
};

/**
 * Cria um input de seleção (dropdown) dinamicamente.
 * @param {Object} field - Objeto de configuração do campo.
 * @param {Array<Object>} optionsData - Dados para popular as opções (ex: lista de clientes).
 * @param {any} selectedValue - O valor pré-selecionado.
 * @returns {HTMLSelectElement} - O elemento <select> criado.
 */
function createSelectInput(field, optionsData, selectedValue) {
  const select = document.createElement('select');
  select.id = field.name;
  select.name = field.name;
  select.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  select.required = field.required;

  // Adiciona uma opção padrão (vazia ou "Selecione...")
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = `Selecione um(a) ${field.label.toLowerCase()}`;
  // defaultOption.disabled = true; // Removido disabled para permitir seleção de vazio se necessário
  defaultOption.selected = true; // Selecionado por padrão até que um valor seja escolhido
  select.appendChild(defaultOption);

  if (field.type === 'select') { // Para opções predefinidas (especialidade, status, tipo)
    field.options.forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText.charAt(0).toUpperCase() + optionText.slice(1); // Capitaliza a primeira letra para exibição
      if (selectedValue === optionText) {
        option.selected = true;
        defaultOption.selected = false; // Desseleciona a opção padrão
      }
      select.appendChild(option);
    });
  } else if (field.type === 'select-dynamic') { // Para opções carregadas da API (clientes, profissionais, etc.)
    optionsData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id; // O valor será o ID do item
      option.textContent = item[field.displayField]; // O texto visível será o nome/título do item
      if (selectedValue == item.id) { // Usa '==' para comparar número com string
        option.selected = true;
        defaultOption.selected = false; // Desseleciona a opção padrão
      }
      select.appendChild(option);
    });
  }
  return select;
}


/**
 * Abre o modal para adicionar ou editar uma entidade.
 * @param {string} type - O tipo da entidade (ex: 'clientes').
 * @param {string|null} id - O ID da entidade para edição, ou null para adição.
 */
async function openModal(type, id = null) {
  if (!modal || !modalForm) return; // Garante que os elementos do modal existem

  currentEntityType = type;
  currentEntityId = id;
  modalForm.innerHTML = ''; // Limpa campos anteriores

  const fields = entityFields[type];
  modalTitle.textContent = id ? `Editar ${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(0, -1).slice(1)}` : `Adicionar ${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(0, -1).slice(1)}`;

  // Se estiver editando, busca os dados atuais da entidade
  if (id) {
    try {
      const response = await axios.get(`${BASE_URL}${type}/${id}`);
      currentEntityData = response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${type} para edição:`, error);
      showMessage(`Erro ao carregar dados para edição.`, 'error');
      closeModal();
      return;
    }
  } else {
    currentEntityData = {}; // Para novas entradas
  }

  // Mapeamento para carregar dados para selects dinâmicos
  const dynamicSelectDataPromises = {};
  for (const field of fields) {
    if (field.type === 'select-dynamic') {
      dynamicSelectDataPromises[field.name] = fetchData(field.endpoint);
    }
  }
  const dynamicSelectData = {};
  for (const key in dynamicSelectDataPromises) {
    dynamicSelectData[key] = await dynamicSelectDataPromises[key];
  }

  const agendamentosList = document.getElementById('agendamentosList');
  const clienteId = agendamentosList ? agendamentosList.dataset.clienteId : null;

  for (const field of fields) {
    if (type === 'agendamentos' && id === null && field.name === 'cliente_id' && clienteId) {
        const div = document.createElement('div');
        div.className = 'mb-4';
        const label = document.createElement('label');
        label.htmlFor = field.name;
        label.className = 'block text-gray-700 text-sm font-bold mb-2';
        label.textContent = field.label;
        div.appendChild(label);

        const clienteNome = document.querySelector('h2').textContent.replace('Olá, ', '').replace('!', '');
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200';
        textInput.value = clienteNome;
        textInput.disabled = true;
        div.appendChild(textInput);

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'cliente_id';
        hiddenInput.value = clienteId;
        div.appendChild(hiddenInput);

        modalForm.appendChild(div);
        continue;
    }

    // Não mostra o campo de senha ao editar
    if (id && (field.name === 'password' || field.name === 'senha')) {
      // Para edição, a senha não é preenchida e não é obrigatória
      field.required = false;
      // Se o campo for de senha e estiver editando, vamos renderizá-lo, mas ele não será obrigatório
      // e o valor preenchido será vazio, a menos que o usuário o altere.
    }

    const div = document.createElement('div');
    div.className = 'mb-4';
    const label = document.createElement('label');
    label.htmlFor = field.name;
    label.className = 'block text-gray-700 text-sm font-bold mb-2';
    label.textContent = field.label;
    div.appendChild(label);

    let inputElement;
    const fieldValue = currentEntityData[field.name];

    if (field.type === 'select' || field.type === 'select-dynamic') {
      const optionsData = field.type === 'select' ? null : dynamicSelectData[field.name];
      inputElement = createSelectInput(field, optionsData, fieldValue);
    } else {
      inputElement = document.createElement('input');
      inputElement.type = field.type;
      inputElement.id = field.name;
      inputElement.name = field.name;
      inputElement.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
      inputElement.required = field.required;

      // Adiciona placeholder se definido
      if (field.placeholder) {
        inputElement.placeholder = field.placeholder;
      }

      if (field.type === 'datetime-local' && fieldValue) {
        const date = new Date(fieldValue);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        inputElement.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      } else {
        inputElement.value = fieldValue || '';
      }
    }
    div.appendChild(inputElement);

    // Adiciona helperText se definido
    if (field.helperText) {
      const helperTextElement = document.createElement('p');
      helperTextElement.className = 'text-gray-500 text-xs mt-1';
      helperTextElement.textContent = field.helperText;
      div.appendChild(helperTextElement);
    }

    modalForm.appendChild(div);
  }

  // Adiciona botões de salvar e cancelar
  const buttonContainer = `
        <div class="flex justify-end space-x-4 mt-6">
            <button type="button" id="cancelBtnModal" class="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition duration-300">Cancelar</button>
            <button type="submit" id="saveBtnModal" class="btn-primary text-white py-2 px-5 rounded-lg">Salvar</button>
        </div>
    `;
  modalForm.insertAdjacentHTML('beforeend', buttonContainer);

  // Adiciona event listener para o novo botão de cancelar do modal
  const cancelBtnModal = document.getElementById('cancelBtnModal');
  if (cancelBtnModal) {
    cancelBtnModal.onclick = closeModal;
  }
  modal.classList.remove('hidden');
}

/**
 * Fecha o modal.
 */
function closeModal() {
  if (!modal) return; // Garante que o elemento existe
  modal.classList.add('hidden');
  currentEntityData = null; // Limpa os dados da entidade atual
}

// Event listener para submissão do formulário do modal (apenas se o modalForm existir)
if (modalForm) {
  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(modalForm);
    const data = {};
    for (let [key, value] of formData.entries()) {
      // Converte IDs numéricos de volta para número e trata data/hora
      if (['cliente_id', 'profissional_id', 'servico_id', 'salao_id', 'preco'].includes(key)) {
        data[key] = parseFloat(value);
      } else if (key === 'data_hora') { // Corrigido para data_hora
        // Formata a data/hora para o formato ISO 8601 exigido pela API (YYYY-MM-DDTHH:MM:SS)
        data[key] = new Date(value).toISOString().slice(0, 19); // Remove Z e milissegundos
      } else {
        data[key] = value;
      }
    }

    // Para campos de senha (password/senha), se estiver vazio na edição, não enviar
    if (currentEntityId) {
      if (data.password === "") {
        delete data.password;
      }
      if (data.senha === "") {
        delete data.senha;
      }
    }

    try {
      if (currentEntityId) {
        // Atualizar
        await axios.put(`${BASE_URL}${currentEntityType}/${currentEntityId}`, data);
        showMessage('Item atualizado com sucesso!', 'success');
      } else {
        // Criar
        await axios.post(`${BASE_URL}${currentEntityType}`, data);
        showMessage('Item adicionado com sucesso!', 'success');
      }
      closeModal();
      loadData(currentEntityType); // Recarrega a lista
    } catch (error) {
      console.error(`Erro ao salvar ${currentEntityType}:`, error);
      // Tenta obter uma mensagem de erro mais específica da resposta da API
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : `Erro ao salvar item.`;
      showMessage(errorMessage, 'error'); // Passa o objeto de erro para showMessage
    }
  });
}


/**
 * Anexa event listeners aos botões de editar e excluir.
 */
function attachEventListeners() {
  // Use event delegation on a common parent element (e.g., document.body)
  // This ensures that event listeners work for dynamically added elements.
  document.body.addEventListener('click', async (e) => {
    const target = e.target;

    // Handle Edit button click
    if (target.classList.contains('edit-btn')) {
      const id = target.dataset.id;
      const type = target.dataset.type;
      openModal(type, id);
    }
    // Handle Delete button click
    else if (target.classList.contains('delete-btn')) {
      const id = target.dataset.id;
      const type = target.dataset.type;

      openConfirmationModal(`Tem certeza que deseja excluir este ${type}?`, async () => {
        try {
          await axios.delete(`${BASE_URL}${type}/${id}`);
          showMessage('Item excluído com sucesso!', 'success');
          loadData(type); // Recarrega a lista
        } catch (error) {
          console.error(`Erro ao excluir ${type}:`, error);
          const errorMessage = error.response && error.response.data
            ? error.response.data
            : `Erro ao excluir item.`;
          showMessage(errorMessage, 'error');
        }
      });
    }
    // Handle Confirm button click (for agendamentos)
    else if (target.classList.contains('confirm-btn')) {
      const id = target.dataset.id;
      openConfirmationModal('Tem certeza que deseja confirmar este agendamento?', async () => {
        try {
          await axios.put(`${BASE_URL}agendamentos/${id}`, { status: 'confirmado' });
          showMessage('Agendamento confirmado com sucesso!', 'success');
          loadData('agendamentos');
        } catch (error) {
          console.error('Erro ao confirmar agendamento:', error);
          showMessage('Erro ao confirmar agendamento.', 'error');
        }
      });
    }
    // Handle Cancel button click (for agendamentos)
    else if (target.classList.contains('cancel-btn')) {
      const id = target.dataset.id;
      openConfirmationModal('Tem certeza que deseja cancelar este agendamento?', async () => {
        try {
          await axios.put(`${BASE_URL}agendamentos/${id}`, { status: 'cancelado' });
          showMessage('Agendamento cancelado com sucesso!', 'success');
          loadData('agendamentos');
        } catch (error) {
          console.error('Erro ao cancelar agendamento:', error);
          showMessage('Erro ao cancelar agendamento.', 'error');
        }
      });
    }
  });
}

/**
 * Carrega e renderiza os dados para a aba ativa.
 * @param {string} entityType - O tipo da entidade a ser carregada (ex: 'clientes').
 */
async function loadData(entityType) {
  const agendamentosList = document.getElementById('agendamentosList');
  const profissionalId = agendamentosList ? agendamentosList.dataset.profissionalId : null;
  const clienteId = agendamentosList ? agendamentosList.dataset.clienteId : null;

  // Fetch all lookup data if it's for agendamentos or if it's not already loaded
  // This ensures lookup data is available when needed for rendering or dynamic selects
  try {
    allClientes = await fetchData('clientes');
    allProfissionais = await fetchData('profissionais');
    allServicos = await fetchData('servicos');
    allSaloes = await fetchData('saloes');
  } catch (error) {
    console.error("Erro ao carregar dados de lookup:", error);
    showMessage("Erro ao carregar dados de referência para agendamentos.", 'error');
    // Continue loading main data even if lookup fails
  }

  let data = []; // Initialize data as an empty array
  try {
    if (entityType === 'agendamentos' && (profissionalId || clienteId)) {
      const params = {};
      if (profissionalId) params.profissional_id = profissionalId;
      if (clienteId) params.cliente_id = clienteId;
      data = await fetchData(entityType, params);
    } else {
      data = await fetchData(entityType);
    }
  } catch (error) {
    // Error already shown by fetchData, just prevent rendering with bad data
    return; 
  }

  if (renderFunctions[entityType]) {
    renderFunctions[entityType](data);
  }
}

// Event Listeners para botões de adicionar (apenas se existirem no DOM atual)
if (document.getElementById('addClienteBtn')) {
  document.getElementById('addClienteBtn').onclick = () => openModal('clientes');
}
if (document.getElementById('addProfissionalBtn')) {
  document.getElementById('addProfissionalBtn').onclick = () => openModal('profissionais');
}
if (document.getElementById('addServicoBtn')) {
  document.getElementById('addServicoBtn').onclick = () => openModal('servicos');
}
if (document.getElementById('addAgendamentoBtn')) {
  document.getElementById('addAgendamentoBtn').onclick = () => openModal('agendamentos');
}
if (document.getElementById('addSalaoBtn')) {
  document.getElementById('addSalaoBtn').onclick = () => openModal('saloes');
}


// Lógica das abas (apenas se existirem no DOM atual)
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    const tabId = e.target.dataset.tab;
    document.getElementById(tabId).classList.remove('hidden');
    if (tabId === 'calendario') {
      const calendarEl = document.getElementById('calendar');
      const profissionalId = document.querySelector('[data-profissional-id]') ? document.querySelector('[data-profissional-id]').dataset.profissionalId : null;
      initializeCalendar(calendarEl, profissionalId);
    } else {
      loadData(tabId); // Carrega os dados da nova aba
    }
  });
});

// Lógica de Login (específica para login.html)
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Em um cenário real, você enviaria as credenciais para o backend aqui.
    // Como a API não tem autenticação, simulamos um login bem-sucedido.
    showMessage('Login bem-sucedido!', 'success');
    // Redireciona para o dashboard
    window.location.href = 'index.html';
  });
}

// Lógica de Logout (específica para index.html)
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    showMessage('Sessão encerrada.', 'info');
    // Redireciona para a tela de login
    window.location.href = 'login.html';
  });
}
if (mobileLogoutBtn) { // Adiciona listener para o botão de logout mobile
  mobileLogoutBtn.addEventListener('click', () => {
    showMessage('Sessão encerrada.', 'info');
    window.location.href = 'login.html';
  });
}


// Lógica de inicialização baseada no ficheiro atual
document.addEventListener('DOMContentLoaded', () => {
  // Se estamos na página de login
  if (document.getElementById('login-screen')) {
    // Adiciona uma pequena demora para a animação do card de login
    setTimeout(() => {
      if (loginCard) { // Verifica se loginCard existe antes de manipular
        loginCard.classList.remove('opacity-0', 'pointer-events-none');
        loginCard.classList.add('opacity-100');
        loginCard.style.transform = 'scale(1)'; // Força a escala para 1
      }
    }, 100);
  }
  // Se estamos na página do dashboard
  else if (document.getElementById('dashboard-screen')) {
    const agendamentosList = document.getElementById('agendamentosList');
    const calendarEl = document.getElementById('calendar');

    if (agendamentosList) {
      // Se estiver na página do cliente ou profissional, carrega agendamentos
      loadData('agendamentos');
    } else if (calendarEl) {
      // Se estiver na página do admin ou profissional e tiver um calendário
      const profissionalId = document.querySelector('[data-profissional-id]') ? document.querySelector('[data-profissional-id]').dataset.profissionalId : null;
      initializeCalendar(calendarEl, profissionalId);
    } else {
      // Se estiver na página do admin e não tiver agendamentosList nem calendário (aba padrão)
      loadData('clientes');
    }

    // Lógica do menu mobile
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('translate-y-full'); // Para deslizar de cima para baixo
        mobileMenu.classList.toggle('opacity-0'); // Para fazer um fade-in/out

        // Remove as classes de 'out' e adiciona as de 'in'
        mobileMenu.classList.toggle('translate-y-0');
        mobileMenu.classList.toggle('opacity-100');
      });
    }
  }
});
