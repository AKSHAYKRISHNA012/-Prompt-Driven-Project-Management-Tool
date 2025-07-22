
import React from 'react';
import { useAppState } from '../context/AppContext';
import NotificationBell from './NotificationBell';

interface HeaderProps {
    currentView: 'board' | 'dashboard';
    setCurrentView: (view: 'board' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { state, dispatch } = useAppState();
  const { currentUser, theme } = state;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const getNavClass = (view: 'board' | 'dashboard') => {
    return currentView === view 
      ? 'bg-primary-500 text-white' 
      : 'text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/50';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <ion-icon name="rocket-outline" class="text-primary-500 text-3xl"></ion-icon>
              <span className="font-bold text-2xl text-gray-800 dark:text-white">Zenith</span>
            </div>
            <nav className="hidden md:flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                <button onClick={() => setCurrentView('board')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getNavClass('board')}`}>
                    Board
                </button>
                <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getNavClass('dashboard')}`}>
                    Dashboard
                </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} class="text-xl"></ion-icon>
            </button>
            <NotificationBell />
            <div className="flex items-center space-x-3">
              <img className="h-9 w-9 rounded-full" src={currentUser?.avatar} alt={currentUser?.name} />
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{currentUser?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <ion-icon name="log-out-outline" class="text-xl"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
