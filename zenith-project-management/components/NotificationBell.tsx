
import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppContext';

const NotificationBell: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = state.notifications.filter(n => !n.read).length;
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={togglePanel} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
        <ion-icon name="notifications-outline" class="text-xl"></ion-icon>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border dark:border-gray-700">
          <div className="p-3 font-bold border-b dark:border-gray-700">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <p className="text-center p-4 text-sm text-gray-500">No new notifications</p>
            ) : (
              state.notifications.map(n => (
                <div key={n.id} className={`p-3 border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!n.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
