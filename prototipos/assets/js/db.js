/**
 * db.js - Banco de Dados Simulado em LocalStorage
 * Implementa Fachada, DAOs e Strategies para o Protótipo
 */

// Chave do localStorage
const DB_STORAGE_KEY = 'hotel_management_db';

// Helper para gerar IDs sequenciais
function gerarProximoId(array) {
    if (!array || array.length === 0) return 1;
    return Math.max(...array.map(item => item.id)) + 1;
}

// Inicializador de Banco de Dados com Dados Iniciais (Seeding)
function inicializarDB() {
    if (localStorage.getItem(DB_STORAGE_KEY)) {
        return JSON.parse(localStorage.getItem(DB_STORAGE_KEY));
    }

    const mockData = {
        hospedes: [
            {
                id: 1,
                nome: "João da Silva",
                cpf: "111.222.333-44",
                email: "joao@email.com",
                telefone: "(11) 98888-7777",
                inativo: false,
                endereco: {
                    logradouro: "Avenida Paulista",
                    numero: "1000",
                    cep: "01310-100",
                    bairro: "Bela Vista",
                    complemento: "Apto 42",
                    cidade: "São Paulo",
                    estado: "SP"
                }
            },
            {
                id: 2,
                nome: "Maria Oliveira",
                cpf: "555.666.777-88",
                email: "maria@email.com",
                telefone: "(21) 97777-6666",
                inativo: true,
                endereco: {
                    logradouro: "Rua Copacabana",
                    numero: "250",
                    cep: "22020-002",
                    bairro: "Copacabana",
                    complemento: "",
                    cidade: "Rio de Janeiro",
                    estado: "RJ"
                }
            },
            {
                id: 3,
                nome: "Carlos Eduardo Santos",
                cpf: "222.333.444-55",
                email: "carlos.santos@email.com",
                telefone: "(31) 96666-5555",
                inativo: false,
                endereco: {
                    logradouro: "Praça da Liberdade",
                    numero: "12",
                    cep: "30140-010",
                    bairro: "Funcionários",
                    complemento: "Sala 201",
                    cidade: "Belo Horizonte",
                    estado: "MG"
                }
            },
            {
                id: 4,
                nome: "Ana Julia Souza",
                cpf: "333.444.555-66",
                email: "ana.souza@email.com",
                telefone: "(19) 95555-4444",
                inativo: false,
                endereco: {
                    logradouro: "Rua Barão de Jaguara",
                    numero: "950",
                    cep: "13015-002",
                    bairro: "Centro",
                    complemento: "",
                    cidade: "Campinas",
                    estado: "SP"
                }
            },
            {
                id: 5,
                nome: "Roberto Lima",
                cpf: "444.555.666-77",
                email: "roberto.lima@email.com",
                telefone: "(41) 94444-3333",
                inativo: false,
                endereco: {
                    logradouro: "Rua das Flores",
                    numero: "100",
                    cep: "80020-300",
                    bairro: "Centro",
                    complemento: "Bloco B",
                    cidade: "Curitiba",
                    estado: "PR"
                }
            }
        ],
        quartos: [
            {
                id: 1,
                numero: "101",
                tipo: "Standard Casal",
                capacidadeAdultos: 2,
                capacidadeCriancas: 1,
                valorDiaria: 150.00,
                status: "DISPONIVEL" // DISPONIVEL, OCUPADO, MANUTENCAO
            },
            {
                id: 2,
                numero: "102",
                tipo: "Standard Solteiro",
                capacidadeAdultos: 1,
                capacidadeCriancas: 0,
                valorDiaria: 100.00,
                status: "DISPONIVEL"
            },
            {
                id: 3,
                numero: "201",
                tipo: "Luxo Casal",
                capacidadeAdultos: 2,
                capacidadeCriancas: 1,
                valorDiaria: 250.00,
                status: "OCUPADO"
            },
            {
                id: 4,
                numero: "202",
                tipo: "Luxo Duplo",
                capacidadeAdultos: 2,
                capacidadeCriancas: 2,
                valorDiaria: 300.00,
                status: "DISPONIVEL"
            },
            {
                id: 5,
                numero: "301",
                tipo: "Suíte Master",
                capacidadeAdultos: 4,
                capacidadeCriancas: 2,
                valorDiaria: 600.00,
                status: "MANUTENCAO"
            },
            {
                id: 6,
                numero: "302",
                tipo: "Suíte Premium",
                capacidadeAdultos: 3,
                capacidadeCriancas: 1,
                valorDiaria: 450.00,
                status: "DISPONIVEL"
            }
        ],
        promocoes: [
            {
                id: 1,
                codigo: "BEMVINDO15",
                descricao: "Desconto de Boas-vindas",
                descontoPercentual: 15.00,
                inativo: false
            },
            {
                id: 2,
                codigo: "FIMDESEMANA",
                descricao: "Promoção de Fim de Semana",
                descontoPercentual: 10.00,
                inativo: false
            },
            {
                id: 3,
                codigo: "INVERNO20",
                descricao: "Cupom Promocional de Inverno",
                descontoPercentual: 20.00,
                inativo: true
            }
        ],
        politicas: [
            {
                id: 1,
                descricao: "Flexível - Cancelamento grátis até 24h antes",
                horasAntecedencia: 24,
                percentualMulta: 0.00,
                inativo: false
            },
            {
                id: 2,
                descricao: "Moderada - Cancelamento até 48h com multa de 10%",
                horasAntecedencia: 48,
                percentualMulta: 10.00,
                inativo: false
            },
            {
                id: 3,
                descricao: "Rígida - Cancelamento até 72h com multa de 25%",
                horasAntecedencia: 72,
                percentualMulta: 25.00,
                inativo: false
            }
        ],
        reservas: [
            {
                id: 1,
                hospedeId: 1, // João da Silva
                quartoId: 3,   // Quarto 201
                dataEntrada: "2026-06-12",
                dataSaida: "2026-06-16",
                checkinRealizado: true,
                noShow: false,
                qtdAdultos: 2,
                qtdCriancas: 0,
                valorTotal: 1000.00,
                promocaoId: 1, // BEMVINDO15 (aplicado no cálculo)
                politicaId: 1,
                status: "CONFIRMADA" // PENDENTE, CONFIRMADA, CANCELADA, CONCLUIDA
            },
            {
                id: 2,
                hospedeId: 3, // Carlos Eduardo Santos
                quartoId: 2,   // Quarto 102
                dataEntrada: "2026-06-10",
                dataSaida: "2026-06-13",
                checkinRealizado: true,
                noShow: false,
                qtdAdultos: 1,
                qtdCriancas: 0,
                valorTotal: 300.00,
                promocaoId: null,
                politicaId: 1,
                status: "CONCLUIDA"
            },
            {
                id: 3,
                hospedeId: 4, // Ana Julia
                quartoId: 4,   // Quarto 202
                dataEntrada: "2026-06-18",
                dataSaida: "2026-06-22",
                checkinRealizado: false,
                noShow: false,
                qtdAdultos: 2,
                qtdCriancas: 1,
                valorTotal: 1200.00,
                promocaoId: null,
                politicaId: 2,
                status: "PENDENTE"
            },
            {
                id: 4,
                hospedeId: 5, // Roberto Lima
                quartoId: 5,   // Quarto 301
                dataEntrada: "2026-06-05",
                dataSaida: "2026-06-08",
                checkinRealizado: false,
                noShow: false,
                qtdAdultos: 2,
                qtdCriancas: 2,
                valorTotal: 1800.00,
                promocaoId: null,
                politicaId: 3,
                status: "CANCELADA"
            }
        ],
        pagamentos: [
            {
                id: 1,
                reservaId: 1,
                dataPagamento: "2026-06-12T14:30:00",
                valor: 1000.00,
                status: "APROVADO", // PENDENTE, APROVADO, NEGADO, ESTORNADO
                formaPagamento: "Pix"
            },
            {
                id: 2,
                reservaId: 2,
                dataPagamento: "2026-06-10T10:15:00",
                valor: 300.00,
                status: "APROVADO",
                formaPagamento: "Cartão de Crédito"
            }
        ]
    };

    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(mockData));
    return mockData;
}

// Classe DAO para persistência local genérica
class DAO {
    constructor(tabela) {
        this.tabela = tabela;
    }

    obterTudo() {
        const db = inicializarDB();
        return db[this.tabela] || [];
    }

    salvarTudo(dados) {
        const db = inicializarDB();
        db[this.tabela] = dados;
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    }

    buscarPorId(id) {
        const todos = this.obterTudo();
        return todos.find(item => item.id == id);
    }

    salvar(entidade) {
        const todos = this.obterTudo();
        if (!entidade.id) {
            entidade.id = gerarProximoId(todos);
            todos.push(entidade);
        } else {
            const index = todos.findIndex(item => item.id == entidade.id);
            if (index !== -1) {
                todos[index] = entidade;
            } else {
                todos.push(entidade);
            }
        }
        this.salvarTudo(todos);
        return entidade;
    }

    inativar(id) {
        const todos = this.obterTudo();
        const index = todos.findIndex(item => item.id == id);
        if (index !== -1) {
            todos[index].inativo = true;
            this.salvarTudo(todos);
            return true;
        }
        return false;
    }

    reativar(id) {
        const todos = this.obterTudo();
        const index = todos.findIndex(item => item.id == id);
        if (index !== -1) {
            todos[index].inativo = false;
            this.salvarTudo(todos);
            return true;
        }
        return false;
    }

    remover(id) {
        let todos = this.obterTudo();
        todos = todos.filter(item => item.id != id);
        this.salvarTudo(todos);
        return true;
    }
}

// Instâncias de DAOs
const DAOs = {
    hospedes: new DAO('hospedes'),
    quartos: new DAO('quartos'),
    promocoes: new DAO('promocoes'),
    politicas: new DAO('politicas'),
    reservas: new DAO('reservas'),
    pagamentos: new DAO('pagamentos')
};

// Strategies de Validação de Negócio
const Strategies = {
    hospedes: {
        ValidarDadosObrigatorios: (dados) => {
            const campos = ['nome', 'cpf', 'email', 'telefone'];
            for (let campo of campos) {
                if (!dados[campo] || dados[campo].trim() === '') {
                    return `O campo "${campo.toUpperCase()}" é obrigatório.`;
                }
            }
            if (!dados.endereco || !dados.endereco.cep || !dados.endereco.logradouro || !dados.endereco.numero || !dados.endereco.bairro || !dados.endereco.cidade || !dados.endereco.estado) {
                return 'Todos os campos de Endereço (CEP, Logradouro, Número, Bairro, Cidade, Estado) são obrigatórios.';
            }
            return null;
        },
        ValidarCpfUnico: (dados) => {
            const dao = DAOs.hospedes;
            const todos = dao.obterTudo();
            const duplicado = todos.find(h => h.cpf === dados.cpf && h.id != dados.id);
            if (duplicado) {
                return `O CPF "${dados.cpf}" já está cadastrado para outro hóspede.`;
            }
            return null;
        },
        ValidarEmail: (dados) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(dados.email)) {
                return `O e-mail "${dados.email}" é inválido.`;
            }
            return null;
        }
    },
    quartos: {
        ValidarNumeroUnico: (dados) => {
            const dao = DAOs.quartos;
            const todos = dao.obterTudo();
            const duplicado = todos.find(q => q.numero === dados.numero && q.id != dados.id);
            if (duplicado) {
                return `O quarto número "${dados.numero}" já está cadastrado.`;
            }
            return null;
        },
        ValidarDadosObrigatorios: (dados) => {
            if (!dados.numero || dados.numero.trim() === '') return 'O número do quarto é obrigatório.';
            if (!dados.tipo || dados.tipo.trim() === '') return 'O tipo do quarto é obrigatório.';
            if (dados.capacidadeAdultos === undefined || dados.capacidadeAdultos === null || dados.capacidadeAdultos < 1) return 'A capacidade de adultos deve ser pelo menos 1.';
            if (dados.valorDiaria === undefined || dados.valorDiaria === null || dados.valorDiaria <= 0) return 'O valor da diária deve ser maior que zero.';
            return null;
        }
    },
    promocoes: {
        ValidarCodigoUnico: (dados) => {
            const dao = DAOs.promocoes;
            const todos = dao.obterTudo();
            const duplicado = todos.find(p => p.codigo.toUpperCase() === dados.codigo.toUpperCase() && p.id != dados.id);
            if (duplicado) {
                return `O código promocional "${dados.codigo}" já existe.`;
            }
            return null;
        },
        ValidarDadosObrigatorios: (dados) => {
            if (!dados.codigo || dados.codigo.trim() === '') return 'O código da promoção é obrigatório.';
            if (!dados.descricao || dados.descricao.trim() === '') return 'A descrição é obrigatória.';
            if (dados.descontoPercentual === undefined || dados.descontoPercentual === null || dados.descontoPercentual <= 0 || dados.descontoPercentual > 100) {
                return 'O desconto percentual deve ser um valor entre 0.1 e 100.';
            }
            return null;
        }
    },
    politicas: {
        ValidarDadosObrigatorios: (dados) => {
            if (!dados.descricao || dados.descricao.trim() === '') return 'A descrição da política é obrigatória.';
            if (dados.horasAntecedencia === undefined || dados.horasAntecedencia === null || dados.horasAntecedencia < 0) return 'Horas de antecedência inválidas.';
            if (dados.percentualMulta === undefined || dados.percentualMulta === null || dados.percentualMulta < 0 || dados.percentualMulta > 100) {
                return 'O percentual de multa deve ser entre 0 e 100.';
            }
            return null;
        }
    },
    reservas: {
        ValidarDadosObrigatorios: (dados) => {
            if (!dados.hospedeId) return 'Selecione um hóspede.';
            if (!dados.quartoId) return 'Selecione um quarto.';
            if (!dados.dataEntrada) return 'Selecione a data de entrada.';
            if (!dados.dataSaida) return 'Selecione a data de saída.';
            if (!dados.qtdAdultos || dados.qtdAdultos < 1) return 'Informe pelo menos 1 adulto.';
            return null;
        },
        ValidarDatas: (dados) => {
            const entrada = new Date(dados.dataEntrada);
            const saida = new Date(dados.dataSaida);
            if (entrada >= saida) {
                return 'A data de saída deve ser posterior à data de entrada.';
            }
            return null;
        },
        ValidarCapacidadeQuarto: (dados) => {
            const quarto = DAOs.quartos.buscarPorId(dados.quartoId);
            if (!quarto) return 'Quarto selecionado não existe.';
            if (dados.qtdAdultos > quarto.capacidadeAdultos) {
                return `Capacidade de adultos excedida para este quarto. Máximo permitido: ${quarto.capacidadeAdultos}.`;
            }
            if (dados.qtdCriancas > quarto.capacidadeCriancas) {
                return `Capacidade de crianças excedida para este quarto. Máximo permitido: ${quarto.capacidadeCriancas}.`;
            }
            return null;
        },
        ValidarDisponibilidadeQuarto: (dados) => {
            const dao = DAOs.reservas;
            const todas = dao.obterTudo();
            const conflito = todas.find(r => 
                r.quartoId == dados.quartoId &&
                r.id != dados.id &&
                r.status !== 'CANCELADA' &&
                (
                    (dados.dataEntrada >= r.dataEntrada && dados.dataEntrada < r.dataSaida) ||
                    (dados.dataSaida > r.dataEntrada && dados.dataSaida <= r.dataSaida) ||
                    (dados.dataEntrada <= r.dataEntrada && dados.dataSaida >= r.dataSaida)
                )
            );
            if (conflito) {
                return `O quarto já está reservado no período de ${conflito.dataEntrada} a ${conflito.dataSaida}.`;
            }
            return null;
        }
    },
    pagamentos: {
        ValidarDadosObrigatorios: (dados) => {
            if (!dados.reservaId) return 'Selecione a reserva correspondente.';
            if (dados.valor === undefined || dados.valor === null || dados.valor <= 0) return 'O valor do pagamento deve ser maior que zero.';
            if (!dados.formaPagamento) return 'Selecione a forma de pagamento.';
            return null;
        }
    }
};

// Fachada (Facade) - Interface Única de Acesso
const Fachada = {
    salvar: (tipo, dados) => {
        // Executar as Strategies do tipo
        if (Strategies[tipo]) {
            for (let strategyName in Strategies[tipo]) {
                const erro = Strategies[tipo][strategyName](dados);
                if (erro) {
                    return { sucesso: false, erro: erro };
                }
            }
        }

        // Delegar ao DAO
        try {
            const entidadeSalva = DAOs[tipo].salvar(dados);
            
            // Side-effects automáticos para deixar o protótipo real
            if (tipo === 'reservas') {
                Fachada.atualizarStatusQuartoPorReservas();
            }

            return { sucesso: true, dados: entidadeSalva };
        } catch (e) {
            return { sucesso: false, erro: `Falha ao salvar: ${e.message}` };
        }
    },

    inativar: (tipo, id) => {
        try {
            const sucesso = DAOs[tipo].inativar(id);
            return { sucesso: sucesso };
        } catch (e) {
            return { sucesso: false, erro: e.message };
        }
    },

    reativar: (tipo, id) => {
        try {
            const sucesso = DAOs[tipo].reativar(id);
            return { sucesso: sucesso };
        } catch (e) {
            return { sucesso: false, erro: e.message };
        }
    },

    remover: (tipo, id) => {
        try {
            const sucesso = DAOs[tipo].remover(id);
            return { sucesso: sucesso };
        } catch (e) {
            return { sucesso: false, erro: e.message };
        }
    },

    consultar: (tipo, id = null) => {
        try {
            if (id) {
                return DAOs[tipo].buscarPorId(id);
            }
            return DAOs[tipo].obterTudo();
        } catch (e) {
            console.error(`Erro ao consultar ${tipo}:`, e);
            return [];
        }
    },

    // Executa regras de transição automáticas do quarto com base no checkinRealizado
    atualizarStatusQuartoPorReservas: () => {
        const reservas = DAOs.reservas.obterTudo();
        const quartos = DAOs.quartos.obterTudo();
        
        // Resetar todos os quartos para DISPONIVEL (exceto MANUTENCAO)
        quartos.forEach(q => {
            if (q.status !== 'MANUTENCAO') {
                q.status = 'DISPONIVEL';
            }
        });

        // Marcar ocupados os quartos com reservas confirmadas e com check-in realizado hoje/ativo
        const hojeStr = new Date().toISOString().split('T')[0];
        reservas.forEach(r => {
            if (r.status === 'CONFIRMADA' && r.checkinRealizado && r.dataEntrada <= hojeStr && r.dataSaida >= hojeStr) {
                const q = quartos.find(quarto => quarto.id == r.quartoId);
                if (q && q.status !== 'MANUTENCAO') {
                    q.status = 'OCUPADO';
                }
            }
        });

        DAOs.quartos.salvarTudo(quartos);
    }
};

// Exportar Fachada e utilitários globalmente
window.HotelDB = {
    Fachada,
    DAOs,
    inicializarDB
};

// Auto-inicializar banco de dados ao carregar
inicializarDB();
