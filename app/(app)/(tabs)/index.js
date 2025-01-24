// @Dashboard Page
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Pressable,
} from "react-native";
import { useCallback } from "react";
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
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import TruckCard from "../../../components/TruckCard";
import { normalize } from "../../../utils/functions";
import { useFocusEffect } from "@react-navigation/native";

export default function Dashboard() {
  const { user, logout, colour } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();

  const userType = user?.userType;

  const [loads, setLoads] = useState([]);
  const [trucks, setTrucks] = useState([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colour.background,
      marginTop: 30,
    },
    title: {
      fontSize: normalize(22),
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

  const fetchTrucks = async () => {
    try {
      const response = await api.get("/dashboard");
      setTrucks(response.data.data);
      console.log("============================================");
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userType.toLowerCase() === "transporter") {
        fetchLoads();
      } else {
        fetchTrucks();
      }
    }, [userType])
  );

  // console.log("colour", colour);

  if (userType.toLowerCase() === "transporter") {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='#fff' />
        <Header />
        <Banner
          description='Driven to deliver excellence, powered by unwavering trust.'
          image={require("../../../assets/images/truck.png")}
          cta='Post Load'
          ctaUrl='(transporter)/postLoad'
          onPress={() => console.log("Learn more")}
          backgroundColor='#1E283A'
          textColor='#fff'
        />
        <TouchableOpacity
          style={{
            backgroundColor: colour.inputBackground,
            borderRadius: 10,
            padding: 10,
            paddingVertical: 18,
            marginTop: 20,
            flexDirection: "row",
            gap: 10,
          }}
          onPress={() => router.push("/(transporter)/searchTrucks")}>
          <LoadingPoint />
          <Text>Search Trucks</Text>
        </TouchableOpacity>

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
  } else if (userType.toLowerCase()) {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='#fff' />
        <Header />
        <Banner
          description='Driven to deliver excellence, powered by unwavering trust.'
          image={require("../../../assets/images/truck.png")}
          cta='Post Truck'
          ctaUrl='(trucker)/postTruck'
          onPress={() => console.log("Learn more")}
          backgroundColor='#1E283A'
          textColor='#fff'
        />
        <TouchableOpacity
          style={{
            backgroundColor: colour.inputBackground,
            borderRadius: 10,
            padding: 10,
            paddingVertical: 18,
            marginTop: 20,
            flexDirection: "row",
            gap: 10,
          }}
          onPress={() => router.push("/(trucker)/searchLoad")}>
          <LoadingPoint />
          <Text>Search Loads</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.title}>Your Trucks</Text>

          {trucks.map((truck) => (
            
              <TruckCard key={truck._id} data={truck} />
            
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
}
