import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthProvider";
import { styles as loginStyles } from "./login";
import { api } from "../../utils/api";
import debounce from "lodash/debounce";
const { width, height } = Dimensions.get("window");

export default function Signup() {
  const scrollViewRef = useRef(null);
  const { phoneNumber: prefillPhone } = useLocalSearchParams();
  const [form, setForm] = useState({
    name: "",
    phoneNumber: prefillPhone || "",
    userType: "transporter",
    companyName: "",
    companyLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const [locations, setLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationLayout, setLocationLayout] = useState({ y: 0, height: 0 });

  const debouncedLocationSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setLocations([]);
        return;
      }

      try {
        setLocationLoading(true);
        const response = await api.get(`/locationsearch?query=${query}`);
        setLocations(response.data.data);
      } catch (error) {
        console.error("Location search error:", error);
        setLocations([]);
      } finally {
        setLocationLoading(false);
      }
    }, 500),
    []
  );

  const handleSignup = async () => {
    if (!form.name || !form.phoneNumber) {
      setError("Please fill all required fields");
      return;
    }

    // Only validate company fields for transporter
    if (
      form.userType === "transporter" &&
      (!form.companyName || !form.companyLocation)
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signup(form);
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleLocationSelect = (location) => {
    setForm((prev) => ({
      ...prev,
      companyLocation: location.name,
    }));
    setShowLocationDropdown(false);
  };

  const handleLocationChange = (text) => {
    setForm((prev) => ({
      ...prev,
      companyLocation: text,
    }));
    debouncedLocationSearch(text);
  };

  const handleLocationLayout = (event) => {
    const { y, height } = event.nativeEvent.layout;
    setLocationLayout({ y, height });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'>
          <View style={{ ...loginStyles.header, marginTop: 100 }}>
            <Text style={loginStyles.headerText}>Create an account </Text>
            <Text style={loginStyles.subHeaderText}>
              Let's get you started!
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter Your Name'
                value={form.name}
                onChangeText={(value) => handleInputChange("name", value)}
                editable={!loading}
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter Your Phone Number'
                keyboardType='phone-pad'
                value={form.phoneNumber}
                onChangeText={(value) =>
                  handleInputChange("phoneNumber", value)
                }
                editable={!loading}
              />
            </View>

            {/* Account Type Selection */}
            <View style={styles.accountTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  form.userType === "transporter" &&
                    styles.accountTypeButtonSelected,
                ]}
                onPress={() => handleInputChange("userType", "transporter")}>
                <Text
                  style={[
                    styles.accountTypeText,
                    form.userType === "transporter" &&
                      styles.accountTypeTextSelected,
                  ]}>
                  Transporter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  form.userType === "trucker" &&
                    styles.accountTypeButtonSelected,
                ]}
                onPress={() => handleInputChange("userType", "trucker")}>
                <Text
                  style={[
                    styles.accountTypeText,
                    form.userType === "trucker" &&
                      styles.accountTypeTextSelected,
                  ]}>
                  Trucker
                </Text>
              </TouchableOpacity>
            </View>

            {/* Company fields - Only show for transporter */}
            {form.userType === "transporter" && (
              <>
                {/* Company Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='Enter Your Company Name'
                    value={form.companyName}
                    onChangeText={(value) =>
                      handleInputChange("companyName", value)
                    }
                    editable={!loading}
                  />
                </View>

                {/* Company Location Input - modified */}
                <View
                  style={[styles.inputContainer, { zIndex: 2 }]}
                  onLayout={handleLocationLayout}>
                  <Text style={styles.inputLabel}>Company Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='Enter Your Company Location'
                    value={form.companyLocation}
                    onChangeText={handleLocationChange}
                    onFocus={() => {
                      setShowLocationDropdown(true);
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({
                          y: locationLayout.y,
                          animated: true,
                        });
                      }, 100);
                    }}
                    editable={!loading}
                  />

                  {/* Location Dropdown */}
                  {showLocationDropdown && locations.length > 0 && (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          top: locationLayout.height,
                          position: "absolute",
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                        },
                      ]}>
                      <ScrollView
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps='handled'>
                        {locations.map((location, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleLocationSelect(location)}>
                            <Text numberOfLines={1} style={styles.dropdownText}>
                              {location.name}
                            </Text>
                            <Text
                              numberOfLines={2}
                              style={styles.dropdownSubText}>
                              {location.description}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Get Started Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignup}
              disabled={loading}>
              {loading ? (
                <Text style={styles.buttonText}>Loading...</Text>
              ) : (
                <Text style={styles.buttonText}>Get Started</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href='/login'>
                <Text style={styles.link}>Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  formContainer: {
    flex: 1,
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: Platform.OS === "ios" ? 16 : 20,
    fontSize: 16,
    backgroundColor: "#F1F5F9",
  },
  accountTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    alignItems: "center",
    marginHorizontal: 5,
  },
  accountTypeButtonSelected: {
    backgroundColor: "#fe7f4a",
    borderColor: "#fe7f4a",
  },
  accountTypeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  accountTypeTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#00BFA6",
    padding: Platform.OS === "ios" ? 16 : 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF3B30",
    marginBottom: 12,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#fe7f4a",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    maxHeight: 200,
    overflow: "scroll",
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
