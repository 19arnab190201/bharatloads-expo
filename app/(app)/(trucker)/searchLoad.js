import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import { api } from "../../../utils/api";
import debounce from "lodash/debounce";
import { normalize } from "../../../utils/functions";
import * as Location from "expo-location";
import SearchLoadCard from "../../../components/SearchLoadCard";
import TruckSelectionModal from "../../../components/TruckSelectionModal";

const FILTER_OPTIONS = {
  materialType: {
    label: "Material Type",
    options: [
      { label: "Iron Sheet", value: "IRON_SHEET" },
      { label: "Industrial Equipment", value: "INDUSTRIAL_EQUIPMENT" },
      { label: "Cement", value: "CEMENT" },
      { label: "Coal", value: "COAL" },
      { label: "Steel", value: "STEEL" },
      // Add other material types as needed
    ],
  },
  vehicleType: {
    label: "Vehicle Type",
    options: [
      { label: "Truck", value: "TRUCK" },
      { label: "Trailer", value: "TRAILER" },
      { label: "Hyva", value: "HYVA" },
    ],
  },
  vehicleBodyType: {
    label: "Vehicle Body Type",
    options: [
      { label: "Open Body", value: "OPEN_BODY" },
      { label: "Closed Body", value: "CLOSED_BODY" },
    ],
  },
};

const BidModal = ({ visible, onClose, load, truck, onSubmit }) => {
  const { colour } = useAuth();
  const [biddedAmount, setBiddedAmount] = useState({
    total: "",
    advanceAmount: "0",
    dieselAmount: "",
  });

  useEffect(() => {
    if (load && visible) {
      // Pre-fill with load's offered amount
      setBiddedAmount({
        total: load.offeredAmount.total.toString(),
        advanceAmount: load.offeredAmount.advanceAmount.toString(),
        dieselAmount: load.offeredAmount.dieselAmount.toString(),
      });
    }
  }, [load, visible]);

  const validateAmount = () => {
    const total = parseFloat(biddedAmount.total);
    const advance = parseFloat(biddedAmount.advanceAmount);
    const diesel = parseFloat(biddedAmount.dieselAmount);

    if (isNaN(total) || total <= 0) {
      Alert.alert("Error", "Please enter a valid total amount");
      return false;
    }

    if (isNaN(advance) || advance < 0) {
      Alert.alert("Error", "Advance must be greater than 0");
      return false;
    }

    if (isNaN(diesel) || diesel < 0) {
      Alert.alert("Error", "Please enter a valid diesel amount");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateAmount()) return;
    onSubmit(biddedAmount);
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.bidModalContent}>
          <Text style={styles.bidModalTitle}>Place Your Bid</Text>

          <View style={styles.bidInputContainer}>
            <Text style={styles.bidInputLabel}>Total Amount (₹)</Text>
            <TextInput
              style={styles.bidInput}
              value={biddedAmount.total}
              onChangeText={(text) =>
                setBiddedAmount((prev) => ({ ...prev, total: text }))
              }
              keyboardType='numeric'
              placeholder='Enter total amount'
            />
          </View>

          <View style={styles.bidInputContainer}>
            <Text style={styles.bidInputLabel}>Advance (₹)</Text>
            <TextInput
              style={styles.bidInput}
              value={biddedAmount.advanceAmount}
              onChangeText={(text) =>
                setBiddedAmount((prev) => ({ ...prev, advanceAmount: text }))
              }
              keyboardType='numeric'
              placeholder='Enter advance amount'
            />
          </View>

          <View style={styles.bidInputContainer}>
            <Text style={styles.bidInputLabel}>Diesel Amount (₹)</Text>
            <TextInput
              style={styles.bidInput}
              value={biddedAmount.dieselAmount}
              onChangeText={(text) =>
                setBiddedAmount((prev) => ({ ...prev, dieselAmount: text }))
              }
              keyboardType='numeric'
              placeholder='Enter diesel amount'
            />
          </View>

          {load && (
            <Text style={styles.originalAmount}>
              Original offered amount: ₹{load.offeredAmount.total}
              {"\n"}(Advance: {load.offeredAmount.advanceAmount} | Diesel: ₹
              {load.offeredAmount.dieselAmount})
            </Text>
          )}

          <View style={styles.bidModalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !biddedAmount.total && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!biddedAmount.total}>
              <Text style={styles.submitButtonText}>Submit Bid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SearchLoad = () => {
  const { colour } = useAuth();
  const [loads, setLoads] = useState([]);
  const [sourceSearch, setSourceSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [sourceLocations, setSourceLocations] = useState([]);
  const [destinationLocations, setDestinationLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [filters, setFilters] = useState({
    materialType: "",
    vehicleType: "",
    vehicleBodyType: "",
    radius: "100",
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showTruckSelector, setShowTruckSelector] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [loadingTrucks, setLoadingTrucks] = useState(false);

  // Debounced functions for location search
  const debouncedSourceSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setSourceLocations([]);
        return;
      }

      try {
        const response = await api.get(`/locationsearch?query=${query}`);
        setSourceLocations(response.data.data);
        setShowSourceDropdown(true);
      } catch (error) {
        console.error("Source location search error:", error);
        setSourceLocations([]);
      }
    }, 500),
    []
  );

  const debouncedDestinationSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 3) {
        setDestinationLocations([]);
        return;
      }

      try {
        const response = await api.get(`/locationsearch?query=${query}`);
        setDestinationLocations(response.data.data);
        setShowDestinationDropdown(true);
      } catch (error) {
        console.error("Destination location search error:", error);
        setDestinationLocations([]);
      }
    }, 500),
    []
  );

  // Get user's current location when component mounts
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userLoc);

        // Fetch loads near user's location initially
        fetchLoads({
          sourceCoords: userLoc,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  // Handle search input changes
  const handleSourceSearchChange = (text) => {
    setSourceSearch(text);
    debouncedSourceSearch(text);
  };

  const handleDestinationSearchChange = (text) => {
    setDestinationSearch(text);
    debouncedDestinationSearch(text);
  };

  // Fetch loads based on selected locations and filters
  const fetchLoads = async ({ sourceCoords, destCoords } = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        radius: filters.radius,
        ...filters,
      });

      if (sourceCoords) {
        queryParams.append("sourceLatitude", sourceCoords.latitude);
        queryParams.append("sourceLongitude", sourceCoords.longitude);
      }

      if (destCoords) {
        queryParams.append("destinationLatitude", destCoords.latitude);
        queryParams.append("destinationLongitude", destCoords.longitude);
      }

      const response = await api.get(`/load/nearby?${queryParams}`);
      setLoads(response.data.data);
    } catch (error) {
      console.error("Fetch loads error:", error);
      setLoads([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selections
  const handleSourceSelect = (location) => {
    setSelectedSource(location);
    setSourceSearch(location.name);
    setShowSourceDropdown(false);
    fetchLoads({
      sourceCoords: {
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng,
      },
      destCoords: selectedDestination
        ? {
            latitude: selectedDestination.coordinates.lat,
            longitude: selectedDestination.coordinates.lng,
          }
        : null,
    });
  };

  const handleDestinationSelect = (location) => {
    setSelectedDestination(location);
    setDestinationSearch(location.name);
    setShowDestinationDropdown(false);
    fetchLoads({
      sourceCoords: selectedSource
        ? {
            latitude: selectedSource.coordinates.lat,
            longitude: selectedSource.coordinates.lng,
          }
        : null,
      destCoords: {
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng,
      },
    });
  };

  // Fetch user's trucks
  const fetchUserTrucks = async () => {
    try {
      setLoadingTrucks(true);
      const response = await api.get("/truck");
      setTrucks(response.data.data);
    } catch (error) {
      console.error("Fetch trucks error:", error);
      alert("Failed to load trucks. Please try again.");
    } finally {
      setLoadingTrucks(false);
    }
  };

  const handlePlaceBid = (load) => {
    setSelectedLoad(load);
    fetchUserTrucks();
    setShowTruckSelector(true);
  };

  const handleTruckSelect = (truck) => {
    setSelectedTruck(truck);
    setShowTruckSelector(false);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (biddedAmount) => {
    try {
      const response = await api.post("/bid", {
        loadId: selectedLoad._id,
        truckId: selectedTruck._id,
        bidType: "LOAD_BID",
        biddedAmount: {
          total: parseFloat(biddedAmount.total),
          advanceAmount: parseFloat(biddedAmount.advanceAmount),
          dieselAmount: parseFloat(biddedAmount.dieselAmount),
        },
      });

      Alert.alert("Success", "Bid placed successfully!");
      setShowBidModal(false);
      if (selectedSource) {
        fetchLoads({
          sourceCoords: selectedSource,
        });
      } else if (userLocation) {
        fetchLoads({ coordinates: userLocation });
      }
    } catch (error) {
      console.error("Place bid error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to place bid"
      );
    }
  };

  const FilterPicker = ({ isVisible, onClose, filterKey }) => {
    const options = FILTER_OPTIONS[filterKey]?.options || [];

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
                    if (selectedSource) {
                      fetchLoads({
                        sourceCoords: selectedSource,
                      });
                    } else if (userLocation) {
                      fetchLoads({ coordinates: userLocation });
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
        {/* Source Search */}
        <FormInput
          Icon={LoadingPoint}
          placeholder='Search source location'
          name='source'
          value={sourceSearch}
          onChangeText={handleSourceSearchChange}
          onFocus={() => setShowSourceDropdown(true)}
        />

        {/* Source Location suggestions dropdown */}
        {showSourceDropdown && sourceLocations.length > 0 && (
          <View style={styles.dropdownContainer}>
            {sourceLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSourceSelect(location)}>
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

        {/* Destination Search */}
        <FormInput
          Icon={LoadingPoint}
          placeholder='Search destination location'
          name='destination'
          value={destinationSearch}
          onChangeText={handleDestinationSearchChange}
          onFocus={() => setShowDestinationDropdown(true)}
          containerStyle={styles.destinationInput}
        />

        {/* Destination Location suggestions dropdown */}
        {showDestinationDropdown && destinationLocations.length > 0 && (
          <View style={styles.dropdownContainer}>
            {destinationLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleDestinationSelect(location)}>
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

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <Text style={styles.messageText}>Loading...</Text>
        ) : loads.length === 0 ? (
          <Text style={styles.messageText}>No nearby loads found</Text>
        ) : (
          loads.map((load) => (
            <SearchLoadCard
              key={load._id}
              data={load}
              onBidPress={() => handlePlaceBid(load)}
              matchType={load.matchType}
            />
          ))
        )}
      </ScrollView>

      <TruckSelectionModal
        visible={showTruckSelector}
        onClose={() => setShowTruckSelector(false)}
        trucks={trucks}
        onSelect={handleTruckSelect}
        loading={loadingTrucks}
      />

      <BidModal
        visible={showBidModal}
        onClose={() => setShowBidModal(false)}
        load={selectedLoad}
        truck={selectedTruck}
        onSubmit={handleBidSubmit}
      />
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
  bidModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  bidModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bidInputContainer: {
    marginBottom: 16,
  },
  bidInputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  bidInput: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  originalAmount: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    marginBottom: 16,
  },
  bidModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  destinationInput: {
    marginTop: 10,
  },
});

export default SearchLoad;
