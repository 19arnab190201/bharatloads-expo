import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
} from "react-native";

const FormMainButton = ({
  text = "Next",
  onPress = () => {},
  disabled = false,
  variant = "full", // full, swipe
}) => {
  if (variant === "full") {
    return (
      <TouchableOpacity
        style={[styles.fullButton, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={styles.fullButtonText}>{text} →</Text>
      </TouchableOpacity>
    );
  }

  if (variant === "swipe") {
    const swipeX = React.useRef(new Animated.Value(0)).current;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= 200) {
          swipeX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 150) {
          Animated.timing(swipeX, {
            toValue: 200,
            duration: 200,
            useNativeDriver: false,
          }).start(() => onPress());
        } else {
          Animated.timing(swipeX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    });

    return (
      <View style={styles.swipeContainer}>
        <Text style={styles.swipeText}>Swipe to {text}</Text>
        <View style={styles.swipeTrack}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.swipeCircle,
              { transform: [{ translateX: swipeX }] },
            ]}>
            <Text style={styles.swipeIcon}>»</Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  // Full Button Styles
  fullButton: {
    backgroundColor: "#24C4A3",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },
  fullButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },

  // Swipe Button Styles
  swipeContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  swipeText: {
    fontSize: 16,
    color: "#24C4A3",
    marginBottom: 10,
  },
  swipeTrack: {
    width: 200,
    height: 50,
    backgroundColor: "#24C4A3",
    borderRadius: 25,
    justifyContent: "center",
  },
  swipeCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  swipeIcon: {
    color: "#24C4A3",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FormMainButton;
