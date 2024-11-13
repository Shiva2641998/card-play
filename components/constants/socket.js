// src/socket.js
import { io } from "socket.io-client";

let socket;

export const initiateSocketConnection = (url) => {
  if (!socket) {
    socket = io(url);
    console.log("Socket connection initiated");
  }
  console.log("Socket Enter", socket)
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};

export const getSocket = () => socket;
