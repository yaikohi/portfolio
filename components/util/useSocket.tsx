import { useEffect } from "react";
import io from "socket.io-client";

interface Props {
  wsUrl: string | any;
  eventName: string | any;
  callback: any;
}

export function useSocket({ wsUrl, eventName, callback }: Props) {
  const socket = io(wsUrl);
  useEffect(() => {
    socket.on(eventName, callback);
    return function useSocketCleanup() {
      socket.off(eventName, callback);
    };
  }, [eventName, callback]);

  return socket;
}
