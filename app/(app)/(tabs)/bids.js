import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { api } from "../../../utils/api";
import { useAuth } from "../../../context/AuthProvider";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import { MaterialIcons } from "@expo/vector-icons";

const BidCard = ({ bid, onBidClosed }) => {
  const { colour, user, token } = useAuth();
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseBid = async () => {
    Alert.alert(
      "Close Bid",
      "Are you sure you want to close this bid? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Close Bid",
          style: "destructive",
          onPress: async () => {
            setIsClosing(true);
            try {
              console.log("rkjhntrkngitugikutgnvtngviutnviutngviut", token);
              await api.delete(`/bid/${bid._id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert("Success", "Bid closed successfully");
              // Refresh the bids list after successful deletion
              if (typeof onBidClosed === "function") {
                onBidClosed(bid._id);
              }
            } catch (error) {
              console.error("Error closing bid:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to close bid"
              );
            } finally {
              setIsClosing(false);
            }
          },
        },
      ]
    );
  };

  const handleChat = () => {
    // TODO: Implement chat functionality
    Alert.alert("Coming Soon", "Chat functionality will be available soon!");
  };

  const calculateAverageRating = () => {
    if (!bid.truckId?.rating || bid.truckId.rating.length === 0) return 0;
    const totalRating = bid.truckId.rating.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    return (totalRating / bid.truckId.rating.length).toFixed(1);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      width: "60%",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "gold",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1E293B",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    nameContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1E293B",
      marginBottom: 2,
    },
    role: {
      fontSize: 14,
      color: "#64748B",
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFB800",
      marginRight: 14,
    },
    materialImage: {
      width: 56,
      height: 56,
      marginRight: 12,
      backgroundColor: "#F8FAFC",
      borderRadius: 8,
    },
    materialContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      position: "relative",
    },
    materialInfo: {
      flex: 1,
    },
    materialType: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1E293B",
      marginBottom: 4,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    locationIcon: {
      marginRight: 8,
    },
    locationText: {
      fontSize: 14,
      color: "#64748B",
    },
    specs: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 24,
      marginTop: 16,
      marginBottom: 20,
    },
    specItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    specIcon: {
      marginRight: 6,
    },
    specText: {
      fontSize: 14,
      color: "#64748B",
    },
    priceContainer: {
      marginBottom: 16,
    },
    price: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: 2,
    },
    pricePerTonne: {
      fontSize: 14,
      color: "#64748B",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    closeButton: {
      backgroundColor: "#FFF1F2",
    },
    chatButton: {
      backgroundColor: colour.primaryColor,
    },
    buttonText: (variant) => ({
      fontSize: 15,
      fontWeight: "600",
      color: variant === "close" ? "#DC2626" : "#fff",
    }),
    timestamp: {
      position: "absolute",
      right: 0,
      top: 0,
      backgroundColor: "#F8FAFC",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    timestampText: {
      fontSize: 12,
      color: "#64748B",
    },
  });

  const getBidStatusColor = () => {
    switch (bid.status) {
      case "ACCEPTED":
        return "#10B981";
      case "REJECTED":
        return "#EF4444";
      default:
        return "#F59E0B";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {bid.bidBy?.profileImage ? (
            <Image
              source={{ uri: bid.bidBy.profileImage }}
              style={styles.avatar}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {bid.bidBy?.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{bid.bidBy?.name || "Unknown User"}</Text>
            <Text style={styles.role}>{bid.bidBy?.userType || "User"}</Text>
          </View>
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{calculateAverageRating()}</Text>
          <Text style={styles.ratingText}>★</Text>
        </View>
      </View>

      <View style={styles.materialContainer}>
        {bid.materialImage ? (
          <Image
            source={{ uri: bid.materialImage }}
            style={styles.materialImage}
            resizeMode='cover'
          />
        ) : (
          <View style={styles.materialImage} />
        )}
        <View style={styles.materialInfo}>
          <Text style={styles.materialType}>
            {bid.materialType || "Unknown Material"}
          </Text>
          <View style={styles.locationContainer}>
            <MaterialIcons
              name='circle'
              size={8}
              color='#14B8A6'
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>
              {bid.source?.placeName || "Unknown Location"}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <MaterialIcons
              name='circle'
              size={8}
              color='#F43F5E'
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>
              {bid.destination?.placeName || "Unknown Location"}
            </Text>
          </View>
        </View>
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>
            {new Date(bid.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.specs}>
        <View style={styles.specItem}>
          <MaterialIcons
            name='shopping-bag'
            size={18}
            color='#64748B'
            style={styles.specIcon}
          />
          <Text style={styles.specText}>{bid.weight || 0} Tonnes</Text>
        </View>
        <View style={styles.specItem}>
          <MaterialIcons
            name='local-shipping'
            size={18}
            color='#64748B'
            style={styles.specIcon}
          />
          <Text style={styles.specText}>
            {bid.truckId?.truckType || "Unknown"}
          </Text>
        </View>
        <View style={styles.specItem}>
          <MaterialIcons
            name='tire-repair'
            size={18}
            color='#64748B'
            style={styles.specIcon}
          />
          <Text style={styles.specText}>
            {bid.truckId?.truckTyre || 0} Wheels
          </Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{bid.offeredAmount?.total || 0}</Text>
        <Text style={styles.pricePerTonne}>
          ₹
          {(
            (bid.offeredAmount?.total || 0) / (bid.truckId?.truckCapacity || 1)
          ).toFixed(2)}
          /Tonne
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.closeButton]}
          onPress={handleCloseBid}
          disabled={isClosing || bid.status === "ACCEPTED"}>
          <Text style={styles.buttonText("close")}>
            {isClosing ? "Closing..." : "Close Bid"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.chatButton]}
          onPress={handleChat}
          disabled={bid.status === "REJECTED"}>
          <Text style={styles.buttonText("chat")}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Bids = () => {
  const { colour } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [userBids, setUserBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBidClosed = (bidId) => {
    // Remove the closed bid from the state
    setUserBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
  };

  const fetchBids = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/bid");
      setUserBids(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
      Alert.alert("Error", "Failed to fetch bids");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const filteredBids = useMemo(() => {
    switch (activeTab) {
      case "accepted":
        return userBids.filter((bid) => bid.status === "ACCEPTED");
      case "awaiting":
        return userBids.filter((bid) => bid.status === "PENDING");
      default:
        return userBids;
    }
  }, [userBids, activeTab]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
      paddingTop: 16,
    },
    tabContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 12,
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      backgroundColor: "#fff",
    },
    activeTab: {
      backgroundColor: colour.primaryColor,
      borderColor: colour.primaryColor,
    },
    tabText: {
      fontSize: 14,
      color: "#64748B",
      fontWeight: "500",
    },
    activeTabText: {
      color: "#fff",
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      color: "#64748B",
      marginTop: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    emptyText: {
      fontSize: 16,
      color: "#64748B",
      textAlign: "center",
      marginTop: 12,
    },
    refreshButton: {
      marginTop: 16,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colour.primaryColor,
      borderRadius: 8,
    },
    refreshButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={colour.primaryColor} />
          <Text style={styles.loadingText}>Loading bids...</Text>
        </View>
      );
    }

    if (!filteredBids.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "all"
              ? "You haven't placed any bids yet."
              : activeTab === "accepted"
              ? "No accepted bids found."
              : "No pending bids found."}
          </Text>
          <Pressable style={styles.refreshButton} onPress={fetchBids}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        {filteredBids.map((bid) => (
          <BidCard key={bid._id} bid={bid} onBidClosed={handleBidClosed} />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}>
            All Bids
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "accepted" && styles.activeTab]}
          onPress={() => setActiveTab("accepted")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "accepted" && styles.activeTabText,
            ]}>
            Accepted
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "awaiting" && styles.activeTab]}
          onPress={() => setActiveTab("awaiting")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "awaiting" && styles.activeTabText,
            ]}>
            Awaiting Response
          </Text>
        </Pressable>
      </View>

      {renderContent()}
    </View>
  );
};

export default Bids;
