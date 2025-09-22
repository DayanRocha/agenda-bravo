import { useState, useEffect } from 'react';

export interface Registro {
  id: string;
  data: Date;
  horas: number;
  valorHora: number;
  descricao: string;
  valorTotal: number;
}

const STORAGE_KEY = 'meu-bico-registros';

export function useRegistros() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  // Carregar registros do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter strings de data de volta para objetos Date
        const registrosWithDates = parsed.map((r: any) => ({
          ...r,
          data: new Date(r.data)
        }));
        setRegistros(registrosWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  }, []);

  // Salvar registros no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    } catch (error) {
      console.error('Erro ao salvar registros:', error);
    }
  }, [registros]);

  const adicionarRegistro = (novoRegistro: Omit<Registro, 'id'>) => {
    const registro: Registro = {
      ...novoRegistro,
      id: Date.now().toString()
    };
    setRegistros(prev => [...prev, registro]);
    return registro;
  };

  const editarRegistro = (id: string, registroAtualizado: Omit<Registro, 'id'>) => {
    setRegistros(prev => 
      prev.map(r => r.id === id ? { ...registroAtualizado, id } : r)
    );
  };

  const excluirRegistro = (id: string) => {
    setRegistros(prev => prev.filter(r => r.id !== id));
  };

  const obterRegistrosPorData = (data: Date) => {
    return registros.filter(r => 
      r.data.toDateString() === data.toDateString()
    );
  };

  const obterRegistroPorId = (id: string) => {
    return registros.find(r => r.id === id);
  };

  return {
    registros,
    adicionarRegistro,
    editarRegistro,
    excluirRegistro,
    obterRegistrosPorData,
    obterRegistroPorId
  };
}