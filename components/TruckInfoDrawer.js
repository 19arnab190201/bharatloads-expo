import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthProvider";
import { api } from "../utils/api";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Container from "../assets/images/icons/Container";
import Wheel from "../assets/images/icons/Wheel";
import { formatText } from "../utils/functions";
import { useRouter } from "expo-router";
import { Buffer } from "buffer";

export default function TruckInfoDrawer({
  visible,
  onClose,
  data,
  onRepost,
  onPause,
  onDelete,
  type = "truck",
}) {
  const { colour, token } = useAuth();
  const router = useRouter();
  const isExpired = new Date(data?.expiresAt) < new Date();
  const [isLoading, setIsLoading] = useState(false);

  const handleRepost = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === "truck" ? "/truck/repost" : "/load/repost";
      const idField = type === "truck" ? "truckId" : "loadId";

      await api.post(
        endpoint,
        {
          [idField]: data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onRepost) onRepost();
      onClose();
    } catch (error) {
      console.error("Error reposting:", error);
      Alert.alert("Error", `Failed to repost ${type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === "truck" ? "/truck/pause" : "/load/pause";
      const idField = type === "truck" ? "truckId" : "loadId";

      await api.post(
        endpoint,
        {
          [idField]: data._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onPause) onPause();
      onClose();
    } catch (error) {
      console.error("Error pausing:", error);
      Alert.alert("Error", `Failed to pause ${type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === "truck" ? "/truck/delete" : "/load/delete";
      const idField = type === "truck" ? "truckId" : "loadId";

      await api.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          [idField]: data._id,
        },
      });

      if (onDelete) onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting:", error);
      Alert.alert("Error", `Failed to delete ${type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (type === "load") {
      const formData = {
        _id: data._id,
        source: {
          placeName: data.source.placeName,
          coordinates: {
            latitude: data.source.coordinates[1],
            longitude: data.source.coordinates[0],
          },
        },
        destination: {
          placeName: data.destination.placeName,
          coordinates: {
            latitude: data.destination.coordinates[1],
            longitude: data.destination.coordinates[0],
          },
        },
        quantity: data.weight.toString(),
        vehicleBodyType:
          data.vehicleBodyType === "OPEN_BODY" ? "open" : "closed",
        vehicleType: data.vehicleType.toLowerCase(),
        truckBodyType: data.vehicleBodyType === "OPEN_BODY" ? "open" : "closed",
        numTires: data.numberOfWheels,
        totalOfferedAmount: data.offeredAmount.total.toString(),
        advanceAmount:
          data.offeredAmount.advanceAmount?.toString() || "",
        advanceCash: data.offeredAmount.cashAmount?.toString() || "",
        advanceDiesel: data.offeredAmount.dieselAmount?.toString() || "",
        schedule: data.whenNeeded === "IMMEDIATE" ? "immediately" : "later",
        scheduleDate: data.scheduleDate || null,
        scheduleTime: data.scheduleTime || null,
        additionalNotes: data.additionalNotes || "",
        materialType: data.materialType || "",
      };

      console.log("Original data:", data);
      console.log("Formatted formData:", formData);

      try {
        // Use the correct navigation approach for Expo Router
        router.push({
          pathname: "/postLoad",
          params: {
            editMode: "true",
            loadData: JSON.stringify(formData),
          },
        });
        onClose();
      } catch (error) {
        console.error("Error during navigation:", error);
        Alert.alert("Error", "Failed to navigate to edit page");
      }
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
    detailsContainer: {
      marginBottom: 0,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    detailLabel: {
      fontSize: 14,
      color: colour.iconText,
      width: 120,
    },
    detailValue: {
      fontSize: 14,
      color: colour.text,
      flex: 1,
    },
    actionButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    },
    editButton: {
      backgroundColor: colour.primaryColor,
    },
    pauseButton: {
      backgroundColor: "#FFA500",
    },
    deleteButton: {
      backgroundColor: "#FF4444",
    },
    buttonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      marginTop: 20,
      paddingHorizontal: 10,
    },
    repostButton: {
      backgroundColor: colour.primaryColor,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
      opacity: isLoading ? 0.7 : 1,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    repostButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    divider: {
      height: 1,
      backgroundColor: "#E5E5E5",
      marginVertical: 10,
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
            <Text style={styles.title}>
              {type === "truck" ? "Truck Details" : "Load Details"}
            </Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView>
            <View style={styles.detailsContainer}>
              {type === "truck" ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Truck Number</Text>
                    <Text style={styles.detailValue}>{data?.truckNumber}</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Truck Type</Text>
                    <Text style={styles.detailValue}>{data?.truckType}</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>
                      {data?.truckLocation?.placeName}
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Capacity</Text>
                    <Text style={styles.detailValue}>
                      {data?.truckCapacity} Tonnes
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Body Type</Text>
                    <Text style={styles.detailValue}>
                      {data?.vehicleBodyType === "OPEN_BODY"
                        ? "Open Body"
                        : "Closed Body"}
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Wheels</Text>
                    <Text style={styles.detailValue}>
                      {data?.truckTyre} Wheels
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Permit Type</Text>
                    <Text style={styles.detailValue}>
                      {formatText(data?.truckPermit)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                </>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Material Type</Text>
                    <Text style={styles.detailValue}>{data?.materialType}</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Source</Text>
                    <Text style={styles.detailValue}>
                      {data?.source?.placeName}
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Destination</Text>
                    <Text style={styles.detailValue}>
                      {data?.destination?.placeName}
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>
                      {data?.weight} Tonnes
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vehicle Type</Text>
                    <Text style={styles.detailValue}>
                      {formatText(data?.vehicleType)}
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Body Type</Text>
                    <Text style={styles.detailValue}>
                      {formatText(data?.vehicleBodyType)}
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Wheels</Text>
                    <Text style={styles.detailValue}>
                      {data?.numberOfWheels} Wheels
                    </Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Amount</Text>
                    <Text style={styles.detailValue}>
                      ₹{data?.offeredAmount?.total}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                </>
              )}
            </View>

            <View style={styles.actionButtonsContainer}>
              <Pressable
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.pauseButton]}
                onPress={isExpired ? handleRepost : handlePause}
                disabled={isLoading}>
                <Text style={styles.buttonText}>
                  {isLoading ? "Loading..." : isExpired ? "Repost" : "Pause"}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handlePause}
                disabled={isLoading}>
                <Text style={styles.buttonText}>
                  {isLoading ? "Loading..." : "Delete"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
