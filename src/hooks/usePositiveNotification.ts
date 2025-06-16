
import { useState } from "react";

interface NotificationState {
  message: string;
  isVisible: boolean;
  type: 'success' | 'info';
}

export function usePositiveNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    isVisible: false,
    type: 'success'
  });

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({
      message,
      isVisible: true,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
}
