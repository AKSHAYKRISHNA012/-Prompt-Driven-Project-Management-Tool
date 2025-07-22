
import { useEffect } from 'react';
import { useAppState } from '../context/AppContext';

export const useTaskNotifications = () => {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    const checkDueDates = () => {
      const now = new Date();
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      state.project.tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        if (dueDate > now && dueDate <= twoDaysFromNow) {
          const notificationExists = state.notifications.some(
            n => n.message.includes(task.id)
          );

          if (!notificationExists) {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                id: `notif-${task.id}-${Date.now()}`,
                message: `Task "${task.title}" (ID: ${task.id}) is due soon.`,
                read: false,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }
      });
    };

    checkDueDates();
    const intervalId = setInterval(checkDueDates, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.project.tasks, dispatch]);
};
