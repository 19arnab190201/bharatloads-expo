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
import { api } from "../../../utils/api";
import FormInput from "../../../components/FormInput";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import SearchIcon from "../../../assets/images/icons/Search";
import TruckCard from "../../../components/TruckCard";
import { normalize } from "../../../utils/functions";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../../components/Loader";
import LocationIcon from "../../../assets/images/icons/LocationIcon";

export default function Dashboard() {
  const { user, logout, colour } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();

  const userType = user?.userType;
  const [loads, setLoads] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const coins = loads.coins || 0;
  console.log("coinrfhrfhurys", coins);

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
      setIsLoading(true);
      const response = await api.get("/dashboard");
      setLoads(response.data.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrucks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/dashboard");
      setTrucks(response.data.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userType?.toLowerCase() === "transporter") {
        fetchLoads();
      } else {
        fetchTrucks();
      }
    }, [userType])
  );

  // console.log("colour", colour);

  if (isLoading) {
    return <Loader />;
  }

  if (userType?.toLowerCase() === "transporter") {
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
            backgroundColor: colour.placeHolderBackground2,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colour.inputBackground,
            padding: 10,
            paddingVertical: 18,
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => router.push("/(transporter)/searchTrucks")}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <SearchIcon />
            <Text style={{ color: colour.iconColor }}>Search Trucks...</Text>
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderColor: colour.iconColor,
              paddingLeft: 10,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}>
            <LocationIcon />
            <Text style={{ color: colour.iconColor }}>Location</Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.title}>Your Loads</Text>

          {loads.map((load) => (
            <LoadCard key={load._id} data={load} onLoadUpdated={fetchLoads} />
          ))}
        </View>

        {/* <TouchableOpacity
        onPress={() => router.push("/(app)/pickAndDrop")}
        style={styles.statCard}>
        <Text>PICK AND DROP</Text>
      </TouchableOpacity> */}
      </ScrollView>
    );
  } else if (userType?.toLowerCase() === "trucker") {
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
            backgroundColor: colour.placeHolderBackground2,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colour.inputBackground,
            padding: 10,
            paddingVertical: 18,
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => router.push("/(trucker)/searchLoad")}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <LoadingPoint />
            <Text style={{ color: colour.iconColor }}>Search Loads</Text>
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderColor: colour.iconColor,
              paddingLeft: 10,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}>
            <LocationIcon />
            <Text style={{ color: colour.iconColor }}>Location</Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.title}>Your Trucks</Text>

          {trucks.map((truck) => (
            <TruckCard
              key={truck._id}
              data={truck}
              onTruckUpdated={fetchTrucks}
            />
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
