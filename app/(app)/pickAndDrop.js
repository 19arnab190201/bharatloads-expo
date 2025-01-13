import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const OLA_MAPS_API_KEY = "wKj1cjhXTNgtfV13C1ROJJkgySVxgvQmn34xh7kH";
const GEOCODE_API_URL = "https://api.olamaps.com/geocode";
const PLACES_API_URL = "https://api.olamaps.com/places";

const PickAndDrop = ({
  variant = "default", // default, sourceonly, destinationonly, search
  onLocationSelect,
  onClose,
}) => {
  const [region, setRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need location permissions to proceed."
          );
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchCurrentLocation();
  }, []);

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

  if (!region) {
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

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
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
