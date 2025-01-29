import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import { api } from "../../../utils/api";
import { useAuth } from "../../../context/AuthProvider";
import { normalize } from "../../../utils/functions";
import Loader from "../../../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const ChatItem = ({ chat, onPress }) => {
  const { user, colour } = useAuth();
  const otherParticipant = chat.participants.find(
    (p) => p._id !== user._id
  );

  const lastMessage = chat.messages[chat.messages.length - 1];
  const isBidMessage = lastMessage?.messageType === "BID_ACCEPTED";

  const styles = StyleSheet.create({
    chatItem: {
      flexDirection: "row",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      alignItems: "center",
    },
    avatar: {
      width: normalize(50),
      height: normalize(50),
      borderRadius: normalize(25),
      backgroundColor: colour.primaryColor,
      justifyContent: "center",
      alignItems: "center",
      marginRight: normalize(12),
    },
    avatarText: {
      color: "#fff",
      fontSize: normalize(20),
      fontWeight: "600",
    },
    chatInfo: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatName: {
      fontSize: normalize(16),
      fontWeight: "600",
      flex: 1,
      marginRight: normalize(8),
    },
    companyName: {
      fontSize: normalize(14),
      color: "#666",
      marginTop: 2,
    },
    lastMessage: {
      fontSize: normalize(14),
      color: "#666",
      marginTop: 4,
    },
    bidMessage: {
      color: colour.primaryColor,
      fontWeight: "500",
    },
    time: {
      fontSize: normalize(12),
      color: "#999",
    },
  });

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {otherParticipant.name?.charAt(0)?.toUpperCase()}
        </Text>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.chatName} numberOfLines={1}>
            {otherParticipant.name}
          </Text>
          <Text style={styles.time}>
            {lastMessage
              ? new Date(lastMessage.timestamp).toLocaleDateString()
              : ""}
          </Text>
        </View>
        <Text style={styles.companyName}>{otherParticipant.companyName}</Text>
        {lastMessage && (
          <Text 
            style={[
              styles.lastMessage,
              isBidMessage && styles.bidMessage
            ]} 
            numberOfLines={1}
          >
            {isBidMessage ? "🤝 New Bid Accepted" : lastMessage.content}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { colour } = useAuth();
  const pollingIntervalRef = useRef();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: normalize(24),
      fontWeight: "bold",
      marginBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: normalize(16),
      textAlign: "center",
      color: "#666",
    },
    listContainer: {
      flexGrow: 1,
    },
  });

  const fetchChats = async () => {
    try {
      const response = await api.get("/chats");
      setChats(response.data.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchChats();

      // Set up polling interval
      pollingIntervalRef.current = setInterval(fetchChats, 30000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }, [])
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colour.background }]}>
      <Text style={[styles.title, { color: colour.text }]}>Messages</Text>
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colour.text }]}>
            No messages yet. Accept a bid to start chatting!
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChatItem
              chat={item}
              onPress={() => router.push(`/(app)/chat/${item._id}`)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}
