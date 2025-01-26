import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useAuth } from "../context/AuthProvider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";

export default function BidSelectionCard({ data, onSelect, isSelected }) {
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
    tripDistance,
    views = 0,
    bids = [],
  } = data;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: isSelected ? "#E6F7F5" : colour.background,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      borderWidth: isSelected ? 2 : 2,
      borderColor: isSelected ? colour.primaryColor : "#d3d3d3",
    },
    materialSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      marginBottom: 12,
    },
    materialImage: {
      width: 60,
      height: 60,
      marginRight: 10,
      backgroundColor: "#F8FAFC",
      borderRadius: 8,
    },
    materialSubSection: {
      flexDirection: "column",
      flex: 1,
    },
    materialType: {
      fontSize: 18,
      fontWeight: "700",
      color: colour.inputLabel,
      marginBottom: 4,
    },
    locations: {
      marginVertical: 4,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    locationText: {
      fontSize: 14,
      color: colour.inputLabel,
    },
    tripTag: {
      position: "absolute",
      right: 0,
      top: 0,
      backgroundColor: colour.greyTag,
      padding: 5,
      borderRadius: 12,
      width: 100,
      alignItems: "center",
    },
    tripDistance: {
      fontSize: 12,
      color: "#888",
    },
    divider: {
      height: 1,
      backgroundColor: "#E5E5E5",
      marginVertical: 8,
      width: "100%",
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
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    priceSection: {
      width: "35%",
      alignItems: "flex-end",
      justifyContent: "flex-end",
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
    selectButton: {
      backgroundColor: isSelected ? colour.primaryColor : "#F5F5F5",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
    },
    selectButtonText: {
      color: isSelected ? "#fff" : colour.text,
      fontWeight: "600",
    },
  });

  return (
    <Pressable style={styles.card} onPress={() => onSelect(data)}>
      <View style={styles.materialSection}>
        <Image
          source={require("../assets/images/parcel.png")}
          style={styles.materialImage}
          resizeMode='contain'
        />
        <View style={styles.materialSubSection}>
          <Text style={styles.materialType}>{materialType}</Text>
          <View style={styles.locations}>
            <View style={styles.locationRow}>
              <FontAwesome6 name='location-dot' size={16} color='#24CAB6' />
              <Text style={styles.locationText}>{source.placeName}</Text>
            </View>
            <View style={styles.locationRow}>
              <FontAwesome6 name='location-dot' size={16} color='#F43D74' />
              <Text style={styles.locationText}>{destination.placeName}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tripTag}>
          <Text style={styles.tripDistance}>{tripDistance} kms Trip</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
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
            <Text style={styles.detailText}>{bids.length} Bids</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{offeredAmount.total}</Text>
          <Text style={styles.advance}>50% Advance</Text>
        </View>
      </View>

      <Pressable style={styles.selectButton} onPress={() => onSelect(data)}>
        <Text style={styles.selectButtonText}>
          {isSelected ? "Selected" : "Select Load"}
        </Text>
      </Pressable>
    </Pressable>
  );
}
