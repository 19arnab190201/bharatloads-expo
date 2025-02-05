import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useEffect } from "react";
import { formatVehicle } from "../../../utils/functions";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import { api } from "../../../utils/api";
import { useRouter } from "expo-router";
import debounce from "lodash/debounce";
import Loader from "../../../components/Loader";

const FormStepHeader = ({ totalSteps = 2, currentStep = 1, setSteps }) => {
  const { colour, token } = useAuth();

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
            <Pressable onPress={() => setSteps(stepIndex)}>
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

const StepOne = ({ formState, setFormState }) => {
  const [locations, setLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
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

  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

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
      truckLocation: {
        placeName: location.name,
        coordinates: {
          latitude: location.coordinates.lat,
          longitude: location.coordinates.lng,
        },
      },
    }));
    setShowLocationDropdown(false);
  };

  const handleLocationChange = (text) => {
    setFormState((prev) => ({
      ...prev,
      truckLocation: {
        placeName: text,
        coordinates: null,
      },
    }));
    debouncedLocationSearch(text);
  };

  return (
    <View>
      <FormInput
        Icon={LoadingPoint}
        label='Vehicle Number'
        placeholder='Enter Vehicle Number'
        name='truckNumber'
        value={formState.truckNumber}
        onChangeText={(text) => handleFormChange({ truckNumber: text })}
        allowOnlyCaps={true}
      />

      <View style={{ position: "relative", zIndex: 1000 }}>
        <FormInput
          Icon={LoadingPoint}
          label='Vehicle Location'
          placeholder='Enter Vehicle Location'
          name='truckLocation'
          value={formState.truckLocation?.placeName || ""}
          onChangeText={handleLocationChange}
          onFocus={() => setShowLocationDropdown(true)}
        />

        {/* Location suggestions dropdown */}
        {showLocationDropdown && locations.length > 0 && (
          <View style={styles.dropdownContainer}>
            {locations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleLocationSelect(location)}>
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
        label='Permitted Routes'
        placeholder='Select Permitted Routes'
        name='truckPermit'
        type='select'
        disabled={showLocationDropdown}
        onChange={handleFormChange}
        options={[
          { label: "National", value: "NATIONAL_PERMIT" },
          { label: "State", value: "STATE_PERMIT" },
        ]}
      />

      <FormInput
        label='Vehicle Body Type'
        placeholder='Select Vehicle Body Type'
        name='vehicleBodyType'
        type='select'
        disabled={showLocationDropdown}
        onChange={handleFormChange}
        options={[
          { label: "Open", value: "OPEN_BODY" },
          { label: "Closed", value: "CLOSED_BODY" },
        ]}
      />
    </View>
  );
};

const StepTwo = ({ formState, setFormState }) => {
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

  const truckTyres = [10, 12, 14, 16, "Other"];

  const stepTwoStyles = StyleSheet.create({
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
  });

  return (
    <View>
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
            key={type.label}
            style={[
              stepTwoStyles.vehicleTypeCard,
              formState.truckType === type.label &&
                stepTwoStyles.vehicleTypeCardSelected,
            ]}
            onPress={() => handleFormChange({ truckType: type.label })}>
            <Image source={type.icon} style={stepTwoStyles.vehicleTypeImage} />
            <Text style={stepTwoStyles.vehicleTypeLabel}>{type.label}</Text>
          </Pressable>
        ))}
      </View>

      <FormInput
        label='Truck Body Type'
        placeholder='Select Truck Body Type'
        name='truckBodyType'
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "Full Body", value: "OPEN_FULL_BODY" },
          { label: "Half Body", value: "OPEN_HALF_BODY" },
        ]}
      />

      <FormInput
        label='Vehicle Capacity'
        placeholder='Enter Vehicle Capacity (in tonnes)'
        name='truckCapacity'
        type='number'
        onChange={handleFormChange}
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
              formState.truckTyre === tyre && stepTwoStyles.tyreButtonSelected,
            ]}
            onPress={() => handleFormChange({ truckTyre: tyre })}>
            <Text
              style={[
                stepTwoStyles.tyreText,
                formState.truckTyre === tyre && stepTwoStyles.tyreTextSelected,
              ]}>
              {tyre}
            </Text>
          </Pressable>
        ))}
      </View>

      <FormInput
        label='RC Document'
        placeholder='Upload RC Document'
        name='RCImage'
        type='file'
        onChange={handleFormChange}
      />
    </View>
  );
};

const PostTruck = () => {
  const router = useRouter();
  const { colour, token } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    truckNumber: "",
    truckLocation: {
      placeName: "",
      coordinates: null,
    },
    truckPermit: "",
    vehicleBodyType: "",
    truckType: "",
    truckBodyType: "",
    truckCapacity: "",
    truckTyre: null,
    RCImage: null,
  });

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(
          formState.truckNumber &&
          formState.truckLocation.placeName &&
          formState.truckPermit &&
          formState.vehicleBodyType
        );
      case 2:
        return !!(
          formState.truckType &&
          formState.truckBodyType &&
          formState.truckCapacity &&
          formState.truckTyre
        );
      default:
        return false;
    }
  };

  const handleStepChange = (newStep) => {
    if (newStep > step && !validateStep(step)) {
      Alert.alert("Please fill all required fields before proceeding");
      return;
    }

    if (newStep < step || validateStep(newStep - 1)) {
      setStep(newStep);
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 2));
    } else {
      Alert.alert("Please fill all required fields before proceeding");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formState.truckLocation.coordinates) {
        Alert.alert(
          "Error",
          "Please select a valid location from the dropdown"
        );
        return;
      }

      setIsSubmitting(true);
      const payload = {
        truckNumber: formatVehicle(formState.truckNumber),
        truckLocation: formState.truckLocation,
        truckPermit: formState.truckPermit,
        vehicleBodyType: formState.vehicleBodyType,
        truckType: formState.truckType,
        truckBodyType: formState.truckBodyType,
        truckCapacity: formState.truckCapacity,
        truckTyre: formState.truckTyre,
        RCImage: formState.RCImage,
      };

      const response = await api.post("/truck", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Truck posted successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/"),
        },
      ]);
    } catch (error) {
      console.error("Error posting truck:", error);
      Alert.alert("Error", "Failed to post truck. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      opacity: isSubmitting ? 0.7 : 1,
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
      <View>
        <Text style={styles.heading}>Post Truck</Text>
      </View>
      <FormStepHeader
        setSteps={handleStepChange}
        totalSteps={2}
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
            <StepTwo formState={formState} setFormState={setFormState} />
            <Pressable
              style={styles.nextButton}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ActivityIndicator size='small' color='#fff' />
                </>
              ) : (
                <Text style={styles.nextButtonText}>Submit</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default PostTruck;
