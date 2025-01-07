import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const BottomNavigation = () => {
  const router = useRouter();

  return (
    <View style={styles.nav}>
      <TouchableOpacity onPress={() => router.push("/dashboard")}>
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/dashboard/transporter")}>
        <Text style={styles.text}>Transporter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/dashboard/admin")}>
        <Text style={styles.text}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  text: {
    fontSize: 16,
  },
});

export default BottomNavigation;
