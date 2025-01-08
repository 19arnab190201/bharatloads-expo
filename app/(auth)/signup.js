import { useState } from "react";
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
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../../context/AuthProvider";

const { width, height } = Dimensions.get("window");

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    accountType: "transporter",
    companyName: "",
    companyLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!form.name || !form.phoneNumber || !form.companyName || !form.companyLocation) {
      setError("Please fill all fields");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Name"
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
              placeholder="Enter Your Phone Number"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
              editable={!loading}
            />
          </View>

          {/* Account Type Selection */}
          <View style={styles.accountTypeContainer}>
            <TouchableOpacity
              style={[
                styles.accountTypeButton,
                form.accountType === "transporter" && styles.accountTypeButtonSelected,
              ]}
              onPress={() => handleInputChange("accountType", "transporter")}>
              <Text
                style={[
                  styles.accountTypeText,
                  form.accountType === "transporter" && styles.accountTypeTextSelected,
                ]}>
                Transporter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.accountTypeButton,
                form.accountType === "trucker" && styles.accountTypeButtonSelected,
              ]}
              onPress={() => handleInputChange("accountType", "trucker")}>
              <Text
                style={[
                  styles.accountTypeText,
                  form.accountType === "trucker" && styles.accountTypeTextSelected,
                ]}>
                Trucker
              </Text>
            </TouchableOpacity>
          </View>

          {/* Company Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Company Name"
              value={form.companyName}
              onChangeText={(value) => handleInputChange("companyName", value)}
              editable={!loading}
            />
          </View>

          {/* Company Location Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Company Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Company Location"
              value={form.companyLocation}
              onChangeText={(value) => handleInputChange("companyLocation", value)}
              editable={!loading}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get Started</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login">
              <Text style={styles.link}>Sign In</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingTop: height * 0.05,
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
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    backgroundColor: "#F7F7F7",
  },
  accountTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  accountTypeButton: {
    flex: 1,
    paddingVertical: 12,
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
  },
  accountTypeTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#00BFA6",
    padding: Platform.OS === "ios" ? 16 : 14,
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
});
