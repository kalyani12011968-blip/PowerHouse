import { io } from "socket.io-client";
import { GATEWAY_URL } from "./api";

let socket;

export function getSocket() {
  if (!socket) socket = io(GATEWAY_URL, { autoConnect: false, transports: ["websocket", "polling"] });
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  socket?.disconnect();
}
