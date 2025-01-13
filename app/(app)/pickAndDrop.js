import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { WebView } from 'react-native-webview';

import { useRouter } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import { debounce } from 'lodash';
import { api } from "../../utils/api";

const PickAndDrop = ({
  variant = "default",
  onLocationSelect,
  onClose,
}) => {
  const router = useRouter();
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState({
    source: null,
    destination: null,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/locationsearch?query=${query}`);
        console.log(response.data.data);
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error("Error searching places:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(sourceQuery || destinationQuery);
    return () => debouncedSearch.cancel();
  }, [sourceQuery, destinationQuery]);

  const handleLocationSelect = (location, type) => {
    setSelectedLocations(prev => ({
      ...prev,
      [type]: location
    }));
    if (type === 'source') {
      setSourceQuery("");
    } else {
      setDestinationQuery("");
    }
    setSearchResults([]);
  };

  const handleConfirm = () => {
    if (selectedLocations.source && selectedLocations.destination) {
      router.back();
      onLocationSelect?.(selectedLocations);
    }
  };

  const getInitialRegion = () => {
    if (selectedLocations.source && selectedLocations.destination) {
      const { source, destination } = selectedLocations;
      const minLat = Math.min(source.coordinates.lat, destination.coordinates.lat);
      const maxLat = Math.max(source.coordinates.lat, destination.coordinates.lat);
      const minLng = Math.min(source.coordinates.lng, destination.coordinates.lng);
      const maxLng = Math.max(source.coordinates.lng, destination.coordinates.lng);

      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) * 1.5,
        longitudeDelta: (maxLng - minLng) * 1.5,
      };
    }

    return {
      latitude: 20.5937,
      longitude: 78.9629,
      latitudeDelta: 20,
      longitudeDelta: 20,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
      <View style={styles.mapContainer}>
      <WebView
        source={{ uri: 'https://maps.olakrutrim.com/docs/sdks/web-sdk/setup' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.iconContainer}>
              <View style={[styles.locationDot, { backgroundColor: '#4CAF50' }]} />
            </View>
            <TextInput
              style={[styles.searchInput, sourceQuery && styles.activeInput]}
              placeholder="Search Your Pickup Location"
              value={sourceQuery || selectedLocations.source?.name || ''}
              onChangeText={setSourceQuery}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.iconContainer}>
              <View style={[styles.locationDot, { backgroundColor: '#FF5252' }]} />
            </View>
            <TextInput
              style={[styles.searchInput, destinationQuery && styles.activeInput]}
              placeholder="Search Your Drop Location"
              value={destinationQuery || selectedLocations.destination?.name || ''}
              onChangeText={setDestinationQuery}
            />
          </View>
        </View>

        {loading && <ActivityIndicator style={styles.loader} />}

        {searchResults.length > 0 && (
          <FlatList
            style={styles.resultsList}
            data={searchResults}
            keyExtractor={(item) => item.name + item.description}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleLocationSelect(item, sourceQuery ? 'source' : 'destination')}
              >
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

   
      {selectedLocations.source && selectedLocations.destination && (
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  inputContainer: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#000',
  },
  activeInput: {
    color: '#007AFF',
  },
  loader: {
    marginTop: 10,
  },
  resultsList: {
    position: 'absolute',
    top: 160,
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    height: 600,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#00BFA5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PickAndDrop;