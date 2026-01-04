import { useState, useEffect } from 'react';

// Estado inicial padrão caso não tenha nada salvo
const INITIAL_DATA = {
  products: [
    { id: 1, name: 'Produto Exemplo', price: 10.00, category: 'Geral', stock: 100 }
  ],
  clients: [],
  orders: []
};

export function useSystemData() {
  const [data, setData] = useState(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. CARREGAR (Ao abrir o sistema)
  useEffect(() => {
    const saved = localStorage.getItem('delivery_db');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. SALVAR AUTOMÁTICO (Sempre que data mudar)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('delivery_db', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // --- AÇÕES (Funções para modificar os dados) ---

  const actions = {
    // CLIENTES
    addClient: (client) => {
      setData(prev => ({ ...prev, clients: [...prev.clients, client] }));
      alert('Cliente salvo!');
    },
    removeClient: (id) => {
      if (confirm('Remover cliente?')) {
        setData(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== id) }));
      }
    },

    // PRODUTOS
    addProduct: (product) => {
      setData(prev => ({ ...prev, products: [...prev.products, product] }));
      alert('Produto adicionado!');
    },
    removeProduct: (id) => {
      if (confirm('Remover produto?')) {
        setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
      }
    },
    updateStock: (id, amount) => {
      setData(prev => ({
        ...prev,
        products: prev.products.map(p => 
          p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
        )
      }));
    },

    // VENDAS
    finalizeSale: (cart, client) => {
      const newOrder = {
        id: `V-${1000 + data.orders.length}`,
        clientId: client.id,
        clientName: client.name,
        address: client.address,
        items: cart,
        total: cart.reduce((acc, item) => acc + (item.price * item.qtd), 0),
        status: 'Pendente',
        date: new Date().toISOString()
      };

      setData(prev => ({
        ...prev,
        orders: [newOrder, ...prev.orders],
        // Baixa estoque automaticamente
        products: prev.products.map(p => {
          const itemInCart = cart.find(c => c.id === p.id);
          return itemInCart ? { ...p, stock: p.stock - itemInCart.qtd } : p;
        }),
        // Aumenta contador de pedidos do cliente
        clients: prev.clients.map(c => 
          c.id === client.id ? { ...c, orders: (c.orders || 0) + 1 } : c
        )
      }));
      alert('Venda realizada com sucesso!');
    },
    
    updateOrderStatus: (id, status) => {
      setData(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === id ? { ...o, status } : o)
      }));
    },

    // BACKUP
    restoreData: (newData) => {
      setData(newData);
      alert('Dados restaurados com sucesso!');
    }
  };

  return { data, actions, isLoaded };
}
