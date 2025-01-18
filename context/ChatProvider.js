import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { socketService } from '../services/socket';
import { useAuth } from './AuthProvider';
import { router } from 'expo-router';

const ChatContext = createContext({});

export function ChatProvider({ children }) {
  const { user, token, isAuthenticated } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Initialize socket when authenticated
  useEffect(() => {
    let socketCheckInterval;

    const initializeSocket = () => {
      if (token && isAuthenticated && user?._id) {
        console.log('Attempting to initialize socket...', {
          hasToken: !!token,
          isAuthenticated,
          userId: user._id
        });

        socketService.initialize(token);
        
        // Wait for connection before joining room
        const checkConnection = setInterval(() => {
          if (socketService.isConnected()) {
            console.log('Socket connected, joining personal room');
            socketService.joinPersonalRoom(user._id);
            setIsSocketConnected(true);
            clearInterval(checkConnection);
          }
        }, 1000);

        socketCheckInterval = checkConnection;
        
        // Fetch initial chats
        fetchChats();
      }
    };

    initializeSocket();

    return () => {
      if (socketCheckInterval) {
        clearInterval(socketCheckInterval);
      }
      console.log('Cleaning up socket connection');
      socketService.disconnect();
      setIsSocketConnected(false);
    };
  }, [token, isAuthenticated, user]);

  // Handle new messages
  useEffect(() => {
    if (!isAuthenticated || !user?._id || !isSocketConnected) return;

    const handleNewMessage = (data) => {
      console.log('New message received:', data);
      const message = data.message;
      
      // Update messages for the relevant chat
      setMessages(prev => {
        const chatMessages = prev[message.chat] || [];
        
        // Check if this is a temporary message being replaced
        const tempMessageIndex = chatMessages.findIndex(
          msg => msg._id.toString().startsWith('temp_') && 
                msg.content === message.content && 
                msg.sender._id === message.sender._id
        );

        if (tempMessageIndex !== -1) {
          // Replace temporary message with server message
          const updatedMessages = [...chatMessages];
          updatedMessages[tempMessageIndex] = message;
          return {
            ...prev,
            [message.chat]: updatedMessages
          };
        }

        // If not a temporary message, append it
        return {
          ...prev,
          [message.chat]: [...chatMessages, message]
        };
      });

      // Update last message in chats list
      setChats(prev => 
        prev.map(chat => 
          chat._id === message.chat 
            ? { ...chat, lastMessage: message }
            : chat
        )
      );
    };

    console.log('Setting up message listener');
    socketService.onNewMessage(handleNewMessage);

    return () => {
      console.log('Cleaning up message listener');
      socketService.socket?.off('newMessage', handleNewMessage);
    };
  }, [isAuthenticated, user, isSocketConnected]);

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      console.log('Auth error detected, redirecting to login');
      // Token expired or invalid, redirect to login
      router.replace('/(auth)/login');
      return true;
    }
    return false;
  };

  const fetchChats = async () => {
    try {
      if (!isAuthenticated || !user?._id) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      const response = await api.get('/chats');
      if (response.data?.success && Array.isArray(response.data?.chats)) {
        setChats(response.data.chats);
      } else {
        console.error('Invalid chats response format:', response.data);
        setChats([]);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      if (!handleAuthError(err)) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch chats');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId, page = 1) => {
    try {
      if (!isAuthenticated || !user?._id) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      const response = await api.get(`/chat/${chatId}/messages?page=${page}`);
      
      // Check if the response has the success flag and messages array
      if (response.data?.success && Array.isArray(response.data?.messages)) {
        setMessages(prev => ({
          ...prev,
          [chatId]: page === 1 
            ? response.data.messages 
            : [...(prev[chatId] || []), ...response.data.messages]
        }));
        return response.data; // Return the response data
      } else {
        console.log('No messages found, initializing empty array');
        setMessages(prev => ({
          ...prev,
          [chatId]: page === 1 ? [] : (prev[chatId] || [])
        }));
        return { messages: [] }; // Return empty messages array
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      if (!handleAuthError(err)) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch messages');
      }
      throw err; // Re-throw the error to be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId, content) => {
    try {
      if (!isAuthenticated || !user?._id) {
        throw new Error('Not authenticated');
      }

      if (!isSocketConnected) {
        throw new Error('Socket not connected');
      }

      // Create a temporary message object for immediate UI update
      const tempMessage = {
        _id: `temp_${Date.now()}`, // prefix to identify temporary messages
        chat: chatId,
        content,
        sender: {
          _id: user._id,
          name: user.name,
          mobile: user.mobile,
          userType: user.userType
        },
        readBy: [user._id],
        createdAt: new Date().toISOString()
      };

      // Update UI immediately with temporary message
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), tempMessage]
      }));

      // Update chats list with temporary message
      setChats(prev => 
        prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, lastMessage: tempMessage }
            : chat
        )
      );

      // Send via socket
      socketService.sendMessage(chatId, content, user._id);

      return tempMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      if (!handleAuthError(err)) {
        setError(err.message || 'Failed to send message');
      }
      throw err;
    }
  };

  const markMessageAsRead = (messageId) => {
    if (!isAuthenticated || !user?._id) {
      console.error('Not authenticated');
      return;
    }
    try {
      socketService.markMessageAsRead(messageId, user._id);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        loading,
        error,
        activeChat,
        setActiveChat,
        fetchChats,
        fetchMessages,
        sendMessage,
        markMessageAsRead,
        isSocketConnected,
      }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext); 