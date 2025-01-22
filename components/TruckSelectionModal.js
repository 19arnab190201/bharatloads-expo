import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { normalize } from "../utils/functions";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const TruckSelectionModal = ({ 
  visible, 
  onClose, 
  trucks, 
  onSelect,
  loading 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Select Your Truck</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome6 name="xmark" size={normalize(20)} color="#666" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : trucks.length === 0 ? (
            <Text style={styles.noTrucksText}>No trucks available</Text>
          ) : (
            <ScrollView style={styles.truckList}>
              {trucks.map((truck) => (
                <TouchableOpacity
                  key={truck._id}
                  style={styles.truckItem}
                  onPress={() => onSelect(truck)}
                >
                  <View style={styles.truckInfo}>
                    <Text style={styles.truckNumber}>{truck.truckNumber}</Text>
                    <View style={styles.truckDetails}>
                      <Text style={styles.truckType}>
                        {truck.truckType} • {truck.vehicleBodyType}
                      </Text>
                      <Text style={styles.truckCapacity}>
                        {truck.truckCapacity} tons • {truck.truckTyre} wheels
                      </Text>
                    </View>
                  </View>
                  <FontAwesome6 name="chevron-right" size={normalize(16)} color="#666" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    paddingTop: normalize(20),
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(15),
  },
  modalTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: normalize(5),
  },
  loader: {
    padding: normalize(30),
  },
  noTrucksText: {
    textAlign: 'center',
    fontSize: normalize(16),
    color: '#666',
    padding: normalize(30),
  },
  truckList: {
    paddingHorizontal: normalize(20),
  },
  truckItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  truckInfo: {
    flex: 1,
  },
  truckNumber: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: normalize(4),
  },
  truckDetails: {
    gap: normalize(2),
  },
  truckType: {
    fontSize: normalize(14),
    color: '#666',
  },
  truckCapacity: {
    fontSize: normalize(14),
    color: '#666',
  },
});

export default TruckSelectionModal; 