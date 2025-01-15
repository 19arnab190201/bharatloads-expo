import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useChat } from '../../context/ChatProvider';
import { useAuth } from '../../context/AuthProvider';
import { format } from 'date-fns';
import { socketService } from '../../services/socket';

const Message = ({ message, isOwnMessage }) => (
  <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
    <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
      {message.content}
    </Text>
    <Text style={styles.timestamp}>
      {format(new Date(message.createdAt), 'HH:mm')}
    </Text>
  </View>
);

export default function ChatRoom({ chatId }) {
  const { messages, loading, error, fetchMessages, sendMessage, markMessageAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const flatListRef = useRef(null);

  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    loadInitialMessages();
  }, [chatId]);

  useEffect(() => {
    // Mark unread messages as read
    chatMessages.forEach(message => {
      if (message.sender._id !== user._id && !message.readBy.includes(user._id)) {
        markMessageAsRead(message.id);
      }
    });
  }, [chatMessages]);

  const loadInitialMessages = async () => {
    try {
      const response = await fetchMessages(chatId, 1);
      // If we get less than 20 messages (or your page size), there are no more to load
      if (response?.messages?.length < 20) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading initial messages:', err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      socketService.sendMessage(chatId, newMessage.trim(), user._id);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      Alert.alert(
        'Error',
        'Failed to send message. Please try again.'
      );
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || loading) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchMessages(chatId, nextPage);
      
      // If we get less than 20 messages or no messages, there are no more to load
      if (!response?.messages?.length || response.messages.length < 20) {
        setHasMore(false);
      } else {
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderMessage = ({ item }) => (
    <Message
      message={item}
      isOwnMessage={item.sender._id === user._id}
    />
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => loadInitialMessages()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted
        onEndReached={hasMore ? handleLoadMore : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : null
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!newMessage.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
  },
  loadingMore: {
    padding: 10,
    alignItems: 'center',
  },
}); 