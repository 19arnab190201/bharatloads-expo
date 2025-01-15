import { View, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ChatRoom from '../../../components/chat/ChatRoom';
import { useAuth } from '../../../context/AuthProvider';

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const { colour } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colour.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ChatRoom chatId={id} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
}); 