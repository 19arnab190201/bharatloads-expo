import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { WebView } from "react-native-webview";

import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { api } from "../../utils/api";

const PickAndDrop = ({
  variant = "default",
  onLocationSelect = () => {},
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

  if (variant == "searvh") {
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search Your Pickup Location'
        value={selectedLocations.source?.name || sourceQuery || ""}
        onChangeText={setSourceQuery}
      />
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search Your Pickup Location'
          value={selectedLocations.source?.name || sourceQuery || ""}
          onChangeText={setSourceQuery}
        />

        <TextInput
          style={styles.searchInput}
          placeholder='Search Your Drop Location'
          value={destinationQuery || selectedLocations.destination?.name || ""}
          onChangeText={setDestinationQuery}
        />
      </View>

      <View>
        {loading ? (
          <ActivityIndicator size='large' color='#000' />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (sourceQuery) {
                    setSelectedLocations({
                      ...selectedLocations,
                      source: item,
                    });
                    setSourceQuery(item.name);
                    setSearchResults([]);
                  } else {
                    setSelectedLocations({
                      ...selectedLocations,
                      destination: item,
                    });
                    setDestinationQuery(item.name);
                    setSearchResults([]);
                  }
                }}>
                <View
                  style={{
                    padding: 20,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f5f5f5",
                  }}>
                  <Text>{item.name}</Text>
                  <Text style={{ color: "#999" }}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        {searchResults && searchResults.length > 0 && (
          <Pressable
            onPress={() => {}}
            style={{
              padding: 20,
              backgroundColor: "#f5f5f5",
              alignItems: "center",
            }}>
            <Text>Confirm</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
  },
});

export default PickAndDrop;
