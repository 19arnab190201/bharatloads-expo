import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
// import Geolocation from "@react-native-community/geolocation";
import axios from "axios";

const OLA_MAPS_API_KEY = "wKj1cjhXTNgtfV13C1ROJJkgySVxgvQmn34xh7kH";
const GEOCODE_API_URL = "https://api.olamaps.com/geocode";
const PLACES_API_URL = "https://api.olamaps.com/places";

const PickAndDrop = ({ onLocationSelect, onClose }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState({
    source: null,
    destination: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchCurrentLocation();
        } else {
          Alert.alert("Permission Denied", "Location permission is required.");
        }
      } else {
        fetchCurrentLocation();
      }
    };

    const fetchCurrentLocation = () => {
      // Geolocation.getCurrentPosition(
      //   (position) => {
      //     setCurrentLocation({
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //       latitudeDelta: 0.05,
      //       longitudeDelta: 0.05,
      //     });
      //   },
      //   (error) => {
      //     console.error("Location error:", error);
      //     Alert.alert("Error", "Unable to fetch location.");
      //   },
      //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      // );
    };

    requestLocationPermission();
  }, []);

  const geocode = async (placeName) => {
    try {
      const response = await axios.get(`${GEOCODE_API_URL}/forward`, {
        params: {
          api_key: OLA_MAPS_API_KEY,
          query: placeName,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(`${GEOCODE_API_URL}/reverse`, {
        params: {
          api_key: OLA_MAPS_API_KEY,
          lat: latitude,
          lon: longitude,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const searchPlaces = async (query) => {
    try {
      const response = await axios.get(PLACES_API_URL, {
        params: {
          api_key: OLA_MAPS_API_KEY,
          query: query,
        },
      });
      setSearchResults(response.data.places);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleMarkerDragEnd = async (e, type) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const placeName = await reverseGeocode(latitude, longitude);
    setSelectedLocations((prev) => ({
      ...prev,
      [type]: {
        placeName,
        coordinates: { latitude, longitude },
      },
    }));
  };

  const handleConfirm = () => {
    if (selectedLocations.source && selectedLocations.destination) {
      onLocationSelect(selectedLocations);
      onClose();
    } else {
      Alert.alert("Error", "Please select both source and destination.");
    }
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search for locations'
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchPlaces(text);
        }}
      />
      <MapView style={styles.map} initialRegion={currentLocation}>
        {selectedLocations.source && (
          <Marker
            coordinate={selectedLocations.source.coordinates}
            draggable
            onDragEnd={(e) => handleMarkerDragEnd(e, "source")}
          />
        )}
        {selectedLocations.destination && (
          <Marker
            coordinate={selectedLocations.destination.coordinates}
            draggable
            onDragEnd={(e) => handleMarkerDragEnd(e, "destination")}
          />
        )}
      </MapView>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => handleConfirm()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  map: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PickAndDrop;
