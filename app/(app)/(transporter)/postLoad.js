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
  Image,
  Alert,
} from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import FormMainButton from "../../../components/FormMainButton";
import PickAndDrop from "../pickAndDrop";
import Boxskeleton from "../../../assets/images/icons/Boxskeleton";

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

const StepNavigation = ({ currentStep, onNext, isValid }) => {
  const { colour } = useAuth();
  
  const navigationStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 10,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: isValid ? colour.primaryColor : colour.greyTag,
    },
    buttonText: {
      color: isValid ? '#fff' : colour.inputLabel,
      fontSize: 16,
      fontWeight: '600',
    }
  });

  return (
    <View style={navigationStyles.container}>
      {currentStep < 3 && (
        <Pressable
          style={navigationStyles.button}
          onPress={onNext}
          disabled={!isValid}>
          <Text style={navigationStyles.buttonText}>
            Next
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const LoadDetailsCard = ({ formState, onEdit, showEditButton = true }) => {
  const styles = StyleSheet.create({
    summaryCard: {
      backgroundColor: '#fff',
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
      marginBottom: 15,
      position: 'relative',
    },
    editButton: {
      position: "absolute",
      top: -10,
      right: -10,
      width: 35,
      height: 35,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,
      backgroundColor: "#f1f1f1",
      zIndex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#333',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    boxSkeletonContainer: {
      position: 'absolute',
      right: 10,
      top: 10,
      opacity: 0.5,
      zIndex: 0,
    }
  });

  return (
    <Pressable style={styles.summaryCard} onPress={onEdit}>
      {showEditButton && (
        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text>E</Text>
        </Pressable>
      )}
      <View style={styles.boxSkeletonContainer}>
        <Boxskeleton />
      </View>
      <Text style={styles.cardTitle}>Load Details</Text>
      <View style={styles.detailRow}>
        <LoadingPoint style={{ marginRight: 8 }} />
        <Text>{formState.loadingPoint}</Text>
      </View>
      <View style={styles.detailRow}>
        <LoadingPoint style={{ marginRight: 8 }} />
        <Text>{formState.droppingPoint}</Text>
      </View>
      <View style={styles.detailRow}>
        <LoadingPoint style={{ marginRight: 8 }} />
        <Text>{`${formState.materialType} • ${formState.quantity} ${formState.unit}`}</Text>
      </View>
    </Pressable>
  );
};

const StepOne = ({ formState, setFormState, handleStepChange, validateStep }) => {
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
          value={formState.loadingPoint}
          onChange={handleFormChange}
        />
        <FormInput
          Icon={LoadingPoint}
          label='Droping Point'
          placeholder='Search Droping Point'
          name='droppingPoint'
          value={formState.droppingPoint}
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
          { label: "Cement", value: "Cement" },
          { label: "Sand", value: "Sand" },
          { label: "Gravel", value: "Gravel" },
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
      <StepNavigation
        currentStep={1}
        onNext={() => handleStepChange(2)}
        isValid={validateStep(1)}
      />
    </View>
  );
};

const StepTwo = ({ formState, setFormState, handleStepChange, validateStep }) => {
  const { colour } = useAuth();
  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  const vehicleTypes = [
    { id: 'trailer', label: 'TRAILER', icon: require('../../../assets/images/trucktype/trailer.png') },
    { id: 'hyva', label: 'HYVA', icon: require('../../../assets/images/trucktype/hyva.png') },
    { id: 'truck', label: 'TRUCK', icon: require('../../../assets/images/trucktype/truck.png') },
  ];

  const truckTyres = [10, 12, 14, 16, 'Other'];

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
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 15,
      gap: 10,
    },
    vehicleTypeCard: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: colour.inputBackground,
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    vehicleTypeCardSelected: {
      borderColor: '#14B8A6',
    },
    vehicleTypeImage: {
      width: 50,
      height: 50,
      marginBottom: 8,
      resizeMode: 'contain'
    },
    vehicleTypeLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    tyreContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
      backgroundColor: '#14B8A6',
    },
    tyreText: {
      fontSize: 16,
      color: '#333',
    },
    tyreTextSelected: {
      color: '#fff',
    },
    boxSkeletonContainer: {
      position: 'absolute',
      right: 10,
      top: 10,
      opacity: 0.5,
    }
  });

  return (
    <View>
      <LoadDetailsCard 
        formState={formState} 
        onEdit={() => handleStepChange(1)} 
      />

      <FormInput
        Icon={LoadingPoint}
        label='Vehicle Body Type'
        placeholder='Select Vehicle Body Type'
        name='vehicleBodyType'
        type='select'
        onChange={handleFormChange}
        options={[
          { label: 'Open', value: 'Open' },
          { label: 'Closed', value: 'Closed' },
          { label: 'Container', value: 'Container' },
        ]}
      />

      <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
        Vehicle Type
      </Text>
      <View style={stepTwoStyles.vehicleTypeContainer}>
        {vehicleTypes.map((type) => (
          <Pressable
            key={type.id}
            style={[
              stepTwoStyles.vehicleTypeCard,
              formState.vehicleType === type.id && stepTwoStyles.vehicleTypeCardSelected
            ]}
            onPress={() => handleFormChange({ vehicleType: type.id })}>
            <Image source={type.icon} style={stepTwoStyles.vehicleTypeImage} />
            <Text style={stepTwoStyles.vehicleTypeLabel}>{type.label}</Text>
          </Pressable>
        ))}
      </View>

      <FormInput
        Icon={LoadingPoint}
        label='Truck Body Type'
        placeholder='Select Truck Body Type'
        name='truckBodyType'
        type='select'
        onChange={handleFormChange}
        options={[
          { label: 'Full Body', value: 'Full Body' },
          { label: 'Half Body', value: 'Half Body' },
        ]}
      />

      <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 10, color: '#333' }}>
        Truck Tyre
      </Text>
      <View style={stepTwoStyles.tyreContainer}>
        {truckTyres.map((tyre) => (
          <Pressable
            key={tyre}
            style={[
              stepTwoStyles.tyreButton,
              formState.numTires === tyre && stepTwoStyles.tyreButtonSelected
            ]}
            onPress={() => handleFormChange({ numTires: tyre })}>
            <Text
              style={[
                stepTwoStyles.tyreText,
                formState.numTires === tyre && stepTwoStyles.tyreTextSelected
              ]}>
              {tyre}
            </Text>
          </Pressable>
        ))}
      </View>
      <StepNavigation
        currentStep={2}
        onNext={() => handleStepChange(3)}
        isValid={validateStep(2)}
      />
    </View>
  );
};

const StepThree = ({ formState, setFormState, handleStepChange, validateStep }) => {
  const { colour } = useAuth();
  
  const handleFormChange = (updatedField) => {
    setFormState((prev) => ({
      ...prev,
      ...updatedField,
    }));
  };

  const stepThreeStyles = StyleSheet.create({
    summaryCard: {
      backgroundColor: '#fff',
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      borderColor: "#14B8A6",
      marginBottom: 15,
      position: 'relative',
    },
    editButton: {
      position: "absolute",
      top: -10,
      right: -10,
      width: 35,
      height: 35,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,
      backgroundColor: "#f1f1f1",
      zIndex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#333',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    detailIcon: {
      marginRight: 8,
    },
    detailText: {
      color: '#666',
      fontSize: 14,
    },
    vehicleInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    infoColumn: {
      flex: 1,
    },
    infoLabel: {
      color: '#999',
      fontSize: 12,
    },
    infoValue: {
      color: '#333',
      fontSize: 14,
      fontWeight: '500',
    },
    scheduleContainer: {
      flexDirection: 'row',
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
      backgroundColor: '#14B8A6',
    },
    scheduleText: {
      fontSize: 14,
      color: '#333',
    },
    scheduleTextSelected: {
      color: '#fff',
    },
    dateTimeContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
    advanceInputContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
    halfWidth: {
      flex: 1,
    },
    boxSkeletonContainer: {
      position: 'absolute',
      right: 10,
      top: 10,
      opacity: 0.5,
      zIndex: 0,
    },
  });

  return (
    <View>
      <LoadDetailsCard 
        formState={formState} 
        onEdit={() => handleStepChange(1)} 
      />

      {/* Vehicle Requirements Summary Card */}
      <Pressable 
        style={stepThreeStyles.summaryCard} 
        onPress={() => handleStepChange(2)}>
        <Pressable style={stepThreeStyles.editButton} onPress={() => handleStepChange(2)}>
          <Text>E</Text>
        </Pressable>
        <Text style={stepThreeStyles.cardTitle}>Vehicle Requirement</Text>
        <View style={stepThreeStyles.detailRow}>
          <Image 
            source={require('../../../assets/images/trucktype/truck.png')} 
            style={{ width: 40, height: 40, marginRight: 10 }} 
          />
          <Text style={stepThreeStyles.detailText}>TRUCK</Text>
        </View>
        <View style={stepThreeStyles.vehicleInfo}>
          <View style={stepThreeStyles.infoColumn}>
            <Text style={stepThreeStyles.infoLabel}>Body Type</Text>
            <Text style={stepThreeStyles.infoValue}>{formState.vehicleBodyType}</Text>
          </View>
          <View style={stepThreeStyles.infoColumn}>
            <Text style={stepThreeStyles.infoLabel}>Truck Body</Text>
            <Text style={stepThreeStyles.infoValue}>{formState.truckBodyType}</Text>
          </View>
          <View style={stepThreeStyles.infoColumn}>
            <Text style={stepThreeStyles.infoLabel}>Tyre</Text>
            <Text style={stepThreeStyles.infoValue}>{formState.numTires}</Text>
          </View>
        </View>
      </Pressable>

      {/* Total Offered Amount */}
      <FormInput
        Icon={LoadingPoint}
        label="Total Offered Amount"
        placeholder="Enter Offered Amount"
        name="totalOfferedAmount"
        type="number"
        onChange={handleFormChange}
      />

      {/* Advance Amount Selection */}
      <FormInput
        Icon={LoadingPoint}
        label="How much advance would you like to pay ?"
        placeholder="Select Advance Amount Percentage"
        name="advancePercentage"
        type="number"
        onChange={handleFormChange}
        min={10}
        max={100}
        step={1}
      />

      {/* Advance Amount Details */}
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 10, color: '#333' }}>
        Advance Amount
      </Text>
      <View style={stepThreeStyles.advanceInputContainer}>
        <View style={stepThreeStyles.halfWidth}>
          <FormInput
            Icon={LoadingPoint}
            placeholder="Cash"
            name="advanceCash"
            type="number"
            onChange={handleFormChange}
          />
        </View>
        <View style={stepThreeStyles.halfWidth}>
          <FormInput
            Icon={LoadingPoint}
            placeholder="Diesel"
            name="advanceDiesel"
            type="number"
            onChange={handleFormChange}
          />
        </View>
      </View>

      {/* Schedule Selection */}
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 10, color: '#333' }}>
        Schedule Your Truck
      </Text>
      <View style={stepThreeStyles.scheduleContainer}>
        <Pressable
          style={[
            stepThreeStyles.scheduleButton,
            formState.schedule === 'immediately' && stepThreeStyles.scheduleButtonSelected
          ]}
          onPress={() => handleFormChange({ schedule: 'immediately' })}>
          <Text
            style={[
              stepThreeStyles.scheduleText,
              formState.schedule === 'immediately' && stepThreeStyles.scheduleTextSelected
            ]}>
            Immediately
          </Text>
        </Pressable>
        <Pressable
          style={[
            stepThreeStyles.scheduleButton,
            formState.schedule === 'later' && stepThreeStyles.scheduleButtonSelected
          ]}
          onPress={() => handleFormChange({ schedule: 'later' })}>
          <Text
            style={[
              stepThreeStyles.scheduleText,
              formState.schedule === 'later' && stepThreeStyles.scheduleTextSelected
            ]}>
            Schedule
          </Text>
        </Pressable>
      </View>

      {formState.schedule === 'later' && (
        <View style={stepThreeStyles.dateTimeContainer}>
          <View style={stepThreeStyles.halfWidth}>
            <FormInput
              Icon={LoadingPoint}
              label="Date"
              placeholder="Select Date"
              name="scheduleDate"
              type="date"
              value={formState.scheduleDate}
              onChange={(value) => handleFormChange({ scheduleDate: value })}
            />
          </View>
          <View style={stepThreeStyles.halfWidth}>
            <FormInput
              Icon={LoadingPoint}
              label="Time"
              placeholder="Select Time"
              name="scheduleTime"
              type="time"
              value={formState.scheduleTime}
              onChange={(value) => handleFormChange({ scheduleTime: value })}
            />
          </View>
        </View>
      )}

      {/* Additional Notes */}
      <FormInput
        Icon={LoadingPoint}
        label="Additional Notes"
        placeholder="Type Here..."
        name="additionalNotes"
        type="textarea"
        onChange={handleFormChange}
      />

      {/* Submit Button */}
      <FormMainButton
        text="Swipe to Post Load"
        onPress={() => {
          // Handle submission
          console.log('Form submitted:', formState);
        }}
        variant="full"
      />
      <StepNavigation
        currentStep={3}
        onNext={() => handleStepChange(2)}
        isValid={validateStep(3)}
      />
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
    numTires: null,
    totalOfferedAmount: "",
    advancePercentage: null,
    advanceCash: "",
    advanceDiesel: "",
    schedule: "immediately",
    scheduleDate: null,
    scheduleTime: null,
    additionalNotes: "",
  });

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!(
          formState.loadingPoint &&
          formState.droppingPoint &&
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
          formState.advancePercentage &&
          (formState.advanceCash || formState.advanceDiesel) &&
          formState.schedule &&
          (formState.schedule === 'immediately' || 
            (formState.scheduleDate && formState.scheduleTime))
        );
      default:
        return false;
    }
  };

  const handleStepChange = (newStep) => {
    // Only allow moving forward if current step is valid
    if (newStep > step && !validateStep(step)) {
      // Show error message or handle invalid step
      Alert.alert('Please fill all required fields before proceeding');
      return;
    }
    
    // Allow moving backward or to validated steps
    if (newStep < step || validateStep(newStep - 1)) {
      setStep(newStep);
    }
  };

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
          <StepOne 
            formState={formState} 
            setFormState={setFormState}
            handleStepChange={handleStepChange}
            validateStep={validateStep}
          />
        )}
        {step === 2 && (
          <StepTwo 
            formState={formState} 
            setFormState={setFormState}
            handleStepChange={handleStepChange}
            validateStep={validateStep}
          />
        )}
        {step === 3 && (
          <StepThree 
            formState={formState} 
            setFormState={setFormState}
            handleStepChange={handleStepChange}
            validateStep={validateStep}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default PostLoad;
