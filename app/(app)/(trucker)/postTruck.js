import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import useApi from "../../../hooks/useApi";

const FormStepHeader = ({ totalSteps = 2, currentStep = 1, setSteps }) => {
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
  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  return (
    <View>
      <FormInput
        Icon={LoadingPoint}
        label='Vehicle Number'
        placeholder='Enter Vehicle Number'
        name='vehicleNumber'
        onChange={handleFormChange}
      />

      <FormInput
        Icon={LoadingPoint}
        label='Vehicle Location'
        placeholder='Enter Vehicle Location'
        name='vehicleLocation'
        onChange={handleFormChange}
      />

      <FormInput
        label='Permitted Routes'
        placeholder='Select Permitted Routes'
        name='permittedRoutes'
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "National", value: "national" },
          { label: "State", value: "state" },
        ]}
      />

      <FormInput
        label='Vehicle Body Type'
        placeholder='Select Vehicle Body Type'
        name='vehicleBodyType'
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "Open", value: "open" },
          { label: "Closed", value: "closed" },
          { label: "Container", value: "container" },
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
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "Full Body", value: "full" },
          { label: "Half Body", value: "half" },
        ]}
      />

      <FormInput
        label='Vehicle Capacity'
        placeholder='Enter Vehicle Capacity (in tonnes)'
        name='vehicleCapacity'
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

      <FormInput
        label='RC Document'
        placeholder='Upload RC Document'
        name='rcDocument'
        type='file'
        onChange={handleFormChange}
      />
    </View>
  );
};

const PostTruck = () => {
  const { colour, token } = useAuth();
  const api = useApi();
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    vehicleNumber: "",
    vehicleLocation: "",
    permittedRoutes: "",
    vehicleBodyType: "",
    vehicleType: "",
    truckBodyType: "",
    vehicleCapacity: "",
    numTires: null,
    rcDocument: null,
  });

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(
          formState.vehicleNumber &&
          formState.vehicleLocation &&
          formState.permittedRoutes &&
          formState.vehicleBodyType
        );
      case 2:
        return !!(
          formState.vehicleType &&
          formState.truckBodyType &&
          formState.vehicleCapacity &&
          formState.numTires
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
      const payload = {
        vehicleNumber: formState.vehicleNumber,
        vehicleLocation: {
          placeName: formState.vehicleLocation,
          coordinates: { latitude: 0, longitude: 0 },
        },
        permittedRoutes: formState.permittedRoutes,
        vehicleBodyType: formState.vehicleBodyType,
        vehicleType: formState.vehicleType,
        truckBodyType: formState.truckBodyType,
        vehicleCapacity: formState.vehicleCapacity,
        numTires: formState.numTires,
        rcDocument: "https://www.example.com/rc-document.pdf",
      };

      console.log("payload", payload);
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/truck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("response", response);
    } catch (error) {
      console.error("Error posting truck:", error);
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
            <Pressable style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Submit</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default PostTruck;
