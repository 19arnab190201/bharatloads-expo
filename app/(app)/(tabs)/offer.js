import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { api } from "../../../utils/api";
import { useAuth } from "../../../context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { normalize, formatMoneytext } from "../../../utils/functions";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../../components/Loader";

const OfferCard = ({ offer, onOfferStatusChange }) => {
  const { colour, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptOffer = () => {
    Alert.alert(
      "Accept Offer",
      "Are you sure you want to accept this offer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          style: "default",
          onPress: async () => {
            setIsProcessing(true);
            try {
              await api.put(`/bid/${offer._id}/accept`, {}, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert("Success", "Offer accepted successfully");
              if (typeof onOfferStatusChange === "function") {
                onOfferStatusChange(offer._id, "ACCEPTED");
              }
            } catch (error) {
              console.error("Error accepting offer:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to accept offer"
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectOffer = () => {
    Alert.alert(
      "Reject Offer",
      "Are you sure you want to reject this offer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setIsProcessing(true);
            try {
              await api.put(`/bid/${offer._id}/status`, 
                { status: "REJECTED" },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              Alert.alert("Success", "Offer rejected successfully");
              if (typeof onOfferStatusChange === "function") {
                onOfferStatusChange(offer._id, "REJECTED");
              }
            } catch (error) {
              console.error("Error rejecting offer:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to reject offer"
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleChat = () => {
    Alert.alert("Coming Soon", "Chat functionality will be available soon!");
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: normalize(12),
      padding: normalize(16),
      marginBottom: normalize(16),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: normalize(2),
      },
      shadowOpacity: 0.05,
      shadowRadius: normalize(4),
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: normalize(12),
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(8),
      width: "60%",
    },
    avatar: {
      width: normalize(40),
      height: normalize(40),
      borderRadius: normalize(20),
      backgroundColor: "gold",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: normalize(16),
      fontWeight: "600",
      color: "#1E293B",
    },
    nameContainer: {
      flex: 1,
    },
    name: {
      fontSize: normalize(16),
      fontWeight: "600",
      color: "#1E293B",
      marginBottom: normalize(2),
    },
    role: {
      fontSize: normalize(14),
      color: "#64748B",
    },
    statusBadge: {
      paddingHorizontal: normalize(12),
      paddingVertical: normalize(4),
      borderRadius: normalize(12),
      backgroundColor: "#F8FAFC",
    },
    statusText: (status) => ({
      fontSize: normalize(14),
      fontWeight: "600",
      color: status === "ACCEPTED" ? "#10B981" : 
             status === "REJECTED" ? "#EF4444" : "#F59E0B",
    }),
    materialContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: normalize(16),
      position: "relative",
    },
    materialImage: {
      width: normalize(56),
      height: normalize(56),
      marginRight: normalize(12),
      backgroundColor: "#F8FAFC",
      borderRadius: normalize(8),
    },
    materialInfo: {
      flex: 1,
    },
    materialType: {
      fontSize: normalize(16),
      fontWeight: "600",
      color: "#1E293B",
      marginBottom: normalize(4),
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: normalize(4),
    },
    locationIcon: {
      marginRight: normalize(8),
    },
    locationText: {
      fontSize: normalize(14),
      color: "#64748B",
    },
    specs: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: normalize(24),
      marginTop: normalize(2),
      marginBottom: normalize(2),
    },
    specItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    specIcon: {
      marginRight: normalize(6),
    },
    specText: {
      fontSize: normalize(14),
      color: "#64748B",
    },
    priceContainer: {
      marginBottom: normalize(16),
    },
    priceDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    priceInfo: {
      flex: 1,
    },
    priceLabel: {
      fontSize: normalize(14),
      fontWeight: "600",
      color: "#64748B",
      marginBottom: normalize(2),
    },
    priceValue: {
      fontSize: normalize(16),
      fontWeight: "700",
      color: "#1E293B",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: normalize(12),
    },
    button: {
      flex: 1,
      paddingVertical: normalize(12),
      borderRadius: normalize(8),
      alignItems: "center",
    },
    rejectButton: {
      backgroundColor: "#FFF1F2",
    },
    acceptButton: {
      backgroundColor: "#DCFCE7",
    },
    chatButton: {
      backgroundColor: colour.primaryColor,
    },
    buttonText: (variant) => ({
      fontSize: normalize(15),
      fontWeight: "600",
      color: variant === "reject" ? "#DC2626" : 
             variant === "accept" ? "#10B981" : "#fff",
    }),
    timestamp: {
      position: "absolute",
      right: 0,
      top: 0,
      backgroundColor: "#F8FAFC",
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(4),
      borderRadius: normalize(6),
    },
    timestampText: {
      fontSize: normalize(12),
      color: "#64748B",
    },
    horizontalSeperator: {
      borderWidth: 0.5,
      borderColor: "#E2E8F0",
      marginVertical: normalize(12),
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {offer.bidBy?.profileImage ? (
            <Image
              source={{ uri: offer.bidBy.profileImage }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {offer.bidBy?.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {offer.bidBy?.name || "Unknown User"}
            </Text>
            <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
              {offer.bidBy?.userType || "User"}
            </Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText(offer.status)}>
            {offer.status}
          </Text>
        </View>
      </View>

      <View style={styles.materialContainer}>
        <View style={styles.materialImage} >
          <Image
            source={require("../../../assets/images/parcel.png")}
            style={styles.materialImage}
            resizeMode='contain'
          />
        </View>
        <View style={styles.materialInfo}>
          <Text style={styles.materialType} numberOfLines={1} ellipsizeMode="tail">
            {offer.materialType || "Unknown Material"}
          </Text>
          <View style={styles.locationContainer}>
            <MaterialIcons
              name="circle"
              size={normalize(8)}
              color="#14B8A6"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
              {offer.source?.placeName || "Unknown Location"}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <MaterialIcons
              name="circle"
              size={normalize(8)}
              color="#F43F5E"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
              {offer.destination?.placeName || "Unknown Location"}
            </Text>
          </View>
        </View>
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>
            {new Date(offer.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.horizontalSeperator} />
      <View style={styles.specs}>
        <View style={styles.specItem}>
          <MaterialIcons
            name="shopping-bag"
            size={normalize(18)}
            color="#64748B"
            style={styles.specIcon}
          />
          <Text style={styles.specText}>{offer.weight || 0} Tonnes</Text>
        </View>
        <View style={styles.specItem}>
          <MaterialIcons
            name="local-shipping"
            size={normalize(18)}
            color="#64748B"
            style={styles.specIcon}
          />
          <Text style={styles.specText} numberOfLines={1} ellipsizeMode="tail">
            {offer.truckId?.truckType || "Unknown"}
          </Text>
        </View>
        <View style={styles.specItem}>
          <MaterialIcons
            name="tire-repair"
            size={normalize(18)}
            color="#64748B"
            style={styles.specIcon}
          />
          <Text style={styles.specText}>
            {offer.truckId?.truckTyre || 0} Wheels
          </Text>
        </View>
      </View>
      <View style={styles.horizontalSeperator} />


      <View style={styles.priceContainer}>
        <View style={styles.priceDetails}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Bidded Amount</Text>
            <Text style={styles.priceValue}>₹{formatMoneytext(offer.biddedAmount?.total || 0)}</Text>
            <Text style={styles.priceLabel}>
              Advance: {formatMoneytext(offer.biddedAmount?.advanceAmount || 0)}</Text>
            <Text style={styles.priceLabel}>
              Diesel: ₹{formatMoneytext(offer.biddedAmount?.dieselAmount || 0)}
            </Text>
          </View>
          <View style={{...styles.priceInfo, alignItems: 'flex-end'}}>
            <Text style={styles.priceLabel}>Your Original Amount</Text>
            <Text style={styles.priceValue}>₹{formatMoneytext(offer.offeredAmount?.total || 0)}</Text>
            <Text style={styles.priceLabel}>
              Advance: {formatMoneytext(offer.offeredAmount?.advanceAmount || 0)}</Text>
            <Text style={styles.priceLabel}>
              Diesel: ₹{formatMoneytext(offer.offeredAmount?.dieselAmount || 0)}
            </Text>
          </View>
        </View>
      </View>

      {offer.status === "PENDING" ? (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.rejectButton]}
            onPress={handleRejectOffer}
            disabled={isProcessing}>
            <Text style={styles.buttonText("reject")}>
              {isProcessing ? "Processing..." : "Reject"}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.acceptButton]}
            onPress={handleAcceptOffer}
            disabled={isProcessing}>
            <Text style={styles.buttonText("accept")}>
              {isProcessing ? "Processing..." : "Accept"}
            </Text>
          </Pressable>
        </View>
      ) : offer.status === "REJECTED" ? ( null 
      ) : offer.status === "ACCEPTED" ? (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.chatButton]}
            onPress={handleChat}>
            <Text style={styles.buttonText("chat")}>Chat</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const Offers = () => {
  const { colour } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOfferStatusChange = (offerId, newStatus) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer._id === offerId ? { ...offer, status: newStatus } : offer
      )
    );
  };

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/offer");
      setOffers(response.data.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      Alert.alert("Error", "Failed to fetch offers");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOffers();
    }, [])
  );

  const filteredOffers = useMemo(() => {
    switch (activeTab) {
      case "accepted":
        return offers.filter((offer) => offer.status === "ACCEPTED");
      case "rejected":
        return offers.filter((offer) => offer.status === "REJECTED");
      case "pending":
        return offers.filter((offer) => offer.status === "PENDING");
      default:
        return offers;
    }
  }, [offers, activeTab]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
      paddingTop: normalize(16),
    },
    tabContainer: {
      flexDirection: "row",
      paddingHorizontal: normalize(16),
      marginBottom: normalize(16),
      gap: normalize(12),
    },
    tab: {
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(8),
      borderRadius: normalize(24),
      borderWidth: 1,
      borderColor: "#E2E8F0",
      backgroundColor: "#fff",
    },
    activeTab: {
      backgroundColor: colour.primaryColor,
      borderColor: colour.primaryColor,
    },
    tabText: {
      fontSize: normalize(14),
      color: "#64748B",
      fontWeight: "500",
    },
    activeTabText: {
      color: "#fff",
    },
    content: {
      flex: 1,
      paddingHorizontal: normalize(16),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: normalize(16),
      color: "#64748B",
      marginTop: normalize(12),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: normalize(24),
    },
    emptyText: {
      fontSize: normalize(16),
      color: "#64748B",
      textAlign: "center",
      marginTop: normalize(12),
    },
    refreshButton: {
      marginTop: normalize(16),
      paddingHorizontal: normalize(24),
      paddingVertical: normalize(12),
      backgroundColor: colour.primaryColor,
      borderRadius: normalize(8),
    },
    refreshButtonText: {
      color: "#fff",
      fontSize: normalize(14),
      fontWeight: "600",
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={[styles.loadingContainer, { backgroundColor: '#fff' }]}>
          <Loader />
        </View>
      );
    }

    if (!filteredOffers.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "all"
              ? "No offers available."
              : `No ${activeTab} offers found.`}
          </Text>
          <Pressable style={styles.refreshButton} onPress={fetchOffers}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        {filteredOffers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            onOfferStatusChange={handleOfferStatusChange}
          />
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
            style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
            All Offers
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}>
            Pending
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
      </View>

      {renderContent()}
    </View>
  );
};

export default Offers;
