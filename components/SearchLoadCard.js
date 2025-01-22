import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { normalize } from "../utils/functions";
import { getTimeLeft } from "../utils/functions";

const SearchLoadCard = ({ data, onBidPress }) => {
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
  } = data;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.materialTypeContainer}>
          <FontAwesome6 name="box" size={normalize(16)} color="#666" />
          <Text style={styles.materialType}>{materialType}</Text>
        </View>
        <View style={styles.distanceTag}>
          <Text style={styles.distanceText}>{tripDistance} km</Text>
        </View>
      </View>

      <View style={styles.locations}>
        <View style={styles.locationItem}>
          <FontAwesome6 name="location-dot" size={normalize(16)} color="#24CAB6" />
          <Text style={styles.locationText}>{source.placeName}</Text>
        </View>
        <View style={styles.locationItem}>
          <FontAwesome6 name="location-dot" size={normalize(16)} color="#F43D74" />
          <Text style={styles.locationText}>{destination.placeName}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Vehicle Type</Text>
            <Text style={styles.value}>{vehicleType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Body Type</Text>
            <Text style={styles.value}>{vehicleBodyType}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>{weight} tons</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Expires In</Text>
            <Text style={styles.value}>{getTimeLeft(expiresAt)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Offered Price</Text>
          <Text style={styles.price}>₹{offeredAmount.total}</Text>
          <Text style={styles.advanceText}>
            ₹{offeredAmount.advancePercentage}% Advance
          </Text>
        </View>
        <TouchableOpacity style={styles.bidButton} onPress={onBidPress}>
          <Text style={styles.bidButtonText}>Place Bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginVertical: normalize(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  materialTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
  },
  materialType: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#333',
  },
  distanceTag: {
    backgroundColor: '#E8F3FF',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
  },
  distanceText: {
    color: '#007AFF',
    fontSize: normalize(12),
    fontWeight: '500',
  },
  locations: {
    gap: normalize(8),
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
  },
  locationText: {
    fontSize: normalize(14),
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: normalize(12),
  },
  detailsContainer: {
    gap: normalize(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontSize: normalize(12),
    color: '#666',
    marginBottom: normalize(4),
  },
  value: {
    fontSize: normalize(14),
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(12),
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: normalize(12),
    color: '#666',
  },
  price: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#007AFF',
  },
  advanceText: {
    fontSize: normalize(12),
    color: '#666',
  },
  bidButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
    marginLeft: normalize(16),
  },
  bidButtonText: {
    color: '#fff',
    fontSize: normalize(14),
    fontWeight: '600',
  },
});

export default SearchLoadCard; 