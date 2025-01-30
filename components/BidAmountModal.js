import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthProvider";
import { normalize } from "../utils/functions";
import { api } from "../utils/api";

export default function BidAmountModal({ 
  visible, 
  onClose, 
  selectedLoad,
  truckId,
  onBidPlaced 
}) {
  const { colour, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biddedAmount, setBiddedAmount] = useState({
    total: selectedLoad?.offeredAmount.total.toString() || "",
    advanceAmount: selectedLoad?.offeredAmount.advanceAmount.toString() || "50",
    dieselAmount: selectedLoad?.offeredAmount.dieselAmount.toString() || "",
  });

  const validateAmount = () => {
    const total = parseFloat(biddedAmount.total);
    const advance = parseFloat(biddedAmount.advanceAmount);
    const diesel = parseFloat(biddedAmount.dieselAmount);

    if (isNaN(total) || total <= 0) {
      Alert.alert("Error", "Please enter a valid total amount");
      return false;
    }

    if (isNaN(advance) || advance < 0) {
      Alert.alert("Error", "Advance cannot be negative");
      return false;
    }

    if (isNaN(diesel) || diesel < 0) {
      Alert.alert("Error", "Please enter a valid diesel amount");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAmount()) return;

    try {
      setIsSubmitting(true);
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
      onBidPlaced();
    } catch (error) {
      console.error("Error placing bid:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to place bid"
      );
    } finally {
      setIsSubmitting(false);
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
      backgroundColor: "#f5f5f5",
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
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
    submitButton: {
      backgroundColor: colour.primaryColor,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      opacity: isSubmitting ? 0.7 : 1,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
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
            <Text style={styles.title}>Place Your Bid</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

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
                editable={!isSubmitting}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Advance </Text>
              <TextInput
                style={styles.input}
                value={biddedAmount.advanceAmount}
                onChangeText={(text) => setBiddedAmount(prev => ({ ...prev, advanceAmount: text }))}
                keyboardType="numeric"
                placeholder="Enter advance "
                editable={!isSubmitting}
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
                editable={!isSubmitting}
              />
            </View>
            <Text style={styles.offeredAmount}>
              Original offered amount: ₹{selectedLoad?.offeredAmount.total}
              {"\n"}(Advance: {selectedLoad?.offeredAmount.advanceAmount} | 
              Diesel: ₹{selectedLoad?.offeredAmount.dieselAmount})
            </Text>
          </View>

          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Placing Bid..." : "Place Bid"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
} 