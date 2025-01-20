import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthProvider";
import BidSelectionCard from "./BidSelectionCard";
import { api } from "../utils/api";

export default function BidSelectionModal({ visible, onClose, loads, truckId }) {
  const { colour, token } = useAuth();
  const [selectedLoad, setSelectedLoad] = useState(null);

  const handleSelect = (load) => {
    setSelectedLoad(load);
  };

  const handleConfirmBid = async () => {
    if (!selectedLoad) {
      Alert.alert("Error", "Please select a load to bid on");
      return;
    }

    try {
      const response = await api.post(
        "/bid/truck",
        {
          loadId: selectedLoad._id,
          bidType: "TRUCK_REQUEST",
          truckId: truckId,
          offeredAmount: selectedLoad.offeredAmount.total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Bid placed successfully!");
      onClose();
    } catch (error) {
      console.error("Error placing bid:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to place bid"
      );
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    content: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: "80%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colour.text,
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 16,
      color: colour.text,
    },
    confirmButton: {
      backgroundColor: colour.primaryColor,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    confirmButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    disabledButton: {
      backgroundColor: "#ccc",
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Load to Bid</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView>
            {loads.map((load) => (
              <BidSelectionCard
                key={load._id}
                data={load}
                onSelect={handleSelect}
                isSelected={selectedLoad?._id === load._id}
              />
            ))}
          </ScrollView>

          <Pressable
            style={[
              styles.confirmButton,
              !selectedLoad && styles.disabledButton,
            ]}
            onPress={handleConfirmBid}
            disabled={!selectedLoad}
          >
            <Text style={styles.confirmButtonText}>
              Confirm Bid
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
} 