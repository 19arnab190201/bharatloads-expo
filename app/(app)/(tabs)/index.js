// @Dashboard Page
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthProvider";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Header from "../../../components/Header";
import Banner from "../../../components/Banner";
import LoadCard from "../../../components/LoadCard";
// import Animated, { Easing } from "react-native-reanimated";
import { api } from "../../../utils/api";

export default function Dashboard() {
  const { user, logout, colour } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();

  const [loads, setLoads] = useState([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colour.background,
      marginTop: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Dashboard",
      headerShown: false,
      headerTitleAlign: "center", // Centers the title
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchLoads = async () => {
    try {
      const response = await api.get("/dashboard");
      setLoads(response.data.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  // console.log("colour", colour);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <Header />
      <Banner
        description='Diven to deliver excellence, powered by unwavering trust.'
        image={require("../../../assets/images/truck.png")}
        cta='Post Load'
        ctaUrl='(transporter)/postLoad'
        onPress={() => console.log("Learn more")}
        backgroundColor='#1E283A'
        textColor='#fff'
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>Your Loads</Text>

        {loads.map((load) => (
          <LoadCard key={load._id} data={load} />
        ))}
      </View>

      {/* <TouchableOpacity
        onPress={() => router.push("/(app)/pickAndDrop")}
        style={styles.statCard}>
        <Text>PICK AND DROP</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}
