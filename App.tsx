
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'board'

  return (
    <div className="flex h-screen bg-background-dark text-text-primary">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col h-screen">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'board' && <KanbanBoard />}
      </main>
    </div>
  );
};

export default App;
