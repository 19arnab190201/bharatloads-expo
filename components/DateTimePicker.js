import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { normalize } from "../utils/functions";
import { useAuth } from "../context/AuthProvider";

export default function CustomDateTimePicker({
  value,
  onChange,

  mode = "date",
  label,
  placeholder,
  minimumDate,
  Icon,
}) {
  const { colour } = useAuth();
  const [show, setShow] = useState(false);

  const onDateChange = (event, selectedValue) => {
    setShow(Platform.OS === "ios");
    if (event.type === "dismissed") {
      return;
    }
    if (selectedValue) {
      if (mode === "date") {
        onChange({ scheduleDate: selectedValue.toISOString().split("T")[0] });
      } else {
        const hours = selectedValue.getHours().toString().padStart(2, "0");
        const minutes = selectedValue.getMinutes().toString().padStart(2, "0");
        onChange({ scheduleTime: `${hours}:${minutes}` });
      }
    }
  };

  const displayValue = () => {
    if (!value) return placeholder;
    if (mode === "date") {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: normalize(15),
    },
    label: {
      fontSize: normalize(14),
      fontWeight: "bold",
      marginBottom: normalize(10),
      color: "#333",
    },
    input: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colour.inputBackground,
      borderRadius: normalize(8),
      padding: normalize(12),
      paddingVertical: normalize(20),
    },
    iconContainer: {
      marginRight: normalize(10),
    },
    inputText: {
      fontSize: normalize(14),
      color: "#333",
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={20} height={20} />
          </View>
        )}
        <Text style={styles.inputText}>{displayValue()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={
            value
              ? new Date(mode === "date" ? value : `2000-01-01T${value}`)
              : new Date()
          }
          mode={mode}
          is24Hour={true}
          display='default'
          onChange={onDateChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
