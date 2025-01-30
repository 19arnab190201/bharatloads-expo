import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { materialTypes } from "../../../constants/data";
import { Buffer } from "buffer";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Edit from "../../../assets/images/icons/Edit";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import FormMainButton from "../../../components/FormMainButton";
import PickAndDrop from "../pickAndDrop";
import Boxskeleton from "../../../assets/images/icons/Boxskeleton";
import { api } from "../../../utils/api";
import SwipeButton from "./components/SwipeButton";
import { KeyboardAvoidingView } from "react-native";
import { debounce } from "lodash";
import { normalize } from "../../../utils/functions";
import { useLocalSearchParams, useRouter } from "expo-router";
import Popup from "../../../components/Popup";
import DetailLocationIcon from "../../../assets/images/icons/DetailLocationIcon";
import WeightIcon from "../../../assets/images/icons/WeightIcon";

const FormStepHeader = ({ totalSteps = 3, currentStep = 1, setSteps }) => {
  const { colour } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    stepContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    circle: (isActive) => ({
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: isActive ? colour.stepIndicator : "transparent",
      borderWidth: 1,
      borderColor: isActive ? colour.stepIndicator : colour.secondaryColor,
      justifyContent: "center",
      alignItems: "center",
    }),
    circleText: (isActive) => ({
      color: isActive ? "#fff" : colour.secondaryColor,
      fontSize: 14,
      fontWeight: "bold",
    }),
    line: {
      height: 1,
      width: 10,
      marginHorizontal: 10,
      backgroundColor: colour.secondaryColor,
    },
    activeLine: {
      backgroundColor: colour.stepIndicator,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepIndex = index + 1;
        const isActive = stepIndex <= currentStep;
        return (
          <React.Fragment key={stepIndex}>
            <Pressable
              onPress={() => {
                setSteps(stepIndex);
              }}>
              <View style={styles.stepContainer}>
                <View style={styles.circle(isActive)}>
                  <Text style={styles.circleText(isActive)}>{stepIndex}</Text>
                </View>
              </View>
            </Pressable>
            {stepIndex < totalSteps && (
              <View
                style={[
                  styles.line,
                  stepIndex < currentStep && styles.activeLine,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tagButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 50,
    marginRight: 10,
  },
  tagButtonSelected: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#E7FBF8",
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#24cab6",
  },
  tagButtonText: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: "#000",
  },
  tagButtonTextUnselected: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: "#000",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  dropdownSubText: {
    fontSize: 14,
    color: "#999",
  },
});

const StepOne = ({ formState, setFormState }) => {
  const [locations, setLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null); // 'loading' or 'dropping'

  // Debounced function for location search
  const debouncedLocationSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setLocations([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/locationsearch?query=${query}`);
        setLocations(response.data.data);
        setShowLocationDropdown(true);
      } catch (error) {
        console.error("Location search error:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Handle location selection
  const handleLocationSelect = (location) => {
    setFormState((prev) => ({
      ...prev,
      [activeInput === "loading" ? "source" : "destination"]: {
        placeName: location.name,
        coordinates: {
          latitude: location.coordinates.lat,
          longitude: location.coordinates.lng,
        },
      },
    }));
    setShowLocationDropdown(false);
    setActiveInput(null);
  };

  const handleLocationChange = (text, type) => {
    setActiveInput(type);
    setFormState((prev) => ({
      ...prev,
      [type === "loading" ? "source" : "destination"]: {
        ...prev[type === "loading" ? "source" : "destination"],
        placeName: text,
        coordinates: null,
      },
    }));
    debouncedLocationSearch(text);
  };

  const handleUnitChange = (unit) => {
    setFormState((prev) => ({ ...prev, unit }));
  };

  return (
    <View>
      <View style={{ position: "relative", zIndex: 1000 }}>
        <FormInput
          Icon={LoadingPoint}
          label='Loading Point'
          placeholder='Search Loading Point'
          name='loadingPoint'
          value={formState.source.placeName}
          onChangeText={(text) => handleLocationChange(text, "loading")}
          onFocus={() => {
            setActiveInput("loading");
            setShowLocationDropdown(true);
          }}
        />

        <FormInput
          Icon={LoadingPoint}
          label='Dropping Point'
          placeholder='Search Dropping Point'
          name='droppingPoint'
          value={formState.destination.placeName}
          onChangeText={(text) => handleLocationChange(text, "dropping")}
          onFocus={() => {
            setActiveInput("dropping");
            setShowLocationDropdown(true);
          }}
        />

        {/* Location suggestions dropdown */}
        {showLocationDropdown && locations.length > 0 && (
          <View style={styles.dropdownContainer}>
            {locations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLocationSelect(location);
                }}>
                <Text numberOfLines={1} style={styles.dropdownText}>
                  {location.name}
                </Text>
                <Text numberOfLines={2} style={styles.dropdownSubText}>
                  {location.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FormInput
        label='Material Type'
        placeholder='Enter Material Type'
        name='materialType'
        value={formState.materialType}
        type='select'
        disabled={showLocationDropdown}
        onChange={(field) => setFormState((prev) => ({ ...prev, ...field }))}
        options={materialTypes.map((material) => ({
          label: material,
          value: material,
        }))}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <FormInput
            Icon={LoadingPoint}
            label='Quantity'
            placeholder='Qty'
            name='quantity'
            value={formState.quantity}
            onChange={(field) => {
              setFormState((prev) => ({
                ...prev,
                quantity: field.quantity,
              }));
            }}
            type='number'
            min={1}
            max={1000}
          />
        </View>

        <Pressable
          style={
            formState.unit === "tonnes"
              ? styles.tagButtonSelected
              : styles.tagButton
          }
          onPress={() => handleUnitChange("tonnes")}>
          <Text
            style={
              formState.unit === "tonnes"
                ? styles.tagButtonText
                : styles.tagButtonTextUnselected
            }>
            Tonne(s)
          </Text>
        </Pressable>
        <Pressable
          style={
            formState.unit === "kilograms"
              ? styles.tagButtonSelected
              : styles.tagButton
          }
          onPress={() => handleUnitChange("kilograms")}>
          <Text
            style={
              formState.unit === "kilograms"
                ? styles.tagButtonText
                : styles.tagButtonTextUnselected
            }>
            Kilogram(s)
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const StepTwo = ({ formState, setFormState, setStep }) => {
  const { colour } = useAuth();
  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  const vehicleTypes = [
    {
      id: "trailer",
      label: "TRAILER",
      icon: require("../../../assets/images/trucktype/trailer.png"),
    },
    {
      id: "hyva",
      label: "HYVA",
      icon: require("../../../assets/images/trucktype/hyva.png"),
    },
    {
      id: "truck",
      label: "TRUCK",
      icon: require("../../../assets/images/trucktype/truck.png"),
    },
  ];

  const truckTyres = [10, 12, 14, 16, 18];

  const stepTwoStyles = StyleSheet.create({
    detailsCard: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
      marginBottom: 20,
      backgroundColor: "#F5FCFB",
    },
    vehicleTypeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 15,
      gap: 10,
    },
    vehicleTypeCard: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: colour.inputBackground,
      borderRadius: 12,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    vehicleTypeCardSelected: {
      borderColor: "#14B8A6",
    },
    vehicleTypeImage: {
      width: 50,
      height: 50,
      marginBottom: 8,
      resizeMode: "contain",
    },
    vehicleTypeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#333",
      textAlign: "center",
    },
    tyreContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
    },
    tyreButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: colour.inputBackground,
    },
    tyreButtonSelected: {
      backgroundColor: "#14B8A6",
    },
    tyreText: {
      fontSize: 16,
      color: "#333",
    },
    tyreTextSelected: {
      color: "#fff",
    },
    boxSkeletonContainer: {
      position: "absolute",
      right: 0,
      top: 10,
      opacity: 0.5,
      height: normalize(140),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View>
      <View style={stepTwoStyles.detailsCard}>
        <Pressable
          onPress={() => setStep(1)}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 35,
            height: 35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            backgroundColor: colour.primaryColor,
          }}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Edit
              style={{ width: 28, height: 28, marginTop: 12, marginLeft: 12 }}
            />
          </View>
        </Pressable>
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 10,
            opacity: 0.5,
            height: normalize(140),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Boxskeleton style={{ borderWidth: 1, borderColor: "#FE7F4A" }} />
        </View>

        <Text
          style={{
            fontSize: 22,
            marginBottom: 10,
            fontWeight: "500",
          }}>
          Load Details
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <DetailLocationIcon fill='#FE7F4A' />
          <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "400" }}>
            {formState.source.placeName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <DetailLocationIcon />
          <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "400" }}>
            {formState.destination.placeName}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <WeightIcon />
          <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "400" }}>
            {formState.materialType} • {formState.quantity} {formState.unit}
          </Text>
        </View>
      </View>

      <FormInput
        label='Vehicle Body Type'
        placeholder='Select Vehicle Body Type'
        name='vehicleBodyType'
        value={formState.vehicleBodyType}
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "Open", value: "open" },
          { label: "Closed", value: "closed" },
          { label: "Container", value: "container" },
        ]}
      />

      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 10,
          color: "#333",
        }}>
        Vehicle Type
      </Text>
      <View style={stepTwoStyles.vehicleTypeContainer}>
        {vehicleTypes.map((type) => (
          <Pressable
            key={type.id}
            style={[
              stepTwoStyles.vehicleTypeCard,
              formState.vehicleType === type.id &&
                stepTwoStyles.vehicleTypeCardSelected,
            ]}
            onPress={() => handleFormChange({ vehicleType: type.id })}>
            <Image source={type.icon} style={stepTwoStyles.vehicleTypeImage} />
            <Text style={stepTwoStyles.vehicleTypeLabel}>{type.label}</Text>
          </Pressable>
        ))}
      </View>

      <FormInput
        label='Truck Body Type'
        placeholder='Select Truck Body Type'
        name='truckBodyType'
        value={formState.truckBodyType}
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "Full Body", value: "full" },
          { label: "Half Body", value: "half" },
        ]}
      />

      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginVertical: 10,
          color: "#333",
        }}>
        Truck Tyre
      </Text>
      <View style={stepTwoStyles.tyreContainer}>
        {truckTyres.map((tyre) => (
          <Pressable
            key={tyre}
            style={[
              stepTwoStyles.tyreButton,
              formState.numTires === tyre && stepTwoStyles.tyreButtonSelected,
            ]}
            onPress={() => handleFormChange({ numTires: tyre })}>
            <Text
              style={[
                stepTwoStyles.tyreText,
                formState.numTires === tyre && stepTwoStyles.tyreTextSelected,
              ]}>
              {tyre}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const StepThree = ({
  formState,
  setFormState,
  validateStep,
  isEditMode,
  loadData,
  setStep,
}) => {
  const { colour, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!formState.source.coordinates || !formState.destination.coordinates) {
        setPopup({
          visible: true,
          title: "Invalid Locations",
          message: "Please select valid locations from the dropdown",
          type: "error",
        });
        return;
      }

      const payload = {
        materialType: formState.materialType.toUpperCase(),
        weight:
          formState.unit === "tonnes"
            ? Number(formState.quantity)
            : Number(Math.round(formState.quantity / 1000)),
        source: {
          placeName: formState.source.placeName,
          coordinates: [
            formState.source.coordinates.longitude,
            formState.source.coordinates.latitude,
          ],
        },
        destination: {
          placeName: formState.destination.placeName,
          coordinates: [
            formState.destination.coordinates.longitude,
            formState.destination.coordinates.latitude,
          ],
        },
        vehicleType: formState.vehicleType.toUpperCase(),
        vehicleBodyType:
          formState.vehicleBodyType === "open" ? "OPEN_BODY" : "CLOSED_BODY",
        numberOfWheels: Number(formState.numTires),
        offeredAmount: {
          total: Number(formState.totalOfferedAmount),
          advanceAmount: Number(formState.advanceAmount),
          dieselAmount: Number(formState.advanceDiesel) || 0,
          cashAmount: Number(formState.advanceCash) || 0,
        },
        whenNeeded:
          formState.schedule === "immediately" ? "IMMEDIATE" : "SCHEDULED",
        scheduleDate: formState.scheduleDate,
        scheduleTime: formState.scheduleTime,
        additionalNotes: formState.additionalNotes,
      };

      let response;

      if (isEditMode && loadData?._id) {
        // Update existing load
        response = await api.put(`/load/${loadData._id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new load
        response = await api.post("/load", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setPopup({
        visible: true,
        title: "Success",
        message: `Load ${isEditMode ? "updated" : "posted"} successfully!`,
        type: "success",
        primaryAction: {
          label: "View Loads",
          onPress: () => {
            setPopup((prev) => ({ ...prev, visible: false }));
            router.push("/loads");
          },
        },
      });
    } catch (error) {
      console.error("Error handling load:", error);
      setPopup({
        visible: true,
        title: "Error",
        message: `Failed to ${
          isEditMode ? "update" : "post"
        } load. Please try again.`,
        type: "error",
        primaryAction: {
          label: "Try Again",
          onPress: () => setPopup((prev) => ({ ...prev, visible: false })),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  const stepThreeStyles = StyleSheet.create({
    summaryCard: {
      backgroundColor: "#fff",
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
      marginBottom: 15,
      position: "relative",
    },
    editButton: {
      position: "absolute",
      top: -10,
      right: -10,
      width: 35,
      height: 35,
      borderRadius: 25,
      backgroundColor: "#14B8A6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: "#333",
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    detailIcon: {
      marginRight: 8,
    },
    detailText: {
      color: "#666",
      fontSize: 14,
    },
    vehicleInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    infoColumn: {
      alignItems: "center",
      width: "33%",
    },
    infoLabel: {
      color: "#999",
      fontSize: 12,
    },
    infoValue: {
      color: "#333",
      fontSize: 14,
      fontWeight: "500",
    },
    scheduleContainer: {
      flexDirection: "row",
      marginTop: 15,
      gap: 10,
    },
    scheduleButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: colour.inputBackground,
    },
    scheduleButtonSelected: {
      backgroundColor: "#14B8A6",
    },
    scheduleText: {
      fontSize: 14,
      color: "#333",
    },
    scheduleTextSelected: {
      color: "#fff",
    },
    dateTimeContainer: {
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
    },
    advanceInputContainer: {
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
    },
    halfWidth: {
      flex: 1,
    },
  });
  const stepTwoStyles = StyleSheet.create({
    detailsCard: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
      marginBottom: 20,
    },
    vehicleTypeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 15,
      gap: 10,
    },
    vehicleTypeCard: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: colour.inputBackground,
      borderRadius: 12,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    vehicleTypeCardSelected: {
      borderColor: "#14B8A6",
    },
    vehicleTypeImage: {
      width: 50,
      height: 50,
      marginBottom: 8,
      resizeMode: "contain",
    },
    vehicleTypeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#333",
      textAlign: "center",
    },
    tyreContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
    },
    tyreButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: colour.inputBackground,
    },
    tyreButtonSelected: {
      backgroundColor: "#14B8A6",
    },
    tyreText: {
      fontSize: 16,
      color: "#333",
    },
    tyreTextSelected: {
      color: "#fff",
    },
    boxSkeletonContainer: {
      position: "absolute",
      right: 0,
      top: 10,
      opacity: 0.5,
    },
  });

  return (
    <View>
      {/* Load Details Summary Card */}
      <View style={[stepTwoStyles.detailsCard, { backgroundColor: "#F5FCFB" }]}>
        <Pressable
          onPress={() => setStep(1)}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 35,
            height: 35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            backgroundColor: colour.primaryColor,
            zIndex: 1,
          }}>
          <Edit
            style={{ width: 28, height: 28, marginTop: 12, marginLeft: 12 }}
          />
        </Pressable>
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 10,
            opacity: 0.5,
            height: normalize(140),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Boxskeleton style={{ borderWidth: 1, borderColor: "#FE7F4A" }} />
        </View>

        <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: "500" }}>
          Load Details
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          <DetailLocationIcon fill='#FE7F4A' />
          <Text style={{ fontSize: 16, fontWeight: "400" }}>
            {formState.source.placeName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          <DetailLocationIcon />
          <Text style={{ fontSize: 16, fontWeight: "400" }}>
            {formState.destination.placeName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <WeightIcon />
          <Text style={{ fontSize: 16, fontWeight: "400" }}>
            {formState.materialType} • {formState.quantity} {formState.unit}
          </Text>
        </View>
      </View>

      {/* Vehicle Requirements Summary Card */}
      <View style={[stepTwoStyles.detailsCard, { backgroundColor: "#F5FCFB" }]}>
        <Pressable
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 35,
            height: 35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            backgroundColor: colour.primaryColor,
            zIndex: 1,
          }}
          onPress={() => setStep(2)}>
          <Edit
            style={{ width: 28, height: 28, marginTop: 12, marginLeft: 12 }}
          />
        </Pressable>
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 10,
            opacity: 0.5,
            height: normalize(140),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Boxskeleton style={{ borderWidth: 1, borderColor: "#FE7F4A" }} />
        </View>

        <Text style={{ fontSize: 22, marginBottom: 15, fontWeight: "500" }}>
          Vehicle Requirement
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}>
          <Image
            source={require("../../../assets/images/trucktype/truck.png")}
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "400" }}>
            {formState.vehicleType.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            width: "100%",
            marginTop: 10,
          }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
              Body Type
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {formState.vehicleBodyType === "open" ? "OPEN" : "CLOSED"}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
              Truck Body
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {formState.truckBodyType === "full" ? "FULL BODY" : "HALF BODY"}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 5 }}>
              Tyre
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {formState.numTires}
            </Text>
          </View>
        </View>
      </View>

      {/* Total Offered Amount */}
      <FormInput
        Icon={LoadingPoint}
        label='Total Offered Amount'
        placeholder='Enter Offered Amount'
        name='totalOfferedAmount'
        type='number'
        onChange={(field) => {
          if (Number(field.totalOfferedAmount) <= 0) {
            Alert.alert("Error", "Total amount must be greater than 0");
            return;
          }
          handleFormChange(field);
          // Reset advance fields when total amount changes
          handleFormChange({
            advanceAmount: null,
            advanceCash: "",
            advanceDiesel: "",
          });
        }}
        value={formState.totalOfferedAmount}
      />

      {/* Advance Amount Selection */}
      <FormInput
        Icon={LoadingPoint}
        label='How much advance would you like to pay ?'
        placeholder='Enter Advance Amount'
        name='advanceAmount'
        type='number'
        min={0}
        max={
          formState.totalOfferedAmount
            ? Number(formState.totalOfferedAmount)
            : 0
        }
        onChange={(field) => {
          const totalAmount = Number(formState.totalOfferedAmount);
          const advanceAmount = Number(field.advanceAmount);

          if (!totalAmount) {
            Alert.alert("Error", "Please enter total amount first");
            return;
          }

          if (advanceAmount > totalAmount) {
            Alert.alert("Error", "Advance amount cannot exceed total amount");
            return;
          }

          if (advanceAmount < 0) {
            Alert.alert("Error", "Advance amount cannot be negative");
            return;
          }

          handleFormChange({
            ...field,
            advanceCash: advanceAmount.toString(),
            advanceDiesel: "0",
          });
        }}
        value={formState.advanceAmount}
      />

      {/* Advance Amount Details */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginVertical: 10,
          color: "#333",
        }}>
        Advance Amount
      </Text>
      <View style={stepThreeStyles.advanceInputContainer}>
        <View style={stepThreeStyles.halfWidth}>
          <FormInput
            Icon={LoadingPoint}
            placeholder='Cash'
            name='advanceCash'
            type='number'
            onChange={(field) => {
              const advanceAmount = Number(formState.advanceAmount);
              const cashAmount = Number(field.advanceCash);

              if (!advanceAmount) {
                Alert.alert("Error", "Please enter advance amount first");
                return;
              }

              if (cashAmount < 0) {
                Alert.alert("Error", "Cash amount cannot be negative");
                return;
              }

              if (cashAmount > advanceAmount) {
                Alert.alert(
                  "Error",
                  "Cash amount cannot exceed advance amount"
                );
                return;
              }

              // Calculate remaining amount for diesel
              const remainingForDiesel = advanceAmount - cashAmount;
              handleFormChange({
                ...field,
                advanceDiesel: remainingForDiesel.toString(),
              });
            }}
            value={formState.advanceCash}
            max={formState.advanceAmount ? Number(formState.advanceAmount) : 0}
          />
        </View>
        <View style={stepThreeStyles.halfWidth}>
          <FormInput
            Icon={LoadingPoint}
            placeholder='Diesel Amount'
            name='advanceDiesel'
            type='number'
            onChange={(field) => {
              const advanceAmount = Number(formState.advanceAmount);
              const cashAmount = Number(formState.advanceCash);
              const dieselAmount = Number(field.advanceDiesel);

              if (!advanceAmount) {
                Alert.alert("Error", "Please enter advance amount first");
                return;
              }

              if (dieselAmount < 0) {
                Alert.alert("Error", "Diesel amount cannot be negative");
                return;
              }

              if (dieselAmount > advanceAmount) {
                Alert.alert(
                  "Error",
                  "Diesel amount cannot exceed advance amount"
                );
                return;
              }

              // Calculate remaining amount for cash
              const remainingForCash = advanceAmount - dieselAmount;
              handleFormChange({
                ...field,
                advanceCash: remainingForCash.toString(),
              });
            }}
            value={formState.advanceDiesel}
            max={formState.advanceAmount ? Number(formState.advanceAmount) : 0}
          />
        </View>
      </View>

      {/* Schedule Selection */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginVertical: 10,
          color: "#333",
        }}>
        Schedule Your Truck
      </Text>
      <View style={stepThreeStyles.scheduleContainer}>
        <Pressable
          style={[
            stepThreeStyles.scheduleButton,
            formState.schedule === "immediately" &&
              stepThreeStyles.scheduleButtonSelected,
          ]}
          onPress={() => handleFormChange({ schedule: "immediately" })}>
          <Text
            style={[
              stepThreeStyles.scheduleText,
              formState.schedule === "immediately" &&
                stepThreeStyles.scheduleTextSelected,
            ]}>
            Immediately
          </Text>
        </Pressable>
        <Pressable
          style={[
            stepThreeStyles.scheduleButton,
            formState.schedule === "later" &&
              stepThreeStyles.scheduleButtonSelected,
          ]}
          onPress={() => handleFormChange({ schedule: "later" })}>
          <Text
            style={[
              stepThreeStyles.scheduleText,
              formState.schedule === "later" &&
                stepThreeStyles.scheduleTextSelected,
            ]}>
            Schedule
          </Text>
        </Pressable>
      </View>

      {formState.schedule === "later" && (
        <View style={stepThreeStyles.dateTimeContainer}>
          <View style={stepThreeStyles.halfWidth}>
            <FormInput
              Icon={LoadingPoint}
              label='Date'
              placeholder='Select Date'
              name='scheduleDate'
              type='date'
              onChange={handleFormChange}
            />
          </View>
          <View style={stepThreeStyles.halfWidth}>
            <FormInput
              Icon={LoadingPoint}
              label='Time'
              placeholder='Select Time'
              name='scheduleTime'
              type='time'
              onChange={handleFormChange}
            />
          </View>
        </View>
      )}

      {/* Additional Notes */}
      <View
        style={{
          marginTop: 20,
        }}>
        <FormInput
          Icon={LoadingPoint}
          label='Additional Notes'
          placeholder='Type Here...'
          name='additionalNotes'
          type='textarea'
          onChange={handleFormChange}
          style={{
            marginTop: 10,
          }}
        />
      </View>

      {/* Submit Button */}
      <View
        style={{
          marginBottom: 40,
          marginTop: 20,
        }}>
        <Pressable
          style={{
            backgroundColor: "#14B8A6",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
            marginBottom: 30,
          }}
          disabled={isLoading}
          onPress={handleSubmit}>
          {isLoading ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}>
              {isEditMode ? "Update Load" : "Post Load"}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Popup Component */}
      <Popup
        visible={popup.visible}
        onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        primaryAction={popup.primaryAction}
        secondaryAction={popup.secondaryAction}
        loading={isLoading}
      />
    </View>
  );
};

const PostLoad = () => {
  const { user, colour } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    source: { placeName: "", coordinates: null },
    destination: { placeName: "", coordinates: null },
    materialType: "",
    quantity: "",
    unit: "tonnes",
    vehicleBodyType: "open",
    vehicleType: "trailer",
    truckBodyType: "open",
    numTires: null,
    totalOfferedAmount: "",
    advanceAmount: "",
    advanceCash: "",
    advanceDiesel: "",
    schedule: "immediately",
    scheduleDate: null,
    scheduleTime: null,
    additionalNotes: "",
  });

  const paramsData = useLocalSearchParams();
  const isEditMode = paramsData?.editMode === "true";

  // Parse loadData only once when component mounts
  const loadData = useMemo(() => {
    if (paramsData?.loadData) {
      try {
        return JSON.parse(paramsData.loadData);
      } catch (error) {
        console.error("Error parsing loadData:", error);
        return null;
      }
    }
    return null;
  }, [paramsData?.loadData]);

  // Log edit mode info only once when component mounts
  useEffect(() => {
    if (isEditMode) {
      console.log("Edit mode:", isEditMode);
      console.log("Initial loadData:", loadData);
    }
  }, [isEditMode, loadData]);

  // Update form state only once when loadData changes
  useEffect(() => {
    if (loadData) {
      console.log("Updating form state with loadData:", loadData);
      setFormState((prev) => ({
        ...prev,
        source: loadData.source || prev.source,
        destination: loadData.destination || prev.destination,
        materialType: loadData.materialType || prev.materialType,
        quantity: loadData.quantity || prev.quantity,
        vehicleBodyType: loadData.vehicleBodyType || prev.vehicleBodyType,
        vehicleType: loadData.vehicleType || prev.vehicleType,
        truckBodyType: loadData.truckBodyType || prev.truckBodyType,
        numTires: loadData.numTires || prev.numTires,
        totalOfferedAmount:
          loadData.totalOfferedAmount || prev.totalOfferedAmount,
        advanceAmount: loadData.advanceAmount || prev.advanceAmount,
        advanceCash: loadData.advanceCash || prev.advanceCash,
        advanceDiesel: loadData.advanceDiesel || prev.advanceDiesel,
        schedule: loadData.schedule || prev.schedule,
        scheduleDate: loadData.scheduleDate || prev.scheduleDate,
        scheduleTime: loadData.scheduleTime || prev.scheduleTime,
        additionalNotes: loadData.additionalNotes || prev.additionalNotes,
      }));
    }
  }, [loadData]);

  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(
          formState.source.placeName &&
          formState.destination.placeName &&
          formState.materialType &&
          formState.quantity &&
          formState.unit
        );
      case 2:
        return !!(
          formState.vehicleBodyType &&
          formState.vehicleType &&
          formState.truckBodyType &&
          formState.numTires
        );
      case 3:
        return !!(
          formState.totalOfferedAmount &&
          formState.advanceAmount &&
          (formState.advanceCash || formState.advanceDiesel) &&
          formState.schedule &&
          (formState.schedule === "immediately" ||
            (formState.scheduleDate && formState.scheduleTime))
        );
      default:
        return false;
    }
  };

  const handleStepChange = (newStep) => {
    if (newStep > step && !validateStep(step)) {
      setPopup({
        visible: true,
        title: "Required Fields",
        message: "Please fill all required fields before proceeding",
        type: "warning",
        primaryAction: {
          label: "OK",
          onPress: () => setPopup((prev) => ({ ...prev, visible: false })),
        },
      });
      return;
    }

    if (newStep < step || validateStep(newStep - 1)) {
      setStep(newStep);
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    } else {
      setPopup({
        visible: true,
        title: "Required Fields",
        message: "Please fill all required fields before proceeding",
        type: "warning",
        primaryAction: {
          label: "OK",
          onPress: () => setPopup((prev) => ({ ...prev, visible: false })),
        },
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colour.background,
      marginTop: 30,
    },
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 10,
      textAlign: "center",
    },
    nextButton: {
      backgroundColor: "#14B8A6",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 30,
    },
    nextButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    formContainer: {
      position: "relative",
      minHeight: 500,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Post Load</Text>
      </View>
      <FormStepHeader
        setSteps={handleStepChange}
        totalSteps={3}
        currentStep={step}
      />

      <View style={styles.formContainer}>
        {step === 1 && (
          <>
            <StepOne formState={formState} setFormState={setFormState} />
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <StepTwo
              formState={formState}
              setFormState={setFormState}
              setStep={setStep}
            />
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <StepThree
            formState={formState}
            setFormState={setFormState}
            validateStep={validateStep}
            isEditMode={isEditMode}
            loadData={loadData}
            setStep={setStep}
          />
        )}
      </View>

      {/* Popup Component */}
      <Popup
        visible={popup.visible}
        onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        primaryAction={popup.primaryAction}
        secondaryAction={popup.secondaryAction}
      />
    </ScrollView>
  );
};

export default PostLoad;
