import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScanSocketEvent } from '../api/socketClient';

const SOCKET_SERVER_URL = (import.meta.env.VITE_SOCKET_URL || 'https://mygurad-backend-v2.onrender.com').replace(/\/+$/, '');


export function useDocumentScanSocket(documentId: string | null) {
  const [scanData, setScanData] = useState<ScanSocketEvent | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const socket: Socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('join_document', documentId);
    });

    socket.on('scan_event', (eventData: ScanSocketEvent) => {
      console.log(`[Socket] Event received for ${documentId}:`, eventData);
      setScanData(eventData);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err);
      setIsConnected(false);
      setError('Socket bağlantısı kəsildi.');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId]);

  return { scanData, isConnected, error };
}
