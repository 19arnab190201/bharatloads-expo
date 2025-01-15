import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import ChatList from "../../../components/chat/ChatList";
import { useAuth } from "../../../context/AuthProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Chat() {
  const { colour } = useAuth();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colour.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ChatList />
        <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: colour.primary }]}
          onPress={() => router.push("/(app)/chat/new")}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
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
  newChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
