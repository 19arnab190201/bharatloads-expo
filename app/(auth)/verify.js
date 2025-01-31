import { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { router, useLocalSearchParams, Link } from "expo-router";
import { updateDeviceToken, setupNotificationListeners } from '../../utils/notifications';

const { width, height } = Dimensions.get("window");

export default function Verify() {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { verifyOTP, login } = useAuth();

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 5) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await verifyOTP(otpString, phoneNumber);
      // Initialize notifications after successful verification
      await updateDeviceToken();
      const cleanup = setupNotificationListeners();
      router.replace("/(app)");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    try {
      setLoading(true);
      await login(phoneNumber);
      setTimer(30);
      setOtp(["", "", "", "", ""]);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    const sanitizedText = text.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = sanitizedText;
    setOtp(newOtp);

    if (sanitizedText && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../assets/images/login.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Verify Your OTP</Text>
          <Text style={styles.subtitle}>
            We have sent the verification code to your phone number
          </Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit && styles.filledInput,
                  error && styles.errorInput,
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                editable={!loading}
                selectTextOnFocus={true}
                onFocus={() => setError("")}
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              (loading || otp.join("").length !== 5) && styles.disabledButton,
            ]}
            onPress={handleVerify}
            disabled={loading || otp.join("").length !== 5}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive OTP?{" "}
              {timer > 0 ? (
                <Text style={styles.timerText}>Wait {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup">
              <Text style={styles.link}>Sign Up</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
    textAlign: "center",
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "500",
    backgroundColor: "#f5f5f5",
  },
  filledInput: {
    borderColor: "#00BFA6",
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#00BFA6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    color: "#666",
    fontSize: 14,
  },
  timerText: {
    color: "#999",
    fontWeight: "600",
  },
  resendLink: {
    color: "#fe7f4a",
    fontWeight: "600",
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
  illustrationContainer: {
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.05,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.25,
  },
});
