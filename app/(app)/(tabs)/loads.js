import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../utils/api";
import LoadCard from "../../../components/LoadCard";
import { useAuth } from "../../../context/AuthProvider";
import TruckCard from "../../../components/TruckCard";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../../components/Loader";

//USED AS LIST TRUCKS IF USER IS TRUCKER
const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colour } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colour.background,
    },
    fab: {
      position: "absolute",
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
      right: 16,
      bottom: 16,
      backgroundColor: "#14B8A6",
      borderRadius: 14,
      elevation: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#fff',
      minHeight: 400,
    }
  });

  const fetchLoads = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/load");
      setLoads(response.data.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLoads();
    }, [])
  );

  useEffect(() => {
  }, [loads]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {loads?.length > 0 &&
        loads.map((load, index) => (
          <View key={index} style={{ marginVertical: 0 }}>
            <LoadCard key={load._id} data={load} />
          </View>
        ))}
      <View
        style={{
          paddingBottom: 40,
        }}></View>
    </ScrollView>
  );
};

const Trucks = ({ user, colour }) => {
  const [trucks, setTrucks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colour.background,
    },
    fab: {
      position: "absolute",
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
      right: 16,
      bottom: 16,
      backgroundColor: "#14B8A6",
      borderRadius: 14,
      elevation: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#fff',
      minHeight: 400,
    }
  });

  const fetchTrucks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/truck");
      setTrucks(response.data.data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTrucks();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {trucks?.length > 0 &&
        trucks.map((load, index) => (
          <View key={index} style={{ marginVertical: 0 }}>
            <TruckCard key={load._id} data={load} />
          </View>
        ))}
      <View
        style={{
          paddingBottom: 40,
        }}></View>
    </ScrollView>
  );
};

const ListUserAssets = () => {
  const { user, colour } = useAuth();


  if (user?.userType == "TRUCKER") {
    return <Trucks user={user} colour={colour} />;
  }
  return <Loads />;
};

export default ListUserAssets;
