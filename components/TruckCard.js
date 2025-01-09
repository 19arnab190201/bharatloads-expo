import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthProvider";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";
import { getTimeLeft } from "../utils/functions";

export default function TruckCard({ data }) {
  const { colour } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    materialType,
    source,
    destination,
    weight = 0,
    offeredAmount,
    numberOfWheels,
    vehicleType,
    vehicleBodyType,
    bids,
    views = 100,
    expiresAt,
    tripDistance,
    advanceAmount,
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
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    timeLeft: {
      backgroundColor: "#E6F7F5",
      color: colour.primaryColor,
      borderRadius: 12,
      padding: 5,
      paddingHorizontal: 10,
      fontSize: 12,
      fontWeight: "600",
    },
    content: {
      marginVertical: 3,
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
      width: 60,
      height: 60,
      marginRight: 10,
    },
    materialTypeStyles: {
      fontSize: 18,
      fontWeight: "700",
      color: colour.inputLabel,
    },
    locations: {
      marginTop: 4,
      marginBottom: 4,
    },
    source: {
      color: colour.inputLabel,
      fontSize: 14,
    },
    destination: {
      color: colour.inputLabel,
      fontSize: 14,
    },
    tripDistance: {
      fontSize: 12,
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
      fontSize: 12,
      marginTop: 4,
      color: "#555",
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
      width: "65%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    detailItem: {
      width: "48%", // Ensure two items per row
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 2,
    },
    detailIcon: {
      fontSize: 18,
      marginRight: 10,
      width: 25,
    },
    detailText: {
      fontSize: 14,
      color: colour.iconText,
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
      fontSize: 20,
      fontWeight: "bold",
      color: colour.text,
    },
    advance: {
      fontSize: 14,
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
      fontSize: 14,
      color: "#333",
    },
  });

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.timeLeft}>{getTimeLeft(expiresAt)} Left</Text>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <MaterialIcons name="more-vert" size={24} color={colour.iconColor} />
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
            source={require("../assets/images/parcel.png")}
            style={styles.materialImage}
          />
          <View style={styles.materialSubSection}>
            <Text style={styles.materialTypeStyles}>
              {materialType ? materialType : "NA"}
            </Text>
            <View style={styles.locations}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 4,
                  justifyContent: "flex-start",
                  marginBottom: 4,
                }}>
                <FontAwesome6 name='location-dot' size={16} color='#24CAB6' />
                <Text style={styles.source}>{source?.placeName}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 4,
                  justifyContent: "flex-start",
                }}>
                <FontAwesome6 name='location-dot' size={16} color='#F43D74' />
                <Text style={styles.destination}>{destination?.placeName}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tripTag}>
          <Text style={styles.tripDistance}>{tripDistance} kms Trip</Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#E5E5E5",
          marginVertical: 5,
          width: "100%",
        }}></View>

      {/* Card Content */}
      <View style={styles.row}>
        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='truck' size={20} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{vehicleType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <Wheel width={25} height={25} fill={colour.iconColor} />
            </Text>

            <Text style={styles.detailText}>{numberOfWheels} Wheels</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='box' size={20} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{weight} Tonnes</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <Container width={25} height={25} fill={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{vehicleBodyType}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <AntDesign name='eye' size={24} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{views} Views</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <MaterialIcons
                name='local-offer'
                size={24}
                color={colour.iconColor}
              />
            </Text>
            <Text style={styles.detailText}>{bids?.length} Bids</Text>
          </View>
          {/* Add more detail items as needed */}
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{offeredAmount?.total}</Text>
          <Text style={styles.advance}>50% Advance</Text>
        </View>
      </View>
    </View>
  );
}
