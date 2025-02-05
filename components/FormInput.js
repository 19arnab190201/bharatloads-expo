import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

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
  onChangeText,
  disabled = false,
  name,
  allowOnlyCaps = false,
  ...rest
}) => {
  const { colour } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (inputValue) => {
    const updatedValue =
      type === "number" ? parseFloat(inputValue) : inputValue;

    if (onChangeText) {
      onChangeText(updatedValue);
    } else {
      onChange({
        [name]: updatedValue,
      });
    }
  };

  const processImage = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      let imageBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // If image is larger than 1MB, compress it
      if (fileInfo.size > 1024 * 1024) {
        // Implement compression logic here if needed
        // For now, we'll just alert the user
        alert("Image size should be less than 1MB");
        return null;
      }

      return `data:image/jpeg;base64,${imageBase64}`;
    } catch (error) {
      console.error("Error processing image:", error);
      return null;
    }
  };

  const pickImage = async () => {
    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        const processedImage = await processImage(result.assets[0].uri);
        if (processedImage) {
          setImagePreview(result.assets[0].uri);
          onChange({
            [name]: processedImage,
          });
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error picking image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
      width: "100%",
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: "#333",
    },
    inputContainer: {
      position: "relative",
      minHeight: 48,
      display: "flex",
    },
    icon: {
      position: "absolute",
      zIndex: 1,
      left: 10,
      top: "50%",
      transform: [{ translateY: -12 }],
    },
    input: {
      borderRadius: 12,
      paddingLeft: 50,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: colour.inputBackground,
      height: 60,
    },
    pickerInput: {
      borderRadius: 12,
      paddingLeft: 60,
      paddingRight: 10,
      fontSize: 16,
      backgroundColor: colour.inputBackground,
      color: colour.iconColor,
    },
    textarea: {
      height: 80,
      textAlignVertical: "top",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 4,
    },
    imagePickerButton: {
      backgroundColor: colour.inputBackground,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      flexDirection: "row",
      gap: 10,
    },
    imagePreviewContainer: {
      marginTop: 8,
      borderRadius: 8,
      overflow: "hidden",
    },
    imagePreview: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {type === "select"
          ? Icon && <Icon style={styles.icon} />
          : Icon && <Icon style={styles.icon} />}

        {type === "text" || type === "number" ? (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType={type === "number" ? "numeric" : "default"}
            value={value}
            type={type}
            placeholderTextColor={colour.placeHolderText}
            maxLength={max}
            minLength={min}
            autoCapitalize={allowOnlyCaps ? "characters" : "none"}
            onChangeText={handleInputChange}
            {...rest}
          />
        ) : type === "select" ? (
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              overflow: "hidden",
              borderColor: colour.inputBackground,
              paddingLeft: 0,
            }}>
            <Picker
              style={{
                ...styles.pickerInput,
                ...(Icon && {
                  paddingLeft: 160,
                }),
              }}
              {...rest}
              enabled={!disabled}
              selectedValue={value}
              onValueChange={(itemValue) =>
                onChange({
                  [name]: itemValue,
                })
              }>
              <Picker.Item label='Select Option' value='0' />

              {options.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label || option}
                  value={option.value || option}
                />
              ))}
            </Picker>
          </View>
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
        ) : type === "file" ? (
          <View>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
              disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <ActivityIndicator size='small' color='#000' />
                  <Text>Processing...</Text>
                </>
              ) : (
                <Text>{imagePreview ? "Change Image" : placeholder}</Text>
              )}
            </TouchableOpacity>
            {imagePreview && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: imagePreview }}
                  style={styles.imagePreview}
                />
              </View>
            )}
          </View>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default FormInput;
