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
      backgroundColor: colour.background,
      borderRadius: normalize(12),
      padding: normalize(16),
      marginVertical: normalize(8),
      borderBottomWidth: 1,
      borderBottomColor: "#E5E5E5",
      flexDirection: "row",
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
      marginBottom: normalize(4),
    },
    chatName: {
      fontSize: normalize(16),
      fontWeight: "600",
      color: colour.text,
      flex: 1,
      marginRight: normalize(8),
    },
    companyName: {
      fontSize: normalize(14),
      color: colour.iconText,
      marginBottom: normalize(8),
    },
    time: {
      fontSize: normalize(12),
      color: colour.iconText,
    },
    messageContainer: {
      marginTop: normalize(4),
    },
    regularMessage: {
      fontSize: normalize(14),
      color: colour.iconText,
    },
    bidMessageContainer: {
      backgroundColor: "#E6F7F5",
      padding: normalize(8),
      borderRadius: normalize(8),
      flexDirection: "row",
      alignItems: "center",
      marginTop: normalize(4),
    },
    bidIcon: {
      marginRight: normalize(8),
    },
    bidMessage: {
      color: colour.primaryColor,
      fontWeight: "500",
      fontSize: normalize(14),
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
        <Text style={styles.companyName} numberOfLines={1}>
          {otherParticipant.companyName}
        </Text>
        {lastMessage && (
          <View style={styles.messageContainer}>
            {isBidMessage ? (
              <View style={styles.bidMessageContainer}>
                <MaterialIcons
                  name="local-offer"
                  size={normalize(18)}
                  color={colour.primaryColor}
                  style={styles.bidIcon}
                />
                <Text style={styles.bidMessage}>
                  Bid Accepted - Let's start the journey!
                </Text>
              </View>
            ) : (
              <Text style={styles.regularMessage} numberOfLines={1}>
                {lastMessage.content}
              </Text>
            )}
          </View>
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
      backgroundColor: colour.background,
    },
    contentContainer: {
      flex: 1,
      padding: normalize(16),
    },
    header: {
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(12),
      borderBottomWidth: 1,
      borderBottomColor: "#E5E5E5",
      backgroundColor: colour.background,
    },
    title: {
      fontSize: normalize(24),
      fontWeight: "bold",
      color: colour.text,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: normalize(20),
    },
    emptyIcon: {
      marginBottom: normalize(16),
    },
    emptyTitle: {
      fontSize: normalize(18),
      fontWeight: "600",
      color: colour.text,
      marginBottom: normalize(8),
      textAlign: "center",
    },
    emptyText: {
      fontSize: normalize(14),
      textAlign: "center",
      color: colour.iconText,
      lineHeight: normalize(20),
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <View style={styles.contentContainer}>
        {chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="chat-bubble-outline"
              size={normalize(64)}
              color={colour.iconColor}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Messages Yet</Text>
            <Text style={styles.emptyText}>
              Your messages will appear here once you start chatting with transporters or truckers after accepting bids.
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
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
