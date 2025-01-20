import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAuth } from "../context/AuthProvider";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";
import { getTimeLeft } from "../utils/functions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 500;

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(Math.min(newSize, size * 1.2));
};

export default function TruckCard({ data }) {
  const { colour } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    truckType,
    isRCVerified,
    totalBids,
    truckPermit,
    truckLocation,
    truckTyre,
    vehicleBodyType,
    bids,
    truckCapacity,
    expiresAt,
    truckNumber,
  } = data;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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
      height: normalize(30),
      padding: 5,
      paddingHorizontal: 10,
      fontSize: normalize(12),
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
      width: 80,
      height: 80,
      marginRight: 10,
    },
    materialTypeStyles: {
      fontSize: normalize(18),
      fontWeight: "700",
      color: colour.inputLabel,
    },
    locations: {
      marginTop: 4,
      marginBottom: 4,
    },
    source: {
      color: colour.inputLabel,
      fontSize: normalize(16),
    },
    destination: {
      color: colour.inputLabel,
      fontSize: normalize(14),
    },
    tripDistance: {
      fontSize: normalize(12),
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
      fontSize: 18,
    },
    detailText: {
      fontSize: normalize(14),
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
      width: "33.3333%", // Ensure two items per row
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 2,
    },
    detailIcon: {
      fontSize: 18,
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
      fontSize: normalize(20),
      fontWeight: "bold",
      color: colour.text,
    },
    advance: {
      fontSize: normalize(14),
      color: "#555",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    menuButton: {
      padding: 10,
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
    menuItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    menuItemText: {
      fontSize: normalize(14),
      color: "#333",
    },
  });

  console.log("data", data);

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.timeLeft}>{getTimeLeft(expiresAt)} Left</Text>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <MaterialIcons name='more-vert' size={24} color={colour.iconColor} />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Pause</Text>
            </TouchableOpacity>
          </View>
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
                <Text style={styles.source}>{truckLocation?.placeName}</Text>
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
              <FontAwesome6 name='box' size={20} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{truckCapacity} Tonnes</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <Wheel width={25} height={25} fill={colour.iconColor} />
            </Text>

            <Text style={styles.detailText}>{truckTyre} Wheels</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='box' size={20} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{truckPermit}</Text>
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
            <Container width={25} height={25} fill={colour.iconColor} />
          </Text>
          <Text style={styles.detailText}>
            {vehicleBodyType === "OPEN_BODY" ? "Open Body" : "Closed Body"}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>
            <MaterialIcons
              name='local-offer'
              size={24}
              color={colour.iconColor}
            />
          </Text>
          <Text style={styles.detailText}>{totalBids} Bids</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>
            <AntDesign name='eye' size={24} color={colour.iconColor} />
          </Text>
          <Text style={styles.detailText}>
            {isRCVerified ? "RC Verified" : "RC Pending"}
          </Text>
        </View>

        {/* Add more detail items as needed */}
      </View>
    </View>
  );
}
