import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 4000,
});

// Simulated Storage Key
const STORAGE_KEY = 'hotel_imperial_fallback_db';

// Initial Seed Data matching the prototypes
const SEED_DATA = {
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
        cidade: { nome: "São Paulo", estado: { nome: "São Paulo", uf: "SP" } }
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
        cidade: { nome: "Rio de Janeiro", estado: { nome: "Rio de Janeiro", uf: "RJ" } }
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
        cidade: { nome: "Belo Horizonte", estado: { nome: "Minas Gerais", uf: "MG" } }
      }
    }
  ],
  quartos: [
    { id: 1, numero: "101", tipo: "Standard Casal", capacidadeAdultos: 2, capacidadeCriancas: 1, valorDiaria: 150.0, status: "DISPONIVEL" },
    { id: 2, numero: "102", tipo: "Standard Solteiro", capacidadeAdultos: 1, capacidadeCriancas: 0, valorDiaria: 100.0, status: "DISPONIVEL" },
    { id: 3, numero: "201", tipo: "Luxo Casal", capacidadeAdultos: 2, capacidadeCriancas: 1, valorDiaria: 250.0, status: "OCUPADO" },
    { id: 4, numero: "202", tipo: "Luxo Duplo", capacidadeAdultos: 2, capacidadeCriancas: 2, valorDiaria: 300.0, status: "DISPONIVEL" },
    { id: 5, numero: "301", tipo: "Suíte Master", capacidadeAdultos: 4, capacidadeCriancas: 2, valorDiaria: 600.0, status: "MANUTENCAO" },
    { id: 6, numero: "302", tipo: "Suíte Premium", capacidadeAdultos: 3, capacidadeCriancas: 1, valorDiaria: 450.0, status: "DISPONIVEL" }
  ],
  promocoes: [
    { id: 1, codigo: "BEMVINDO15", descricao: "Desconto de Boas-vindas", descontoPercentual: 15.0, inativo: false },
    { id: 2, codigo: "FIMDESEMANA", descricao: "Promoção de Fim de Semana", descontoPercentual: 10.0, inativo: false },
    { id: 3, codigo: "INVERNO20", descricao: "Cupom Promocional de Inverno", descontoPercentual: 20.0, inativo: true }
  ],
  politicas: [
    { id: 1, descricao: "Flexível - Cancelamento grátis até 24h antes", horasAntecedencia: 24, percentualMulta: 0.0, inativo: false },
    { id: 2, descricao: "Moderada - Cancelamento até 48h com multa de 10%", horasAntecedencia: 48, percentualMulta: 10.0, inativo: false },
    { id: 3, descricao: "Rígida - Cancelamento até 72h com multa de 25%", horasAntecedencia: 72, percentualMulta: 25.0, inativo: false }
  ],
  reservas: [
    {
      id: 1,
      hospede: { id: 1, nome: "João da Silva", cpf: "111.222.333-44" },
      quarto: { id: 3, numero: "201", tipo: "Luxo Casal" },
      dataEntrada: "2026-06-12",
      dataSaida: "2026-06-16",
      checkinRealizado: true,
      noShow: false,
      qtdAdultos: 2,
      qtdCriancas: 0,
      valorTotal: 1000.0,
      promocao: { id: 1, codigo: "BEMVINDO15" },
      politicaCancelamento: { id: 1, descricao: "Flexível - Cancelamento grátis até 24h antes" },
      status: "CONFIRMADA"
    },
    {
      id: 2,
      hospede: { id: 3, nome: "Carlos Eduardo Santos", cpf: "222.333.444-55" },
      quarto: { id: 2, numero: "102", tipo: "Standard Solteiro" },
      dataEntrada: "2026-06-10",
      dataSaida: "2026-06-13",
      checkinRealizado: true,
      noShow: false,
      qtdAdultos: 1,
      qtdCriancas: 0,
      valorTotal: 300.0,
      promocao: null,
      politicaCancelamento: { id: 1, descricao: "Flexível - Cancelamento grátis até 24h antes" },
      status: "CONCLUIDA"
    }
  ],
  pagamentos: [
    { id: 1, reserva: { id: 1 }, dataPagamento: "2026-06-12T14:30:00", valor: 1000.0, status: "APROVADO", formaPagamento: "Pix" },
    { id: 2, reserva: { id: 2 }, dataPagamento: "2026-06-10T10:15:00", valor: 300.0, status: "APROVADO", formaPagamento: "Cartão de Crédito" }
  ]
};

// LocalStorage Helper functions
function getLocalDB(): any {
  if (typeof window === 'undefined') return SEED_DATA;
  const db = localStorage.getItem(STORAGE_KEY);
  if (!db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(db);
}

function saveLocalDB(data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// Transparent fallback proxy
export const api = {
  get: async <T>(url: string): Promise<{ data: T }> => {
    try {
      const response = await client.get<T>(url);
      return response;
    } catch (e) {
      console.warn(`Backend unreachable on GET ${url}. Falling back to LocalStorage.`);
      const db = getLocalDB();
      
      // Dashboard requests
      if (url.includes('/dashboard/kpis')) {
        const activeGuests = db.hospedes.filter((h: any) => !h.inativo).length;
        const totalRooms = db.quartos.length;
        const occupiedRooms = db.quartos.filter((q: any) => q.status === 'OCUPADO').length;
        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
        const approvedRevenue = db.pagamentos
          .filter((p: any) => p.status === 'APROVADO')
          .reduce((s: number, p: any) => s + p.valor, 0);

        return {
          data: {
            activeGuests,
            occupancyRate,
            occupiedRooms,
            totalRooms,
            checkinsToday: 1,
            approvedRevenue
          } as unknown as T
        };
      }
      
      if (url.includes('/dashboard/atividades')) {
        const feed = [
          { tipo: 'hospede', texto: "Hóspede <strong>João da Silva</strong> foi cadastrado no sistema.", data: "Hoje", icone: "👥", corIcone: "bg-blue-100 text-blue-600" },
          { tipo: 'reserva', texto: "Reserva #1 criada para <strong>João da Silva</strong> (Quarto 201).", data: "Hoje", icone: "🔑", corIcone: "bg-indigo-100 text-indigo-600" },
          { tipo: 'pagamento', texto: "Pagamento de <strong>R$ 1000,00</strong> recebido via Pix.", data: "Hoje", icone: "💳", corIcone: "bg-emerald-100 text-emerald-600" }
        ];
        return { data: feed as unknown as T };
      }

      // Standard Resource collections
      const key = url.split('/').filter(Boolean).pop() || '';
      if (db[key]) {
        return { data: db[key] as T };
      }
      // If resource URL contains ID e.g. /hospedes/1
      const parts = url.split('/').filter(Boolean);
      if (parts.length === 2) {
        const coll = parts[0];
        const id = parseInt(parts[1]);
        if (db[coll]) {
          const found = db[coll].find((x: any) => x.id === id);
          if (found) return { data: found as T };
        }
      }
      throw e;
    }
  },

  post: async <T>(url: string, body: any): Promise<{ data: T }> => {
    try {
      return await client.post<T>(url, body);
    } catch (e) {
      console.warn(`Backend unreachable on POST ${url}. Using LocalStorage.`);
      const db = getLocalDB();
      const key = url.split('/').filter(Boolean).pop() || '';
      
      if (db[key]) {
        const nextId = db[key].length > 0 ? Math.max(...db[key].map((x: any) => x.id)) + 1 : 1;
        const newItem = { ...body, id: nextId };
        
        // Autocomplete objects resolve if mock
        if (key === 'reservas') {
          const h = db.hospedes.find((x: any) => x.id === body.hospede?.id);
          const q = db.quartos.find((x: any) => x.id === body.quarto?.id);
          const pol = db.politicas.find((x: any) => x.id === body.politicaCancelamento?.id);
          newItem.hospede = h || { id: body.hospede?.id, nome: 'Desconhecido' };
          newItem.quarto = q || { id: body.quarto?.id, numero: '?' };
          newItem.politicaCancelamento = pol || { id: body.politicaCancelamento?.id, descricao: 'Flexível' };
          
          // Trigger room status change side-effect
          if (newItem.checkinRealizado && q) {
            q.status = 'OCUPADO';
          }
        }

        db[key].push(newItem);
        saveLocalDB(db);
        return { data: newItem as T };
      }
      throw e;
    }
  },

  put: async <T>(url: string, body: any): Promise<{ data: T }> => {
    try {
      return await client.put<T>(url, body);
    } catch (e) {
      console.warn(`Backend unreachable on PUT ${url}. Using LocalStorage.`);
      const db = getLocalDB();
      const parts = url.split('/').filter(Boolean);
      if (parts.length === 2) {
        const coll = parts[0];
        const id = parseInt(parts[1]);
        if (db[coll]) {
          const idx = db[coll].findIndex((x: any) => x.id === id);
          if (idx !== -1) {
            db[coll][idx] = { ...db[coll][idx], ...body, id };
            saveLocalDB(db);
            return { data: db[coll][idx] as T };
          }
        }
      }
      throw e;
    }
  },

  delete: async <T>(url: string): Promise<{ data: T }> => {
    try {
      return await client.delete<T>(url);
    } catch (e) {
      console.warn(`Backend unreachable on DELETE ${url}. Using LocalStorage.`);
      const db = getLocalDB();
      const parts = url.split('/').filter(Boolean);
      if (parts.length === 2) {
        const coll = parts[0];
        const id = parseInt(parts[1]);
        if (db[coll]) {
          // Inactivate or delete
          if (coll === 'hospedes' || coll === 'promocoes' || coll === 'politicas') {
            const item = db[coll].find((x: any) => x.id === id);
            if (item) item.inativo = true;
          } else {
            db[coll] = db[coll].filter((x: any) => x.id !== id);
          }
          saveLocalDB(db);
          return { data: { sucesso: true } as unknown as T };
        }
      }
      throw e;
    }
  },

  patch: async <T>(url: string, body?: any): Promise<{ data: T }> => {
    try {
      return await client.patch<T>(url, body);
    } catch (e) {
      console.warn(`Backend unreachable on PATCH ${url}. Using LocalStorage.`);
      const db = getLocalDB();
      const parts = url.split('/').filter(Boolean);
      
      // Patch paths, e.g., /quartos/1/status?valor=OCUPADO
      // or /hospedes/1/reativar
      if (parts.length >= 2) {
        const coll = parts[0];
        const id = parseInt(parts[1]);
        const op = parts[2] || '';
        
        if (db[coll]) {
          const item = db[coll].find((x: any) => x.id === id);
          if (item) {
            if (op === 'reativar') {
              item.inativo = false;
            } else if (op === 'status') {
              const urlObj = new URL(url, 'http://localhost');
              const valor = urlObj.searchParams.get('valor') || 'DISPONIVEL';
              item.status = valor;
            } else if (op === 'checkin') {
              const urlObj = new URL(url, 'http://localhost');
              const val = urlObj.searchParams.get('valor') === 'true';
              item.checkinRealizado = val;
              // Room occupancy side-effect
              const q = db.quartos.find((x: any) => x.id === item.quarto?.id);
              if (q) q.status = val ? 'OCUPADO' : 'DISPONIVEL';
            } else if (op === 'cancelar') {
              item.status = 'CANCELADA';
            }
            saveLocalDB(db);
            return { data: item as T };
          }
        }
      }
      throw e;
    }
  }
};
