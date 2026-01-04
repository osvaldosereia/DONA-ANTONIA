export default function App() {
  const [view, setView] = useState('clients');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Usando o Hook que definimos acima
  const { data, actions, isLoaded } = useSystemData();

  const renderView = () => {
    if (!isLoaded) return <div className="p-8 text-slate-500">Carregando sistema...</div>;

    switch(view) {
      case 'clients': 
        return <ClientsModule clients={data.clients} onAddClient={actions.addClient} onRemoveClient={actions.removeClient} />;
      case 'stock':
        return <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full"><Box size={48} className="mb-4 opacity-20"/>Módulo de Estoque (Em construção...)</div>;
      default: 
        return <div className="p-8">Selecione uma opção no menu</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-20 h-full bg-slate-900 text-slate-300 w-64 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-white font-black text-xl tracking-tighter">SYS<span className="text-blue-500">DELIVERY</span></h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400"><X /></button>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <button onClick={() => { setView('clients'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${view === 'clients' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <Users size={20} /> Clientes
          </button>
          <button onClick={() => { setView('stock'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${view === 'stock' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <Box size={20} /> Estoque
          </button>
        </nav>
        <div className="p-4 bg-slate-950 text-xs text-slate-500 text-center">v1.0 Local-First</div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center shrink-0 z-10">
          <h1 className="font-bold text-slate-800">SysDelivery</h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600"><Menu /></button>
        </header>
        <div className="flex-1 overflow-y-auto bg-slate-100">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
