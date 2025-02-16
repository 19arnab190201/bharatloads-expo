import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { normalize } from "../utils/functions";
import { MaterialIcons } from "@expo/vector-icons";

const rejectionReasons = [
  {
    id: "PRICE_TOO_HIGH",
    label: "Price Too High",
    icon: "attach-money",
  },
  {
    id: "TRUCK_NOT_SUITABLE",
    label: "Truck Not Suitable",
    icon: "local-shipping",
  },
  {
    id: "SCHEDULE_CONFLICT",
    label: "Schedule Conflict",
    icon: "schedule",
  },
  {
    id: "ROUTE_NOT_PREFERRED",
    label: "Route Not Preferred",
    icon: "route",
  },
  {
    id: "MATERIAL_HANDLING_ISSUE",
    label: "Material Handling Issue",
    icon: "inventory",
  },
  {
    id: "DOCUMENTATION_INCOMPLETE",
    label: "Documentation Incomplete",
    icon: "description",
  },
  {
    id: "OTHER",
    label: "Other Reason",
    icon: "more-horiz",
  },
];

const RejectionDrawer = ({ isVisible, onClose, onSubmit, colour }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    console.log("selectedReason");
    if (!selectedReason) {
      Alert.alert("Error", "Please select a reason for rejection");
      return;
    }
    onSubmit({ rejectionReason: selectedReason, rejectionNote: note });
  };

  if (!isVisible) return null;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Rejection Reason</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name='close' size={24} color='#64748B' />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {rejectionReasons.map((reason) => (
            <Pressable
              key={reason.id}
              style={[
                styles.reasonItem,
                selectedReason === reason.id && {
                  backgroundColor: `${colour.primaryColor}10`,
                  borderColor: colour.primaryColor,
                },
              ]}
              onPress={() => setSelectedReason(reason.id)}>
              <MaterialIcons
                name={reason.icon}
                size={24}
                color={
                  selectedReason === reason.id ? colour.primaryColor : "#64748B"
                }
              />
              <Text
                style={[
                  styles.reasonText,
                  selectedReason === reason.id && {
                    color: colour.primaryColor,
                  },
                ]}>
                {reason.label}
              </Text>
            </Pressable>
          ))}

          <TextInput
            style={styles.noteInput}
            placeholder='Additional notes (optional)'
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.button, { backgroundColor: colour.primaryColor }]}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    paddingTop: normalize(16),
    maxHeight: "80%",
    zIndex: 1000,
    elevation: 5, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#1E293B",
  },
  content: {
    padding: normalize(16),
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: normalize(12),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: normalize(8),
    marginBottom: normalize(8),
  },
  reasonText: {
    marginLeft: normalize(12),
    fontSize: normalize(16),
    color: "#1E293B",
  },
  noteInput: {
    marginTop: normalize(16),
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: normalize(8),
    padding: normalize(12),
    height: normalize(100),
    textAlignVertical: "top",
  },
  footer: {
    padding: normalize(16),
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  button: {
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "600",
  },
});

export default RejectionDrawer;
