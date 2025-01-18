import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import ChatRoom from '../../../components/chat/ChatRoom';
import { useAuth } from '../../../context/AuthProvider';
import { useChat } from '../../../context/ChatProvider';

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const { colour } = useAuth();
  const { chats } = useChat();
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    const currentChat = chats.find(chat => chat._id === id);
    if (currentChat?.participants?.[0]?.name) {
      setChatName(currentChat.participants[0].name);
    }
  }, [chats, id]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colour.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{chatName || 'Chat'}</Text>
      </View>
      <View style={styles.chatContainer}>
        <ChatRoom chatId={id} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
}); 