import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthProvider";
import BidSelectionModal from "./BidSelectionModal";
import BidAmountModal from "./BidAmountModal";
import TruckInfoDrawer from "./TruckInfoDrawer";
import { limitText } from "../utils/functions";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";
import { getTimeLeft } from "../utils/functions";
import { api } from "../utils/api";
import { normalize, formatText } from "../utils/functions";



export default function TruckCard({ data, onBidPlaced, onTruckUpdated }) {
  const { colour, user, token } = useAuth();
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showBidSelectionModal, setShowBidSelectionModal] = useState(false);
  const [showBidAmountModal, setShowBidAmountModal] = useState(false);
  const [userLoads, setUserLoads] = useState([]);
  const [isLoadingLoads, setIsLoadingLoads] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const {
    truckOwner,
    truckType,
    isRCVerified,
    totalBids = 0,
    truckPermit,
    truckLocation,
    truckTyre,
    vehicleBodyType,
    bids = [],
    truckCapacity,
    expiresAt,
    truckNumber,
    _id,
    vehicleNumber,
    vehicleType,
    truckBodyType,
    numberOfWheels,
    currentLocation,
  } = data;

  const fetchUserLoads = async () => {
    try {
      setIsLoadingLoads(true);
      const response = await api.get("/load", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserLoads(response.data.data);
    } catch (error) {
      console.error("Error fetching user loads:", error);
      Alert.alert("Error", "Failed to fetch your loads. Please try again.");
    } finally {
      setIsLoadingLoads(false);
    }
  };

  const handleBidButtonPress = async () => {
    await fetchUserLoads();
    setShowBidSelectionModal(true);
  };

  const handleLoadSelect = (load) => {
    setSelectedLoad(load);
    setShowBidSelectionModal(false);
    setShowBidAmountModal(true);
  };

  const handleBidComplete = () => {
    setShowBidAmountModal(false);
    setSelectedLoad(null);
    if (onBidPlaced) {
      onBidPlaced();
    }
  };

  const handleRepost = () => {
    if (onTruckUpdated) {
      onTruckUpdated();
    }
  };

  const handlePause = () => {
    if (onTruckUpdated) {
      onTruckUpdated();
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colour.background,
      borderRadius: 12,
      padding: 16,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    timeLeft: {
      backgroundColor: "#E6F7F5",
      color: colour.primaryColor,
      borderRadius: 12,
      height: normalize(28),
      padding: 5,
      paddingHorizontal: 10,
      fontSize: normalize(11),
      fontWeight: "600",
    },
    content: {
      marginVertical: 3,
      marginBottom: 10,
    },
    materialSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    materialSubSection: {
      flexDirection: "column",
    },
    materialImage: {
      width: 75,
      height: 75,
      marginRight: 10,
    },
    materialTypeStyles: {
      fontSize: normalize(16),
      fontWeight: "700",
      color: colour.inputLabel,
    },
    locations: {
      marginTop: 4,
      marginBottom: 4,
    },
    source: {
      color: colour.inputLabel,
      fontSize: normalize(14),
    },
    destination: {
      color: colour.inputLabel,
      fontSize: normalize(13),
    },
    tripDistance: {
      fontSize: normalize(11),
      color: "#888",
    },
    details: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 1,
    },
    detailItem: {
      alignItems: "center",
    },
    icon: {
      fontSize: 16,
    },
    detailText: {
      fontSize: normalize(12),
      marginTop: 4,
      color: colour.iconText,
    },

    tripTag: {
      position: "absolute",
      right: 0,
      top: 35,
      backgroundColor: colour.greyTag,
      padding: 5,
      borderRadius: 12,
      width: 100,
      alignItems: "center",
    },

    detailsSection: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    detailItem: {
      width: "33.3333%",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 2,
    },
    detailIcon: {
      fontSize: 16,
      marginRight: 5,
      width: 25,
    },
    priceSection: {
      width: "35%",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      position: "absolute",
      right: 0,
      bottom: 0,
    },
    price: {
      fontSize: normalize(18),
      fontWeight: "bold",
      color: colour.text,
    },
    advance: {
      fontSize: normalize(13),
      color: "#555",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    menuButton: {
      padding: 10,
      position: "absolute",
      top: normalize(-10),
      right: normalize(-10),
    },
    menu: {
      position: "absolute",
      top: 30,
      right: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 1,
    },
    timeLeft: {
      backgroundColor: "#E6F7F5",
      color: colour.primaryColor,
      borderRadius: normalize(12),
      padding: normalize(5),
      paddingHorizontal: normalize(10),
      fontSize: normalize(12),
      fontWeight: "600",
    },
    expiredTimeLeft: {
      backgroundColor: colour.expired,
      color: colour.expiredText,
      borderRadius: normalize(12),
      padding: normalize(5),
      paddingHorizontal: normalize(10),
      fontSize: normalize(12),
      fontWeight: "600",
    },
    menuItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    menuItemText: {
      fontSize: normalize(13),
      color: "#333",
    },
    primaryButton: {
      backgroundColor: colour.primaryColor,
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    vehicleNumber: {
      fontSize: 16,
      fontWeight: "700",
      color: colour.text,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
    },
    locationText: {
      fontSize: 13,
      color: colour.inputLabel,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#E5E5E5",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statText: {
      fontSize: 13,
      color: colour.iconText,
    },
    bidButton: {
      backgroundColor: colour.primaryColor,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      position: "absolute",
      top: 0,
      right: 0,
    },
    bidButtonText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "600",
    },
  });


  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text
          style={
            new Date(expiresAt) < new Date()
              ? styles.expiredTimeLeft
              : styles.timeLeft
          }>
          {getTimeLeft(expiresAt)}
        </Text>
        {truckOwner === user._id ? (
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => setShowInfoDrawer(true)}
          >
            <MaterialIcons
              name='more-vert'
              size={24}
              color={colour.iconColor}
            />
          </TouchableOpacity>
        ) : (
          <Pressable 
            style={styles.bidButton}
            onPress={handleBidButtonPress}
          >
            <Text style={styles.bidButtonText}>
              {isLoadingLoads ? "Loading..." : "Place Bid"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.materialSection}>
          <Image
            source={require("../assets/images/trucktype/hyva.png")}
            style={styles.materialImage}
          />
          <View style={styles.materialSubSection}>
            <Text style={styles.materialTypeStyles}>
              {truckType ? truckType : "NA"}
            </Text>
            <View style={styles.locations}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  justifyContent: "flex-start",
                }}>
                <FontAwesome6 name='location-dot' size={16} color='#A855F7' />
                <Text style={styles.source}>{limitText(truckLocation?.placeName, 25)}</Text>
              </View>
            </View>
            <Text style={styles.materialTypeStyles}>
              {truckNumber ? truckNumber : "NA"}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.row}>
        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='box' size={18} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{truckCapacity} Tonnes</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <Wheel width={22} height={22} fill={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{truckTyre} Wheels</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='box' size={18} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{formatText(truckPermit)}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#E5E5E5",
          marginVertical: 5,
          width: "100%",
        }}></View>
      <View style={styles.row}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>
            <Container width={22} height={22} fill={colour.iconColor} />
          </Text>
          <Text style={styles.detailText}>
            {vehicleBodyType === "OPEN_BODY" ? "Open Body" : "Closed Body"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>
            <MaterialIcons
              name='local-offer'
              size={22}
              color={colour.iconColor}
            />
          </Text>
          <Text style={styles.detailText}>{totalBids} Bids</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>
            <AntDesign name='eye' size={22} color={colour.iconColor} />
          </Text>
          <Text style={styles.detailText}>
            {isRCVerified ? "RC Verified" : "RC Pending"}
          </Text>
        </View>

        {/* Add more detail items as needed */}
      </View>

      {/* <View style={styles.locationContainer}>
        <FontAwesome6 name="location-dot" size={16} color="#24CAB6" />
        <Text style={styles.locationText}>
          {currentLocation?.placeName || "Location not available"}
        </Text>
      </View> */}


      <BidSelectionModal
        visible={showBidSelectionModal}
        onClose={() => setShowBidSelectionModal(false)}
        loads={userLoads}
        onLoadSelect={handleLoadSelect}
        loading={isLoadingLoads}
      />

      <BidAmountModal
        visible={showBidAmountModal}
        onClose={() => setShowBidAmountModal(false)}
        selectedLoad={selectedLoad}
        truckId={_id}
        onBidPlaced={handleBidComplete}
      />

      <TruckInfoDrawer
        visible={showInfoDrawer}
        onClose={() => setShowInfoDrawer(false)}
        data={data}
        onRepost={handleRepost}
        onPause={handlePause}
      />
    </View>
  );
}
