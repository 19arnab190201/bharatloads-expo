import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Platform,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import TruckCard from "../../../components/TruckCard";
import { api } from "../../../utils/api";
import debounce from "lodash/debounce";
import { normalize } from "../../../utils/functions";
import * as Location from 'expo-location';

const FILTER_OPTIONS = {
  vehicleBodyType: {
    label: "Vehicle Body Type",
    options: [
      { label: "Open Body", value: "OPEN_BODY" },
      { label: "Closed Body", value: "CLOSED_BODY" },
    ],
  },
  truckType: {
    label: "Truck Type",
    options: [
      { label: "Truck", value: "TRUCK" },
      { label: "Trailer", value: "TRAILER" },
      { label: "Hyva", value: "HYVA" },
    ],
  },
  truckBodyType: {
    label: "Truck Body Type",
    options: [
      { label: "Open Full Body", value: "OPEN_FULL_BODY" },
      { label: "Open Half Body", value: "OPEN_HALF_BODY" },
      { label: "Full Closed Body", value: "FULL_CLOSED_BODY" },
    ],
  },
};

const SearchTrucks = () => {
  const { colour } = useAuth();
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({
    vehicleBodyType: "",
    truckType: "",
    truckBodyType: "",
    radius: "100",
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Debounced function for location search
  const debouncedLocationSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setLocations([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/locationsearch?query=${query}`);
        console.log(response.data)
        setLocations(response.data.data);
        setShowLocationDropdown(true);
      } catch (error) {
        console.error("Location search error:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    //Console log data
    console.log("locations", locations);
  }, [locations]);

  // Get user's current location when component mounts
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        
        // Fetch trucks near user's location
        fetchTrucks({
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  // Handle search input changes
  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedLocationSearch(text);
  };

  // Fetch trucks based on selected location and filters
  const fetchTrucks = async (location) => {
    if (!location?.coordinates) return;

    try {
      setLoading(true);
      const { latitude, longitude } = location.coordinates;
      const queryParams = new URLSearchParams({
        latitude,
        longitude,
        radius: 100, // 100km radius
        ...filters,
      }).toString();

      const response = await api.get(`/truck/nearby?${queryParams}`);
      setTrucks(response.data.data);
    } catch (error) {
      console.error("Fetch trucks error:", error);
      setTrucks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearch(location.name);
    setShowLocationDropdown(false);
    fetchTrucks({
      coordinates: {
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng
      }
    });
  };

  const FilterPicker = ({ isVisible, onClose, filterKey }) => {
    const options = FILTER_OPTIONS[filterKey]?.options || [];
    const currentLabel =
      options.find((opt) => opt.value === filters[filterKey])?.label ||
      FILTER_OPTIONS[filterKey]?.label ||
      "";

    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {FILTER_OPTIONS[filterKey]?.label}
            </Text>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    filters[filterKey] === option.value &&
                      styles.selectedOption,
                  ]}
                  onPress={() => {
                    setFilters((prev) => ({
                      ...prev,
                      [filterKey]: option.value,
                    }));
                    onClose();
                    if (selectedLocation) {
                      fetchTrucks(selectedLocation);
                    }
                  }}>
                  <Text
                    style={[
                      styles.optionText,
                      filters[filterKey] === option.value &&
                        styles.selectedOptionText,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FormInput
          Icon={LoadingPoint}
          placeholder='Search location'
          name='origin'
          value={search}
          onChangeText={handleSearchChange}
          onFocus={() => setShowLocationDropdown(true)}
        />

        {/* Location suggestions dropdown */}
        {showLocationDropdown && locations.length > 0 && (
          <View style={styles.dropdownContainer}>
            {locations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleLocationSelect(location)}>
                <Text numberOfLines={1} style={styles.dropdownText}>
                  {location.name}
                </Text>
                <Text numberOfLines={2} style={styles.dropdownSubText}>
                  {location.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Filter buttons */}
      {/* <ScrollView
        horizontal
        style={styles.filtersContainer}
        showsHorizontalScrollIndicator={false}>
        {Object.keys(FILTER_OPTIONS).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterButton,
              filters[key] ? styles.activeFilter : null,
            ]}
            onPress={() => setActiveFilter(key)}>
            <Text style={styles.filterButtonText}>
              {filters[key]
                ? FILTER_OPTIONS[key].options.find(
                    (opt) => opt.value === filters[key]
                  )?.label
                : FILTER_OPTIONS[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Filter picker modal */}
      {activeFilter && (
        <FilterPicker
          isVisible={!!activeFilter}
          onClose={() => setActiveFilter(null)}
          filterKey={activeFilter}
        />
      )}

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <Text style={styles.messageText}>Loading...</Text>
        ) : trucks.length === 0 ? (
          <Text style={styles.messageText}>No nearby trucks found</Text>
        ) : (
          trucks.map((truck) => <TruckCard key={truck._id} data={truck} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    zIndex: 2,
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
  dropdownSubText: {
    fontSize: 14,
    color: "#999",
  },
  filtersContainer: {
    flexDirection: "row",
    marginVertical: 15,
    zIndex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilter: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#007AFF20",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    paddingHorizontal: normalize(4),
    flex: 1,
  },
  messageText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default SearchTrucks;
