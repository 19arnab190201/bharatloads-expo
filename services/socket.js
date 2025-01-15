import { io } from 'socket.io-client';

class SocketService {
  socket = null;
  
  initialize(token) {
    try {
      if (this.socket?.connected) {
        console.log('Socket already connected');
        return;
      }

      if (this.socket) {
        console.log('Cleaning up existing socket');
        this.socket.disconnect();
        this.socket = null;
      }

      const socketUrl = process.env.EXPO_PUBLIC_API_URL.replace('/api/v1', '');
      console.log('Initializing socket connection to:', socketUrl);
      
      this.socket = io(socketUrl, {
        transports: ['websocket'],
        autoConnect: true,
        auth: {
          token: `Bearer ${token}`
        },
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  setupEventListeners() {
    if (!this.socket) {
      console.error('Cannot setup listeners: Socket not initialized');
      return;
    }

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      console.error('Connection details:', {
        url: this.socket.io.uri,
        opts: this.socket.io.opts,
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.io.on('reconnect', (attempt) => {
      console.log('Socket reconnected after', attempt, 'attempts');
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      console.log('Socket reconnection attempt:', attempt);
    });

    this.socket.io.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after all attempts');
    });
  }

  joinPersonalRoom(userId) {
    if (!this.socket) {
      console.error('Cannot join room: Socket not initialized');
      return;
    }
    console.log('Joining personal room for user:', userId);
    this.socket.emit('join', userId);
  }

  sendMessage(chatId, content, senderId) {
    if (!this.socket) {
      console.error('Cannot send message: Socket not initialized');
      return;
    }
    console.log('Sending message via socket:', { chatId, content, senderId });
    this.socket.emit('sendMessage', { chatId, content, senderId });
  }

  markMessageAsRead(messageId, userId) {
    if (!this.socket) {
      console.error('Cannot mark message as read: Socket not initialized');
      return;
    }
    console.log('Marking message as read:', { messageId, userId });
    this.socket.emit('messageRead', { messageId, userId });
  }

  onNewMessage(callback) {
    if (!this.socket) {
      console.error('Cannot listen for messages: Socket not initialized');
      return;
    }
    console.log('Setting up new message listener');
    this.socket.on('newMessage', callback);
  }

  disconnect() {
    if (!this.socket) {
      console.log('No socket connection to disconnect');
      return;
    }
    console.log('Disconnecting socket');
    this.socket.disconnect();
    this.socket = null;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService(); 