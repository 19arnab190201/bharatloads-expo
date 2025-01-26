import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../utils/api";
import LoadCard from "../../../components/LoadCard";
import { useAuth } from "../../../context/AuthProvider";
import TruckCard from "../../../components/TruckCard";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../../components/Loader";
import { normalize } from "../../../utils/functions";

//USED AS LIST TRUCKS IF USER IS TRUCKER
const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { colour } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colour.background,
      paddingTop: normalize(16),
    },
    tabContainer: {
      flexDirection: "row",
      paddingHorizontal: normalize(16),
      marginBottom: normalize(16),
      gap: normalize(12),
    },
    tab: {
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(8),
      borderRadius: normalize(24),
      borderWidth: 1,
      borderColor: "#E2E8F0",
      backgroundColor: "#fff",
    },
    activeTab: {
      backgroundColor: colour.primaryColor,
      borderColor: colour.primaryColor,
    },
    tabText: {
      fontSize: normalize(14),
      color: "#64748B",
      fontWeight: "500",
    },
    activeTabText: {
      color: "#fff",
    },
    content: {
      flex: 1,
      paddingHorizontal: normalize(16),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#fff',
      minHeight: 400,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: normalize(24),
    },
    emptyText: {
      fontSize: normalize(16),
      color: "#64748B",
      textAlign: "center",
      marginTop: normalize(12),
    },
    refreshButton: {
      marginTop: normalize(16),
      paddingHorizontal: normalize(24),
      paddingVertical: normalize(12),
      backgroundColor: colour.primaryColor,
      borderRadius: normalize(8),
    },
    refreshButtonText: {
      color: "#fff",
      fontSize: normalize(14),
      fontWeight: "600",
    },
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

  const filteredLoads = useMemo(() => {
    const now = new Date();
    switch (activeTab) {
      case "active":
        return loads.filter((load) => new Date(load.expiresAt) > now);
      case "expired":
        return loads.filter((load) => new Date(load.expiresAt) <= now);
      default:
        return loads;
    }
  }, [loads, activeTab]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Loader />
        </View>
      );
    }

    if (!filteredLoads.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "all"
              ? "You haven't posted any loads yet."
              : activeTab === "active"
              ? "No active loads found."
              : "No expired loads found."}
          </Text>
          <Pressable style={styles.refreshButton} onPress={fetchLoads}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        {filteredLoads.map((load, index) => (
          <View key={index} style={{ marginVertical: 0 }}>
            <LoadCard key={load._id} data={load} onLoadUpdated={fetchLoads} />
          </View>
        ))}
        <View style={{ paddingBottom: 40 }} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}>
            All Loads
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "expired" && styles.activeTab]}
          onPress={() => setActiveTab("expired")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "expired" && styles.activeTabText,
            ]}>
            Expired
          </Text>
        </Pressable>
      </View>

      {renderContent()}
    </View>
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
