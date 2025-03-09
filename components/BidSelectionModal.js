import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthProvider";
import BidSelectionCard from "./BidSelectionCard";
import { normalize } from "../utils/functions";
import { router } from "expo-router";

export default function BidSelectionModal({
  visible,
  onClose,
  loads,
  onLoadSelect,
  loading,
}) {
  const { colour } = useAuth();
  const [selectedLoad, setSelectedLoad] = useState(null);

  const handleSelect = (load) => {
    setSelectedLoad(load);
  };

  const handleNext = () => {
    if (selectedLoad) {
      onLoadSelect(selectedLoad);
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
    nextButton: {
      backgroundColor: colour.primaryColor,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
      opacity: selectedLoad ? 1 : 0.5,
    },
    nextButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    loadingContainer: {
      padding: 20,
      alignItems: "center",
    },
    noLoadsText: {
      textAlign: "center",
      fontSize: 16,
      color: "#666",
      padding: 20,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Load to Bid</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={colour.primaryColor} />
            </View>
          ) : loads.length === 0 ? (
            <Text style={styles.noLoadsText}>No loads available</Text>
          ) : (
            <ScrollView>
              {loads.map((load) => (
                <BidSelectionCard
                  key={load._id}
                  data={load}
                  onSelect={handleSelect}
                  isSelected={selectedLoad?._id === load._id}
                />
              ))}
              <Pressable
                key={"NEW_TRUCK_ID"}
                style={{ ...styles.truckItem, paddingVertical: 20 }}
                onPress={() => {
                  router.push("(app)/(transporter)/postLoad");
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: colour.primaryColor,
                  }}>
                  <Text
                    style={{
                      fontWeight: 600,
                      color: colour.primaryColor,
                    }}>
                    Add Load
                  </Text>
                </View>
              </Pressable>
            </ScrollView>
          )}

          <Pressable
            style={styles.nextButton}
            onPress={handleNext}
            disabled={!selectedLoad}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
