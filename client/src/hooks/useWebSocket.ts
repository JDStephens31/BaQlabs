import { useEffect, useRef, useState } from "react";

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectInterval?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected'>('Disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('Connecting');
    
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host || 'localhost:5000';
      const wsUrl = `${protocol}//${host}/ws`;
      
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        setConnectionStatus('Connected');
        options.onConnect?.();
      };

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        options.onMessage?.(data);
      };

      websocketRef.current.onclose = () => {
        setConnectionStatus('Disconnected');
        options.onDisconnect?.();
        
        // Auto-reconnect
        if (options.reconnectInterval !== 0) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, options.reconnectInterval || 3000);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Disconnected');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('Disconnected');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    setConnectionStatus('Disconnected');
  };

  const sendMessage = (message: any) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [url]);

  return {
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
}