import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../utils/api";
import LoadCard from "../../../components/LoadCard";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hooks/useApi";

export default function Loads() {
  const [loads, setLoads] = useState([]);
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
  });

  const fetchLoads = async () => {
    try {
      const response = await api.get("/load");
      setLoads(response.data.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  useEffect(() => {
    console.log("loads", loads);
  }, [loads]);

  if (loads.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
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
}
