import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { useAuth } from "../context/AuthProvider";
import BidSelectionCard from "./BidSelectionCard";
import { api } from "../utils/api";

export default function BidSelectionModal({ visible, onClose, loads, truckId }) {
  const { colour, token } = useAuth();
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [biddedAmount, setBiddedAmount] = useState({
    total: "",
    advanceAmount: "50",
    dieselAmount: "",
  });

  const handleSelect = (load) => {
    setSelectedLoad(load);
    // Pre-fill the bidded amount with the offered amount for reference
    setBiddedAmount({
      total: load.offeredAmount.total.toString(),
      advanceAmount: load.offeredAmount.advanceAmount.toString(),
      dieselAmount: load.offeredAmount.dieselAmount.toString(),
    });
  };

  const validateAmount = () => {
    const total = parseFloat(biddedAmount.total);
    const advance = parseFloat(biddedAmount.advanceAmount);
    const diesel = parseFloat(biddedAmount.dieselAmount);

    if (isNaN(total) || total <= 0) {
      Alert.alert("Error", "Please enter a valid total amount");
      return false;
    }

    if (isNaN(advance) || advance < 0 || advance > 100) {
      Alert.alert("Error", "Advance percentage must be between 0 and 100");
      return false;
    }

    if (isNaN(diesel) || diesel < 0) {
      Alert.alert("Error", "Please enter a valid diesel amount");
      return false;
    }

    return true;
  };

  const handleConfirmBid = async () => {
    if (!selectedLoad) {
      Alert.alert("Error", "Please select a load to bid on");
      return;
    }

    if (!biddedAmount.total || !biddedAmount.advanceAmount || !biddedAmount.dieselAmount) {
      Alert.alert("Error", "Please fill in all amount fields");
      return;
    }

    if (!validateAmount()) {
      return;
    }

    try {
      const response = await api.post(
        "/bid/truck",
        {
          loadId: selectedLoad._id,
          bidType: "TRUCK_REQUEST",
          truckId: truckId,
          biddedAmount: {
            total: parseFloat(biddedAmount.total),
            advanceAmount: parseFloat(biddedAmount.advanceAmount),
            dieselAmount: parseFloat(biddedAmount.dieselAmount),
          },
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
    amountContainer: {
      marginTop: 20,
      backgroundColor: "#f5f5f5",
      padding: 16,
      borderRadius: 8,
    },
    amountLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colour.text,
      marginBottom: 8,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    inputLabel: {
      width: 120,
      fontSize: 14,
      color: colour.text,
    },
    input: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    offeredAmount: {
      fontSize: 14,
      color: "#666",
      marginTop: 4,
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

            {selectedLoad && (
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Your Bid Amount</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Total Amount (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={biddedAmount.total}
                    onChangeText={(text) => setBiddedAmount(prev => ({ ...prev, total: text }))}
                    keyboardType="numeric"
                    placeholder="Enter total amount"
                  />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Advance </Text>
                  <TextInput
                    style={styles.input}
                    value={biddedAmount.advanceAmount}
                    onChangeText={(text) => setBiddedAmount(prev => ({ ...prev, advanceAmount: text }))}
                    keyboardType="numeric"
                    placeholder="Enter advance percentage"
                  />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Diesel Amount (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={biddedAmount.dieselAmount}
                    onChangeText={(text) => setBiddedAmount(prev => ({ ...prev, dieselAmount: text }))}
                    keyboardType="numeric"
                    placeholder="Enter diesel amount"
                  />
                </View>
                <Text style={styles.offeredAmount}>
                  Original offered amount: ₹{selectedLoad.offeredAmount.total} 
                  (Advance: {selectedLoad.offeredAmount.advanceAmount} | 
                  Diesel: ₹{selectedLoad.offeredAmount.dieselAmount})
                </Text>
              </View>
            )}
          </ScrollView>

          <Pressable
            style={[
              styles.confirmButton,
              (!selectedLoad || !biddedAmount.total) && styles.disabledButton,
            ]}
            onPress={handleConfirmBid}
            disabled={!selectedLoad || !biddedAmount.total}
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