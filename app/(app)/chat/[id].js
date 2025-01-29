import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Linking,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../../../utils/api";
import { useAuth } from "../../../context/AuthProvider";
import { normalize } from "../../../utils/functions";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../components/Loader";
import { MaterialIcons } from "@expo/vector-icons";

const BidCard = ({ bid }) => {
  const { colour } = useAuth();
  
  const styles = StyleSheet.create({
    bidCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: "#3d3d3d",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bidHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    bidTitle: {
      fontSize: normalize(18),
      fontWeight: "600",
      color: colour.primaryColor,
      marginLeft: 8,
    },
    bidDetails: {
      gap: 8,
    },
    bidRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    bidText: {
      fontSize: normalize(14),
      color: "#333",
      flex: 1,
    },
    bidAmount: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#eee",
    },
    bidAmountLabel: {
      fontSize: normalize(14),
      color: "#666",
      marginBottom: 4,
    },
    bidAmountValue: {
      fontSize: normalize(18),
      fontWeight: "600",
      color: colour.primaryColor,
    },
    bidAmountDetail: {
      fontSize: normalize(12),
      color: "#666",
      marginTop: 4,
    }
  });

  return (
    <View style={styles.bidCard}>
      <View style={styles.bidHeader}>
        <MaterialIcons name="handshake" size={24} color={colour.primaryColor} />
        <Text style={styles.bidTitle}>Bid Accepted</Text>
      </View>
      
      <View style={styles.bidDetails}>
        <View style={styles.bidRow}>
          <MaterialIcons name="local-shipping" size={20} color="#666" />
          <Text style={styles.bidText}>
            {bid.truckId.truckType} - {bid.truckId.truckNumber}
          </Text>
        </View>
        
        <View style={styles.bidRow}>
          <MaterialIcons name="inventory" size={20} color="#666" />
          <Text style={styles.bidText}>
            {bid.materialType} • {bid.weight} Tonnes
          </Text>
        </View>

        <View style={styles.bidRow}>
          <MaterialIcons name="place" size={20} color="#14B8A6" />
          <Text style={styles.bidText}>{bid.source.placeName}</Text>
        </View>

        <View style={styles.bidRow}>
          <MaterialIcons name="place" size={20} color="#F43F5E" />
          <Text style={styles.bidText}> {bid.destination.placeName}</Text>
        </View>

        <View style={styles.bidAmount}>
          <Text style={styles.bidAmountLabel}>Amount</Text>
          <Text style={styles.bidAmountValue}>₹{bid.biddedAmount.total}</Text>
          <Text style={styles.bidAmountDetail}>
            Advance: ₹{bid.biddedAmount.advanceAmount} • 
            Diesel: ₹{bid.biddedAmount.dieselAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Message = ({ message, isOwnMessage }) => {
  const { colour } = useAuth();

  const styles = StyleSheet.create({
    messageContainer: {
      maxWidth: "80%",
      marginVertical: 5,
      padding: 12,
      borderRadius: 15,
    },
    ownMessage: {
      alignSelf: "flex-end",
      backgroundColor: colour.primaryColor,
    },
    otherMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#E5E5EA",
    },
    systemMessage: {
      alignSelf: "center",
      backgroundColor: "#F2F2F7",
      maxWidth: "90%",
    },
    messageText: {
      fontSize: normalize(16),
    },
    ownMessageText: {
      color: "#fff",
    },
    otherMessageText: {
      color: "#000",
    },
    systemMessageText: {
      color: "#666",
      textAlign: "center",
      fontStyle: "italic",
    },
    timestamp: {
      fontSize: normalize(12),
      color: "#999",
      marginTop: 4,
      alignSelf: "flex-end",
    }
  });

  const isSystem = message.messageType === "SYSTEM";
  const isBidAccepted = message.messageType === "BID_ACCEPTED";

  if (isBidAccepted) {
    return <BidCard bid={message.bidData} />;
  }

  return (
    <View
      style={[
        styles.messageContainer,
        isSystem
          ? styles.systemMessage
          : isOwnMessage
          ? styles.ownMessage
          : styles.otherMessage,
      ]}>
      <Text
        style={[
          styles.messageText,
          isSystem
            ? styles.systemMessageText
            : isOwnMessage
            ? styles.ownMessageText
            : styles.otherMessageText,
        ]}>
        {message.content}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user, colour } = useAuth();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef();
  const lastMessageTimeRef = useRef(new Date());
  const pollingIntervalRef = useRef();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      flex: 1,
    },
    headerName: {
      fontSize: normalize(18),
      fontWeight: "bold",
    },
    headerCompany: {
      fontSize: normalize(14),
      color: "#666",
      marginTop: 2,
    },
    messagesList: {
      padding: 15,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: "#eee",
      alignItems: "center",
    },
    input: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginRight: 10,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: colour.primaryColor,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      fontSize: normalize(16),
      color: "#FF4444",
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: "#007AFF",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "#fff",
      fontSize: normalize(16),
      fontWeight: "600",
    }
  });

  const fetchChat = async () => {
    try {
      setError(null);
      const response = await api.get(`/chats/${id}`);
      const chatData = response.data.data;
      
      if (!chatData || !chatData.participants) {
        throw new Error("Invalid chat data received");
      }
      
      setChat(chatData);
      
      if (chatData.messages.length > 0) {
        lastMessageTimeRef.current = new Date(
          chatData.messages[chatData.messages.length - 1].timestamp
        );
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      setError(error.message || "Failed to load chat");
    } finally {
      setIsLoading(false);
    }
  };

  const pollNewMessages = async () => {
    try {
      const response = await api.get(
        `/chats/${id}/poll?lastMessageTime=${lastMessageTimeRef.current.toISOString()}`
      );
      if (response.data.data.length > 0) {
        setChat((prevChat) => {
          if (!prevChat) return null;
          return {
            ...prevChat,
            messages: [...prevChat.messages, ...response.data.data],
          };
        });
        lastMessageTimeRef.current = new Date(
          response.data.data[response.data.data.length - 1].timestamp
        );
      }
    } catch (error) {
      console.error("Error polling messages:", error);
    }
  };

  useEffect(() => {
    fetchChat();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(pollNewMessages, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [id]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsSending(true);
      await api.post(`/chats/${id}/messages`, { content: message });
      setMessage("");
      await fetchChat(); // Refresh chat to show new message
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchChat}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!chat || !chat.participants) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Chat not found</Text>
      </View>
    );
  }

  const otherParticipant = chat.participants.find((p) => p._id !== user._id);

  console.log("otherParticipant", otherParticipant);
  if (!otherParticipant) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Invalid chat participant data</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colour.background }]}>

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colour.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerName, { color: colour.text }]}>
            {otherParticipant.name}
          </Text>
          <Text style={styles.headerCompany}>{otherParticipant.companyName}</Text>
        </View>
        <Pressable onPress={() => Linking.openURL(`tel:${otherParticipant.mobile.phone}`)}>
          <Ionicons name="call" size={24} color={colour.primaryColor} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={chat.messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <Message
          message={item}
          isOwnMessage={item.sender === user._id}
          />
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
        />

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colour.inputBackground, color: colour.text },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          />
        <TouchableOpacity
          style={[styles.sendButton, { opacity: isSending ? 0.7 : 1 }]}
          onPress={sendMessage}
          disabled={isSending}>
          {isSending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
          </SafeAreaView>
  );
}