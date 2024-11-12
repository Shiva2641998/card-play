'use client'

import { useEffect, useState } from 'react';
import { getSocket, initiateSocketConnection } from '../constants/socket';

const useSocket = (event, callback) => {
  const [isConnected, setIsConnected] = useState(false);
console.log("isConnected", isConnected)
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      initiateSocketConnection(window.location.origin); // Replace with your server URL
      // initiateSocketConnection('http://localhost:8080'); // Replace with your server URL
    }

    const currentSocket = getSocket();

    // Listen for the specified event
    currentSocket.on(event, callback);

    // Handle connection state
    currentSocket.on('connect', () => setIsConnected(true));
    currentSocket.on('disconnect', () => setIsConnected(false));

    return () => {
      currentSocket.off(event, callback); // Cleanup event listener on unmount
    };
  }, [event, callback]);

  return isConnected;
};

export default useSocket;