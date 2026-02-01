import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (organizationId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    const handleConnect = () => {
      setIsConnected(true);
      if (organizationId) {
        socketInstance.emit("join:organization", organizationId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.disconnect();
    };
  }, [organizationId]);

  return { socket, isConnected };
};