import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  SafeAreaView
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../../context/AuthProvider";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(phoneNumber);
    } catch (err) {
      //status code 404 
      if (err.response.status === 404) {
        // Navigate to signup with phone number
        router.replace({
          pathname: "/signup",
          params: { phoneNumber }
        });
      } else {
        setError(err.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
        <SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
       <View style={styles.header}>
        <Text style={styles.headerText}>Hi, Welcome Back! 👋  </Text>
        <Text style={styles.subHeaderText}>Hello again, you've been missed!</Text>

        
       </View>

        <View style={styles.formContainer}>
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
          </View>

          {/* Remember Me & Need Help */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMe}
              onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.needHelp}>Need Help?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Send OTP Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup">
              <Text style={styles.link}>Sign Up</Text>
            </Link>
          </View>
        </View>
         {/* Login Illustration */}
         <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/login1.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 20,
    justifyContent: "center",
    marginTop: height * 0.15,
  },
  header: {
    marginTop: height * 0.05,
    position: "relative",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#93A2B7",
    marginTop: height * 0.01,
    fontWeight: "500",
    marginBottom: height * 0.04,
  },
  illustrationContainer: {
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.05,
  },
  illustration: {
    width: width,
    height: height * 0.25,
  },
  formContainer: {
    flex: 1,
    paddingTop: height * 0.02,
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
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#00BFA6",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#00BFA6",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
  },
  rememberMeText: {
    color: "#333",
    fontSize: 14,
  },
  needHelp: {
    color: "#fe7f4a",
    fontSize: 14,
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
});
