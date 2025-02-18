import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthProvider";
import LoadInsurance from "../../assets/images/profile/LoadInsurance";
import TruckInsurance from "../../assets/images/profile/TruckInsurance";
import LoadFuelPurchase from "../../assets/images/profile/Loadfuelpurchase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import Coins from "../../components/Coins";
import { Linking } from "react-native";

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const navigation = useNavigation();
  const fetchUser = async () => {
    const response = await api.get("/user/profile");
    console.log("response", response.data);
    setUser(response.data.user);
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: logout,
        style: "destructive",
      },
    ]);
  };

  const services = [
    {
      id: 1,
      title: "Load Insurance",
      color: "#E6F7F3",
      iconColor: "#00B087",
      icon: LoadInsurance,
    },
    {
      id: 2,
      title: "Truck Insurance",
      color: "#FFF6E7",
      iconColor: "#FFA500",
      icon: TruckInsurance,
    },
    {
      id: 3,
      title: "Load Fuel Purchase",
      color: "#FFE9E9",
      iconColor: "#FF4444",
      icon: LoadFuelPurchase,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with back button and coins */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          {console.log("use22r", user)}
          <Coins coins={user?.BlCoins} />
        </View>

        <View style={styles.mainContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={require("../../assets/images/profile/pp.jpg")}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user?.name || ""}</Text>
            <Text style={styles.role}>{user?.userType}</Text>
          </View>

          {/* User Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{user?.name || ""}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>
                +{user?.mobile?.countryCode || ""} {user?.mobile?.phone || ""}
              </Text>
            </View>
            {user?.userType !== "TRUCKER" && (
              <>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Company Name</Text>
                  <Text style={styles.detailValue}>
                    {user?.companyName || ""}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Company Location</Text>
                  <Text style={styles.detailValue}>
                    {user?.companyLocation || ""}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Services Section */}
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>
              Offers & Services{" "}
              <Text
                style={{ color: "gray", fontSize: 12, fontStyle: "italic" }}>
                {" "}
                (Coming Soon)
              </Text>
            </Text>
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    { backgroundColor: service.color },
                  ]}>
                  <service.icon />
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* More Options */}
          <View style={styles.moreSection}>
            <Text style={styles.sectionTitle}>More</Text>

            <TouchableOpacity
              disabled={true}
              style={{ ...styles.optionItem, opacity: 0.3 }}>
              <Text>Refer & Earn (Coming Soon)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL("https://wa.me/+919942588783")}
              style={styles.optionItem}>
              <Text>Help & Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  mainContent: {
    paddingHorizontal: 26,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  role: {
    color: "#666",
    marginTop: 4,
  },
  detailsSection: {
    padding: 16,
    backgroundColor: "#F8F9FB",
    borderRadius: 12,
  },
  detailItem: {
    marginVertical: 8,
  },
  detailLabel: {
    color: "#666",
    fontSize: 12,
  },
  detailValue: {
    fontSize: 16,
    marginTop: 4,
  },
  servicesSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  moreSection: {
    paddingVertical: 16,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  logoutText: {
    color: "#FF4444",
  },
});

export default Profile;
