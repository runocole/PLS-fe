import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/activities/');
      setNotifications(res.data);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};