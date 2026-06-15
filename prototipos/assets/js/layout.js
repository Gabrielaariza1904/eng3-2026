/**
 * layout.js - Mecanismo de Layout Compartilhado e Polimento Visual
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Injetar Google Fonts e CSS customizado de suporte
    configurarEstilosGlobais();

    // 2. Injetar a Sidebar e o Header se o container existir
    injetarLayoutComum();

    // 3. Destacar o link ativo na navegação
    destacarLinkAtivo();

    // 4. Animação de entrada da página
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

/**
 * Adiciona Google Fonts e estilos CSS fundamentais para animações e toasts
 */
function configurarEstilosGlobais() {
    // Injetar Font Inter
    if (!document.getElementById('google-fonts-inter')) {
        const link = document.createElement('link');
        link.id = 'google-fonts-inter';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap';
        document.head.appendChild(link);
    }

    // Configurar Fonte padrão no body
    document.body.style.fontFamily = "'Inter', sans-serif";

    // Adicionar estilos de animações e Toast no document head
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        /* Reset de fontes e ajustes globais */
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Outfit', sans-serif !important;
        }

        /* Efeito de Glassmorphism */
        .glass-card {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }

        .glass-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 20px -8px rgba(15, 23, 42, 0.08);
        }

        .dark-glass-sidebar {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Notificação Toast */
        .toast-container {
            position: fixed;
            top: 1.5rem;
            right: 1.5rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            pointer-events: none;
        }

        .toast-item {
            min-width: 300px;
            max-width: 450px;
            padding: 1rem 1.25rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
            color: #ffffff;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            pointer-events: auto;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
            opacity: 0;
        }

        .toast-item.show {
            transform: translateX(0);
            opacity: 1;
        }

        .toast-sucesso {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-left: 5px solid #047857;
        }

        .toast-erro {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border-left: 5px solid #b91c1c;
        }

        .toast-info {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-left: 5px solid #1d4ed8;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        /* Animação suave para tabelas e cards */
        .fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Inputs user-valid / user-invalid CSS Native constraints */
        input:user-invalid, select:user-invalid, textarea:user-invalid {
            border-color: #ef4444 !important;
            background-color: #fef2f2 !important;
        }
        
        input:user-valid:not(:placeholder-shown), select:user-valid {
            border-color: #10b981 !important;
            background-color: #f0fdf4 !important;
        }
    `;
    document.head.appendChild(styleTag);
}

/**
 * Cria a estrutura da sidebar e cabeçalho se o body estiver pronto
 */
function injetarLayoutComum() {
    // Se a página for um formulário ou lista, a estrutura HTML básica deve conter:
    // <body class="bg-slate-50 min-h-screen flex">
    //     <!-- O layout injeta a sidebar e empacota o resto em uma área de main -->
    // </body>
    
    // Verificamos se já existe a sidebar no documento. Se não existir, inserimos
    const sidebarExistente = document.querySelector('aside');
    if (sidebarExistente) {
        // Remove a sidebar estática antiga
        sidebarExistente.remove();
    }

    // Criamos a nova Sidebar dinâmica ultra moderna
    const aside = document.createElement('aside');
    aside.className = 'w-64 dark-glass-sidebar text-slate-300 flex flex-col shrink-0 min-h-screen z-20';
    aside.innerHTML = `
        <div class="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">H</div>
            <div>
                <h1 class="text-lg font-bold text-white leading-tight">Hotel Imperial</h1>
                <span class="text-xs text-slate-500 font-medium">Painel de Controle</span>
            </div>
        </div>
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div>
                <span class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Principal</span>
                <a href="index.html" data-nav="index" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>📊</span> Painel Geral
                </a>
            </div>

            <div class="pt-4">
                <span class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Operações</span>
                <a href="reservas-lista.html" data-nav="reservas" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>🔑</span> Reservas
                </a>
                <a href="hospedes-lista.html" data-nav="hospedes" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>👥</span> Hóspedes
                </a>
                <a href="quartos-lista.html" data-nav="quartos" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>🛏️</span> Quartos
                </a>
                <a href="pagamentos-lista.html" data-nav="pagamentos" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>💳</span> Pagamentos
                </a>
            </div>

            <div class="pt-4">
                <span class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Configurações</span>
                <a href="promocoes-lista.html" data-nav="promocoes" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>🏷️</span> Promoções
                </a>
                <a href="politicas-lista.html" data-nav="politicas" class="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-white transition-all duration-200">
                    <span>📋</span> Políticas Cancel.
                </a>
            </div>
        </nav>
        <div class="p-4 border-t border-slate-800 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">AD</div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate">Admin Imperial</p>
                <p class="text-xs text-slate-500 truncate">admin@imperial.com</p>
            </div>
            <button onclick="reiniciarDadosDB()" title="Reiniciar Banco de Dados" class="text-slate-500 hover:text-red-400 p-1 transition-colors">
                🔄
            </button>
        </div>
    `;

    // Inserir a sidebar como primeiro filho do body
    document.body.prepend(aside);

    // Ajustar a estrutura do <main> para incluir o Header dinâmico se já não existir
    const main = document.querySelector('main');
    if (main) {
        main.className = 'flex-1 p-8 overflow-y-auto max-h-screen bg-slate-50';
        
        // Verifica se já tem header
        const headerExistente = main.querySelector('header');
        if (headerExistente) {
            // Vamos substituí-lo por um cabeçalho mais moderno, preservando os títulos e ações
            const tituloText = headerExistente.querySelector('h2')?.innerText || "Painel Geral";
            const botoesHTML = headerExistente.querySelector('.flex, div')?.innerHTML || "";
            
            const novoHeader = document.createElement('header');
            novoHeader.className = 'flex justify-between items-center mb-8 border-b border-slate-200 pb-5';
            novoHeader.innerHTML = `
                <div>
                    <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">${tituloText}</h2>
                    <p class="text-slate-500 text-sm mt-1">Protótipo Funcional • Simulação Completa</p>
                </div>
                <div class="flex items-center gap-3">
                    ${botoesHTML}
                </div>
            `;
            headerExistente.replaceWith(novoHeader);
        }
    }
}

/**
 * Destaca o link ativo na navegação lateral comparando a URL da página atual
 */
function destacarLinkAtivo() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    let navKey = 'index';

    if (filename.includes('hospede')) navKey = 'hospedes';
    else if (filename.includes('quarto')) navKey = 'quartos';
    else if (filename.includes('reserva')) navKey = 'reservas';
    else if (filename.includes('promocao') || filename.includes('promocoes')) navKey = 'promocoes';
    else if (filename.includes('politica')) navKey = 'politicas';
    else if (filename.includes('pagamento')) navKey = 'pagamentos';

    const activeLink = document.querySelector(`aside a[data-nav="${navKey}"]`);
    if (activeLink) {
        activeLink.classList.remove('hover:bg-slate-800/60', 'hover:text-white');
        activeLink.classList.add('bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-600/15');
    }
}

/**
 * Cria a estrutura de Toasts global
 */
function criarToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Exibe um Toast temporário flutuante na tela
 * @param {string} mensagem 
 * @param {'sucesso' | 'erro' | 'info'} tipo 
 */
window.mostrarToast = function(mensagem, tipo = 'sucesso') {
    const container = criarToastContainer();
    const item = document.createElement('div');
    
    let classeTipo = 'toast-sucesso';
    let icone = '✅';
    if (tipo === 'erro') {
        classeTipo = 'toast-erro';
        icone = '❌';
    } else if (tipo === 'info') {
        classeTipo = 'toast-info';
        icone = 'ℹ️';
    }

    item.className = `toast-item ${classeTipo}`;
    item.innerHTML = `
        <span class="text-lg">${icone}</span>
        <div class="flex-1">${mensagem}</div>
    `;

    container.appendChild(item);

    // Trigger de animação de entrada
    requestAnimationFrame(() => {
        item.classList.add('show');
    });

    // Auto-remove após 4.5 segundos
    setTimeout(() => {
        item.classList.remove('show');
        setTimeout(() => {
            item.remove();
        }, 300);
    }, 4500);
};

/**
 * Função global para restaurar os dados originais no LocalStorage
 */
window.reiniciarDadosDB = function() {
    if (confirm('Deseja reiniciar todo o banco de dados para os valores originais de teste? Todos os dados customizados salvos serão excluídos.')) {
        localStorage.removeItem('hotel_management_db');
        window.location.reload();
    }
};
