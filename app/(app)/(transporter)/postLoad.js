import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Pressable,
} from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import FormMainButton from "../../../components/FormMainButton";
import PickAndDrop from "../pickAndDrop";

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
                console.log("Step", stepIndex);
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
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 50,
    marginRight: 10,
  },
  tagButtonSelected: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    marginRight: 10,
  },
  tagButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  tagButtonTextUnselected: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

const StepOne = ({ formState, setFormState }) => {
  const handleUnitChange = (unit) => {
    setFormState((prev) => ({ ...prev, unit }));
  };

  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  const [pickDropModalVisible, setPickDropModalVisible] = useState(false);
  const [locationData, setLocationData] = useState({
    source: null,
    destination: null,
  });
  const handleLocationSelect = (data) => {
    setLocationData(data);
    setPickDropModalVisible(false);
  };
  return (
    <View>
      <Pressable onPress={() => setPickDropModalVisible(true)}>
        <FormInput
          Icon={LoadingPoint}
          label='Loading Point'
          placeholder='Search Loading Point'
          name='loadingPoint'
          onChange={handleFormChange}
        />
        <FormInput
          Icon={LoadingPoint}
          label='Droping Point'
          placeholder='Search Droping Point'
          name='droppingPoint'
          onChange={handleFormChange}
        />
      </Pressable>
      <PickAndDrop
        visible={pickDropModalVisible}
        onClose={() => setPickDropModalVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
      <FormInput
        Icon={LoadingPoint}
        label='Material Type'
        placeholder='Enter Material Type'
        name='materialType'
        type='select'
        onChange={handleFormChange}
        options={[
          { label: "Cement", value: "cement" },
          { label: "Sand", value: "sand" },
          { label: "Gravel", value: "gravel" },
        ]}
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
            placeholder='Enter Quantity'
            name='quantity'
            onChange={handleFormChange}
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

const StepTwo = ({ formState, setFormState }) => {
  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  const stepTwoStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
    },
    image: {
      width: 200,
      height: 200,
    },
  });
  return (
    <View>
      <View style={stepTwoStyles.container}>
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
            backgroundColor: "#f1f1f1",
          }}>
          <Text>E</Text>
        </Pressable>
        <Text
          style={{
            fontSize: 22,
          }}>
          Load Details
        </Text>
        <Text>{formState.loadingPoint}</Text>
        <Text>{formState.droppingPoint}</Text>
        <Text>{formState.materialType}</Text>
        <Text>{formState.quantity} Tonnes</Text>
      </View>

      <FormInput
        Icon={LoadingPoint}
        label='Vehicle Body Type'
        placeholder='Enter Vehicle Body Type'
        name='vehicleBodyType'
        onChange={handleFormChange}
      />
      <FormInput
        Icon={LoadingPoint}
        label='Vehicle Type'
        placeholder='Enter Vehicle Type'
        name='vehicleType'
        onChange={handleFormChange}
      />
      <FormInput
        Icon={LoadingPoint}
        label='Truck Body Type'
        placeholder='Enter Truck Body Type'
        name='truckBodyType'
        onChange={handleFormChange}
      />

      <View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {[4, 6, 8, 10, 12, 14, 16].map((numTires) => (
            <Pressable
              key={numTires}
              style={
                formState.numTires === numTires
                  ? styles.tagButtonSelected
                  : styles.tagButton
              }
              onPress={() => setFormState((prev) => ({ ...prev, numTires }))}>
              <Text
                style={
                  formState.numTires === numTires
                    ? styles.tagButtonText
                    : styles.tagButtonTextUnselected
                }>
                {numTires}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const StepThree = ({ formState, setFormState }) => {
  const stepThreeStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-start",
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
    },
    image: {
      width: 200,
      height: 200,
    },
  });

  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  return (
    <View>
      <View style={stepThreeStyles.container}>
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
            backgroundColor: "#f1f1f1",
          }}>
          <Text>E</Text>
        </Pressable>
        <Text
          style={{
            fontSize: 22,
          }}>
          Load Details
        </Text>
        <Text>{formState.loadingPoint}</Text>
        <Text>{formState.droppingPoint}</Text>
        <Text>{formState.materialType}</Text>
        <Text>{formState.quantity} Tonnes</Text>
      </View>
      <View>
        <View style={stepThreeStyles.container}>
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
              backgroundColor: "#f1f1f1",
            }}>
            <Text>E</Text>
          </Pressable>
          <Text
            style={{
              fontSize: 22,
            }}>
            Vehicle Requirement
          </Text>
          <Text>{formState.vehicleBodyType}</Text>
          <Text>{formState.vehicleType}</Text>
          <Text>{formState.truckBodyType}</Text>
          <Text>{formState.numTires} Tires</Text>
        </View>
      </View>
      <FormInput
        Icon={LoadingPoint}
        label='Total Offered Amount'
        placeholder='Enter Total Offered Amount'
        name='totalOfferedAmount'
        onChange={handleFormChange}
        type='number'
        min={1}
        max={1000}
      />

      <FormInput
        Icon={LoadingPoint}
        label='How much advance would you like to pay ?'
        placeholder='Enter Advance Amount'
        name='advanceAmount'
        onChange={handleFormChange}
        type='number'
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: -8,
          color: "#333",
        }}>
        Advance Amount
      </Text>

      <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
        <View style={{ width: "50%", marginRight: 10 }}>
          <FormInput
            Icon={LoadingPoint}
            label=''
            placeholder='Enter Amount'
            name='cash'
            onChange={handleFormChange}
          />
        </View>
        <View style={{ width: "50%", marginRight: 10 }}>
          <FormInput
            Icon={LoadingPoint}
            label=''
            placeholder='Enter Diesel'
            name='cash'
            onChange={handleFormChange}
          />
        </View>
      </View>

      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: -8,
          color: "#333",
        }}>
        Schedule Your Truck
      </Text>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Pressable
          style={
            formState.schedule === "immediately"
              ? styles.tagButtonSelected
              : styles.tagButton
          }
          onPress={() =>
            setFormState((prev) => ({ ...prev, schedule: "immediately" }))
          }>
          <Text
            style={
              formState.schedule === "immediately"
                ? styles.tagButtonText
                : styles.tagButtonTextUnselected
            }>
            Immediately
          </Text>
        </Pressable>
        <Pressable
          style={
            formState.schedule === "later"
              ? styles.tagButtonSelected
              : styles.tagButton
          }
          onPress={() =>
            setFormState((prev) => ({ ...prev, schedule: "later" }))
          }>
          <Text
            style={
              formState.schedule === "later"
                ? styles.tagButtonText
                : styles.tagButtonTextUnselected
            }>
            Schedule
          </Text>
        </Pressable>
      </View>
      {formState.schedule === "later" && (
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            width: "100%",
          }}>
          <View style={{ width: "50%", marginRight: 10 }}>
            <FormInput
              Icon={LoadingPoint}
              label='Date'
              placeholder='Select Date'
              name='scheduleDate'
              type='date'
              onChange={handleFormChange}
            />
          </View>
          <View style={{ width: "50%", marginRight: 10 }}>
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
    </View>
  );
};

const PostLoad = () => {
  const { user, colour } = useAuth();
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    loadingPoint: "",
    droppingPoint: "",
    materialType: "",
    quantity: 0,
    unit: "tonnes",
    vehicleBodyType: "",
    vehicleType: "",
    truckBodyType: "",
  });

  useEffect(() => {
    console.log(formState);
  }, [formState]);

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
  });

  return (
    <ScrollView style={styles.container}>
      <StatusBar style='light ' />
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Post Load</Text>
      </View>
      <FormStepHeader setSteps={setStep} totalSteps={3} currentStep={step} />

      <View style={styles.formContainer}>
        {step === 1 && (
          <>
            <StepOne formState={formState} setFormState={setFormState} />

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}>
              {/* Full Button */}
              <FormMainButton
                text='Next'
                onPress={() => {
                  setStep(2);
                  console.log(formState);
                }}
                variant='full'
              />
            </View>
          </>
        )}
        {step === 2 && (
          <>
            <View>
              <StepTwo formState={formState} setFormState={setFormState} />
              {/* Full Button */}
              <FormMainButton
                text='Next'
                onPress={() => {
                  setStep(3);
                  console.log(formState);
                }}
                variant='full'
              />
            </View>
          </>
        )}
        {step === 3 && (
          <StepThree formState={formState} setFormState={setFormState} />
        )}
      </View>
    </ScrollView>
  );
};

export default PostLoad;
