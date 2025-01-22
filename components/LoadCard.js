import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthProvider";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";
import { formatText, getTimeLeft } from "../utils/functions";
import { normalize } from "../utils/functions";

export default function LoadCard({ data }) {
  const { colour } = useAuth();
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
  } = data;

  const advanceAmount = offeredAmount.advancePercentage; // value in money not percentage
  const advancePercentage =
    100 - ((offeredAmount.total - advanceAmount) / offeredAmount.total) * 100;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colour.background,
      borderRadius: normalize(12),
      padding: normalize(16),
      marginVertical: normalize(10),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: normalize(2) },
      shadowOpacity: 0.1,
      shadowRadius: normalize(4),
      elevation: normalize(4),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    content: {
      marginVertical: normalize(3),
    },
    materialSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(20),
    },
    materialSubSection: {
      flexDirection: "column",
    },
    materialImage: {
      width: normalize(60),
      height: normalize(60),
      marginRight: normalize(10),
    },
    materialTypeStyles: {
      fontSize: normalize(18),
      fontWeight: "700",
      color: colour.inputLabel,
    },
    locations: {
      marginTop: normalize(4),
      marginBottom: normalize(4),
    },
    source: {
      color: colour.inputLabel,
      fontSize: normalize(14),
    },
    destination: {
      color: colour.inputLabel,
      fontSize: normalize(14),
    },
    tripDistance: {
      fontSize: normalize(12),
      color: "#888",
    },
    tripTag: {
      position: "absolute",
      right: 0,
      top: normalize(35),
      backgroundColor: colour.greyTag,
      padding: normalize(5),
      borderRadius: normalize(12),
      width: normalize(100),
      alignItems: "center",
    },
    detailsSection: {
      width: "65%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    detailItem: {
      width: "48%",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: normalize(2),
    },
    detailIcon: {
      fontSize: normalize(18),
      marginRight: normalize(10),
      width: normalize(25),
    },
    detailText: {
      fontSize: normalize(14),
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
                  gap: normalize(4),
                  justifyContent: "flex-start",
                  marginBottom: normalize(4),
                }}>
                <FontAwesome6 name='location-dot' size={normalize(16)} color='#24CAB6' />
                <Text style={styles.source}>{source.placeName}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: normalize(4),
                  justifyContent: "flex-start",
                }}>
                <FontAwesome6 name='location-dot' size={normalize(16)} color='#F43D74' />
                <Text style={styles.destination}>{destination.placeName}</Text>
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
          height: normalize(1),
          backgroundColor: "#E5E5E5",
          marginVertical: normalize(5),
          width: "100%",
        }}></View>

      {/* Card Content */}
      <View style={styles.row}>
        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='truck' size={normalize(20)} color={colour.iconColor} />
            </Text>

            <Text style={styles.detailText}>{formatText(vehicleType)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <Wheel width={normalize(25)} height={normalize(25)} fill={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{numberOfWheels} Wheels</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <FontAwesome6 name='box' size={normalize(20)} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{weight} Tonnes</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <Container width={normalize(25)} height={normalize(25)} fill={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{formatText(vehicleBodyType)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <AntDesign name='eye' size={normalize(24)} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{views} Views</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>
              <MaterialIcons
                name='local-offer'
                size={normalize(24)}
                color={colour.iconColor}
              />
            </Text>
            <Text style={styles.detailText}>{bids?.length} Bids</Text>
          </View>
        </View>

        {/* Price Section */}
        {console.log("Advance Amount: ", offeredAmount)}
        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{offeredAmount.total}</Text>
          <Text style={styles.advance}>
            ₹{advanceAmount} ({Math.round(advancePercentage)}%)
          </Text>
          <Text style={styles.advance}>Advance</Text>
        </View>
      </View>
    </View>
  );
}
