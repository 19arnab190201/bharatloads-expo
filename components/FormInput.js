import React from "react";
import { StyleSheet, View, Text, TextInput, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthProvider";

const FormInput = ({
  Icon,
  label,
  placeholder = "Enter text",
  type = "text",
  options = [],
  max = null,
  min = null,
  error = "",
  value,
  onChange,
  name,
  ...rest
}) => {
  const { colour } = useAuth();
  const handleInputChange = (inputValue) => {
    if (type === "number" && (inputValue < min || inputValue > max)) {
      return;
    }

    const updatedValue =
      type === "number" ? parseFloat(inputValue) : inputValue;

    onChange({
      [name]: updatedValue,
    });
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
      width: "100%",
    },
    label: {
      fontSize: 14,
      fontWeight: 700,
      marginBottom: 8,
      color: "#333",
    },
    inputContainer: {
      position: "relative",
    },
    icon: {
      position: "absolute",
      left: 10,
      top: 12,
    },
    input: {
      borderRadius: 12,
      paddingLeft: 40,
      fontSize: 16,
      backgroundColor: colour.inputBackground,
    },
    textarea: {
      height: 80,
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {Icon && <Icon style={styles.icon} />}

        {type === "text" || type === "number" ? (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType={type === "number" ? "numeric" : "default"}
            value={value}
            onChangeText={handleInputChange}
            {...rest}
          />
        ) : type === "select" ? (
          <Picker
            style={styles.input}
            {...rest}
            selectedValue={value}
            onValueChange={(itemValue) =>
              onChange({
                [name]: itemValue,
              })
            }>
            {options.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.label || option}
                value={option.value || option}
              />
            ))}
          </Picker>
        ) : type === "textarea" ? (
          <TextInput
            {...rest}
            style={[styles.input, styles.textarea]}
            placeholder={placeholder}
            multiline={true}
            numberOfLines={4}
            value={value}
            onChangeText={handleInputChange}
          />
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default FormInput;
