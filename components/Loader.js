import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { normalize } from "../utils/functions";
const { width } = Dimensions.get("window");

const Loader = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // Restart animation when complete
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity }]}>
        <Image
          source={require("../assets/images/bllogo.png")}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  logoContainer: {
    width: width * 0.8,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  text: {
    fontSize: normalize(24),
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
});

export default Loader;
