import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useAuth } from '../../../context/AuthProvider';
import LoadingPoint from '../../../assets/images/icons/LoadingPoint';
import { MaterialIcons } from '@expo/vector-icons';

const BidCard = ({ bid }) => {
  const { colour } = useAuth();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F8FAFC',
    },
    nameContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 2,
    },
    role: {
      fontSize: 14,
      color: '#64748B',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFB800',
      marginRight: 4,
    },
    materialImage: {
      width: 56,
      height: 56,
      marginRight: 12,
      backgroundColor: '#F8FAFC',
      borderRadius: 8,
    },
    materialContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    materialInfo: {
      flex: 1,
    },
    materialType: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 4,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    locationIcon: {
      marginRight: 8,
    },
    locationText: {
      fontSize: 14,
      color: '#64748B',
    },
    specs: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 24,
      marginTop: 16,
      marginBottom: 20,
    },
    specItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    specIcon: {
      marginRight: 6,
    },
    specText: {
      fontSize: 14,
      color: '#64748B',
    },
    priceContainer: {
      marginBottom: 16,
    },
    price: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 2,
    },
    pricePerTonne: {
      fontSize: 14,
      color: '#64748B',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: '#FFF1F2',
    },
    chatButton: {
      backgroundColor: colour.primaryColor,
    },
    buttonText: (variant) => ({
      fontSize: 15,
      fontWeight: '600',
      color: variant === 'close' ? '#DC2626' : '#fff',
    }),
    timestamp: {
      position: 'absolute',
      right: 16,
      top: 16,
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    timestampText: {
      fontSize: 12,
      color: '#64748B',
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{bid.name}</Text>
            <Text style={styles.role}>{bid.role}</Text>
          </View>
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{bid.rating}</Text>
          <Text style={styles.ratingText}>★</Text>
        </View>
      </View>

      <View style={styles.materialContainer}>
        <View style={styles.materialImage} />
        <View style={styles.materialInfo}>
          <Text style={styles.materialType}>IRON SHEETS</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons
              name="circle"
              size={8}
              color="#14B8A6"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{bid.source}</Text>
          </View>
          <View style={styles.locationContainer}>
            <MaterialIcons
              name="circle"
              size={8}
              color="#F43F5E"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{bid.destination}</Text>
          </View>
        </View>
      </View>

      <View style={styles.specs}>
        <View style={styles.specItem}>
          <MaterialIcons
            name="shopping-bag"
            size={18}
            color="#64748B"
            style={styles.specIcon}
          />
          <Text style={styles.specText}>40 Tonnes</Text>
        </View>
        <View style={styles.specItem}>
          <MaterialIcons
            name="local-shipping"
            size={18}
            color="#64748B"
            style={styles.specIcon}
          />
          <Text style={styles.specText}>Trailer</Text>
        </View>
        <View style={styles.specItem}>
          <MaterialIcons
            name="tire-repair"
            size={18}
            color="#64748B"
            style={styles.specIcon}
          />
          <Text style={styles.specText}>14 Wheels</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹37,000</Text>
        <Text style={styles.pricePerTonne}>₹1,800/Tonne</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.closeButton]}>
          <Text style={styles.buttonText('close')}>Close Bid</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.chatButton]}>
          <Text style={styles.buttonText('chat')}>Chat</Text>
        </Pressable>
      </View>

      <View style={styles.timestamp}>
        <Text style={styles.timestampText}>17 Jan 2024, 07:51 PM</Text>
      </View>
    </View>
  );
};

const Bids = () => {
  const { colour } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      paddingTop: 16,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 12,
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: '#fff',
    },
    activeTab: {
      backgroundColor: colour.primaryColor,
      borderColor: colour.primaryColor,
    },
    tabText: {
      fontSize: 14,
      color: '#64748B',
      fontWeight: '500',
    },
    activeTabText: {
      color: '#fff',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
  });

  // Dummy data - replace with API data later
  const bids = [
    {
      id: 1,
      name: 'Larry Walter',
      role: 'Truck Owner',
      rating: 5.0,
      truckId: 'HYVA (JH728292)',
      source: 'Sakchi, Jamshedpur, JH',
      destination: 'Purulia, WB',
      bodyType: 'Open Full Body',
      wheels: 14,
      capacity: 40,
      price: '37,000',
    },
    // Add more dummy bids as needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Bids
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
          onPress={() => setActiveTab('accepted')}>
          <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>
            Accepted
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'awaiting' && styles.activeTab]}
          onPress={() => setActiveTab('awaiting')}>
          <Text style={[styles.tabText, activeTab === 'awaiting' && styles.activeTabText]}>
            Awaiting Response
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {bids.map(bid => (
          <BidCard key={bid.id} bid={bid} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Bids;
