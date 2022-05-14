import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function useSocketIO({
  url,
  options,
  on,
}: {
  url?: string;
  options?: any;
  on?: Record<string, Function>;
}) {
  if (url && options) {
    socket = io(url, options);
  }
  if (on) {
    socket.on('connect', () => {
      if (on['connect']) on['connect']();
    });
    socket.on('disconnect', () => {
      if (on['disconnect']) on['disconnect']();
    });
    socket.onAny((name, ...args) => {
      if (on[name]) on[name].apply(null, args);
    });
  }
  return { socket };
}
