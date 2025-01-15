import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useChat } from '../../context/ChatProvider';
import { useAuth } from '../../context/AuthProvider';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

const ChatListItem = ({ chat, onPress }) => {
  const { user } = useAuth();
  
  // Add null checks and fallbacks
  if (!chat?.participants || !Array.isArray(chat.participants)) {
    console.error('Invalid chat data:', chat);
    return null;
  }

  const otherParticipant = chat.participants.find(p => p?._id !== user?._id) || {};
  const unreadCount = chat.unreadCounts?.find(c => c.user === user?._id)?.count || 0;

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>
          {otherParticipant.name || 'Unknown User'}
        </Text>
        {chat.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage.content || ''}
          </Text>
        )}
      </View>
      <View style={styles.chatMeta}>
        {chat.lastMessage?.createdAt && (
          <Text style={styles.timestamp}>
            {format(new Date(chat.lastMessage.createdAt), 'HH:mm')}
          </Text>
        )}
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function ChatList() {
  const { chats, loading, error, fetchChats } = useChat();
  const router = useRouter();

  const handleChatPress = (chatId) => {
    if (!chatId) {
      console.error('Invalid chat ID');
      return;
    }
    router.push({
      pathname: '/(app)/chat/[id]',
      params: { id: chatId }
    });
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchChats} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const validChats = chats.filter(chat => 
    chat && chat._id && Array.isArray(chat.participants) && chat.participants.length > 0
  );

  return (
    <FlatList
      data={validChats}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ChatListItem
          chat={item}
          onPress={() => handleChatPress(item._id)}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchChats} />
      }
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No chats yet</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  emptyText: {
    color: '#666',
  },
}); 