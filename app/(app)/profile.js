import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Switch } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import LoadInsurance from "../../assets/images/profile/LoadInsurance";
import TruckInsurance from "../../assets/images/profile/TruckInsurance";
import LoadFuelPurchase from "../../assets/images/profile/Loadfuelpurchase";

const Profile = () => {
  const { user, logout } = useAuth();

  const services = [
    { id: 1, title: 'Load Insurance', color: '#E6F7F3', iconColor: '#00B087', icon: LoadInsurance },
    { id: 2, title: 'Load Insurance', color: '#FFF6E7', iconColor: '#FFA500', icon: TruckInsurance },
    { id: 3, title: 'Load Fuel Purchase', color: '#FFE9E9', iconColor: '#FF4444', icon: LoadFuelPurchase },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button and coins */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text>←</Text>
        </TouchableOpacity>
        <View style={styles.coinsContainer}>
          <Text>🪙 120</Text>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={require('../../assets/images/profile/pp.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Larry Walter</Text>
        <Text style={styles.role}>Transporter</Text>
      </View>

      {/* User Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>Larry Walter</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Phone Number</Text>
          <Text style={styles.detailValue}>+91 9612378903</Text>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Offers & Services</Text>
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <TouchableOpacity 
              key={service.id} 
              style={[styles.serviceCard, { backgroundColor: service.color }]}
            >
              <service.icon />
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* More Options */}
      <View style={styles.moreSection}>
        <Text style={styles.sectionTitle}>More</Text>
        
        <TouchableOpacity style={styles.optionItem}>
          <Text>Refer & Earn</Text>
          <Text>→</Text>
        </TouchableOpacity>

        <View style={styles.optionItem}>
          <Text>Dark Mode</Text>
          <Switch />
        </View>

        <TouchableOpacity style={styles.optionItem}>
          <Text>Help & Support</Text>
          <Text>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={logout}>
          <Text style={styles.logoutText}>Log out</Text>
          <Text>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  coinsContainer: {
    backgroundColor: '#FFF6E7',
    padding: 8,
    borderRadius: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  role: {
    color: '#666',
    marginTop: 4,
  },
  detailsSection: {
    padding: 16,
    backgroundColor: '#F8F9FB',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  detailItem: {
    marginVertical: 8,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
  },
  detailValue: {
    fontSize: 16,
    marginTop: 4,
  },
  servicesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  moreSection: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoutText: {
    color: '#FF4444',
  },
});

export default Profile;
