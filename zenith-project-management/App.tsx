
import React, { useState, useEffect } from 'react';
import { useAppState } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import ProjectBoard from './components/ProjectBoard';
import ProgressDashboard from './components/ProgressDashboard';
import { useTaskNotifications } from './hooks/useTaskNotifications';

type View = 'board' | 'dashboard';

const App: React.FC = () => {
  const { state } = useAppState();
  const [currentView, setCurrentView] = useState<View>('board');

  useTaskNotifications();

  if (!state.currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === 'board' ? <ProjectBoard /> : <ProgressDashboard />}
      </main>
    </div>
  );
};

export default App;
