import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";
import { normalize, formatText, limitText,calculateDistance, getTimeLeft, formatMoneytext } from "../utils/functions";
import { useAuth } from "../context/AuthProvider";


const SearchLoadCard = ({ data, onBidPress }) => {
  const { colour } = useAuth();
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: normalize(12),
      padding: normalize(16),
      marginVertical: normalize(10),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: normalize(2) },
      shadowOpacity: 0.1,
      shadowRadius: normalize(4),
      elevation: normalize(4),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeLeft: {
      backgroundColor: '#E6F7F5',
      color: '#24CAB6',
      borderRadius: normalize(12),
      padding: normalize(5),
      paddingHorizontal: normalize(10),
      fontSize: normalize(12),
      fontWeight: '600',
    },
    content: {
      marginVertical: normalize(3),
    },
    materialSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: normalize(20),
    },
    materialSubSection: {
      flexDirection: 'column',
    },
    materialImage: {
      width: normalize(60),
      height: normalize(60),
      marginRight: normalize(10),
    },
    materialTypeStyles: {
      fontSize: normalize(18),
      fontWeight: '700',
      color: '#333',
    },
    locations: {
      marginTop: normalize(4),
      marginBottom: normalize(4),
    },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: normalize(4),
      justifyContent: 'flex-start',
      marginBottom: normalize(4),
    },
    source: {
      color: '#333',
      fontSize: normalize(14),
    },
    destination: {
      color: '#333',
      fontSize: normalize(14),
    },
    tripTag: {
      position: 'absolute',
      right: 0,
      top: normalize(35),
      backgroundColor: '#F5F5F5',
      padding: normalize(5),
      paddingHorizontal: normalize(10),
      borderRadius: normalize(12),
      alignItems: 'center',
      width: 'fit-content',
    },
    tripDistance: {
      fontSize: normalize(12),
      color: '#888',
    },
    divider: {
      height: normalize(1),
      backgroundColor: '#E5E5E5',
      marginVertical: normalize(5),
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    detailsSection: {
      width: '65%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    detailItem: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: normalize(2),
    },
    detailIcon: {
      fontSize: normalize(18),
      marginRight: normalize(10),
      width: normalize(25),
    },
    detailText: {
      fontSize: normalize(14),
      color: '#666',
    },
    priceSection: {
      width: '35%',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    price: {
      fontSize: normalize(20),
      fontWeight: 'bold',
      color: '#333',
    },
    advance: {
      fontSize: normalize(14),
      color: '#555',
      marginBottom: normalize(8),
    },
    bidButton: {
      backgroundColor: '#007AFF',
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: colour.primaryColor,
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(8),
      borderRadius: normalize(8),
    },
    bidButtonText: {
      color: '#fff',
      fontSize: normalize(14),
      fontWeight: '600',
    },
  });
  const {
    materialType,
    source,
    destination,
    weight,
    offeredAmount,
    vehicleType,
    vehicleBodyType,
    expiresAt,
    tripDistance,
    numberOfWheels,
  } = data;

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <Text style={styles.timeLeft}>{getTimeLeft(expiresAt)}</Text>
        <TouchableOpacity style={styles.bidButton} onPress={onBidPress}>
            <Text style={styles.bidButtonText}>Place Bid</Text>
          </TouchableOpacity>
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
              <View style={styles.locationItem}>
                <FontAwesome6 name='location-dot' size={normalize(16)} color='#24CAB6' />
                <Text style={styles.source}>{limitText(source.placeName, 20)}</Text>
              </View>
              <View style={styles.locationItem}>
                <FontAwesome6 name='location-dot' size={normalize(16)} color='#F43D74' />
                <Text style={styles.destination}>{limitText(destination.placeName, 20)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tripTag}>
          <Text style={styles.tripDistance}>{calculateDistance(source.coordinates[1], source.coordinates[0], destination.coordinates[1], destination.coordinates[0]) + " KMs"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

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
              <Wheel width={normalize(25)} height={normalize(25)} color={colour.iconColor} />
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
              <Container width={normalize(25)} height={normalize(25)} color={colour.iconColor} />
            </Text>
            <Text style={styles.detailText}>{formatText(vehicleBodyType)}</Text>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>₹{formatMoneytext(offeredAmount.total)}</Text>
          <Text style={styles.advance}>
           formatMoneytext({offeredAmount.advanceAmount})  Advance
          </Text>
        </View>
      </View>
    </View>
  );
};



export default SearchLoadCard; 