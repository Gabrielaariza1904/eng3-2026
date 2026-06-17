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
          if (coll === 'hospedes') {
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
      
      if (parts.length >= 2) {
        const coll = parts[0];
        const id = parseInt(parts[1]);
        const op = parts[2] || '';
        
        if (db[coll]) {
          const item = db[coll].find((x: any) => x.id === id);
          if (item) {
            if (op === 'reativar') {
              item.inativo = false;
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
