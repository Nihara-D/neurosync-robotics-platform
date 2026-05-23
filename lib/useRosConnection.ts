'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { WebSocketMessage } from './types';

interface RosConnectionOptions {
  robotId: string;
  namespace?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: string) => void;
  onConnected?: (connected: boolean) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface UseRosConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  sendCommand: (type: string, payload: any) => Promise<boolean>;
  disconnect: () => void;
}

export function useRosConnection({
  robotId,
  namespace = '/robot',
  onMessage,
  onError,
  onConnected,
  autoReconnect = true,
  reconnectInterval = 3000,
}: RosConnectionOptions): UseRosConnectionReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);

  const connect = useCallback(() => {
    if (wsRef.current || isConnecting) return;

    setIsConnecting(true);

    try {
      // In development, we use HTTP endpoint that simulates WebSocket
      // In production, this would connect to actual ROS2 bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ros/websocket`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`[ROS Bridge] Connected to ${robotId}`);
        setIsConnected(true);
        setIsConnecting(false);
        setLastError(null);
        onConnected?.(true);

        // Send initial subscription message
        ws.send(
          JSON.stringify({
            type: 'subscribe',
            robotId,
            namespace,
            timestamp: Date.now(),
          })
        );

        // Flush queued messages
        while (messageQueueRef.current.length > 0) {
          const msg = messageQueueRef.current.shift();
          ws.send(JSON.stringify(msg));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('[ROS Bridge] Failed to parse message:', error);
        }
      };

      ws.onerror = (event) => {
        const errorMsg = `WebSocket connection error for ${robotId}`;
        console.error('[ROS Bridge]', errorMsg);
        setLastError(errorMsg);
        onError?.(errorMsg);
      };

      ws.onclose = () => {
        console.log(`[ROS Bridge] Disconnected from ${robotId}`);
        wsRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);
        onConnected?.(false);

        // Auto-reconnect
        if (autoReconnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown connection error';
      setLastError(errorMsg);
      onError?.(errorMsg);
      setIsConnecting(false);
    }
  }, [robotId, namespace, onMessage, onError, onConnected, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    onConnected?.(false);
  }, [onConnected]);

  const sendCommand = useCallback(
    async (type: string, payload: any): Promise<boolean> => {
      const message: WebSocketMessage = {
        type: type as any,
        robotId,
        payload,
        timestamp: Date.now(),
      };

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn('[ROS Bridge] WebSocket not connected, queueing message');
        messageQueueRef.current.push(message);
        return false;
      }

      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('[ROS Bridge] Failed to send message:', error);
        messageQueueRef.current.push(message);
        return false;
      }
    },
    [robotId]
  );

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Periodic ping/keepalive
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'ping',
            robotId,
            timestamp: Date.now(),
          })
        );
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected, robotId]);

  return {
    isConnected,
    isConnecting,
    lastError,
    sendCommand,
    disconnect,
  };
}
