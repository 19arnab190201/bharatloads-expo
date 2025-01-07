import * as SecureStore from "expo-secure-store";

// Custom hook for managing secure storage
export function useSecureStorage() {
  // Save to SecureStore
  const saveToSecureStore = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  };

  // Get from SecureStore
  const getFromSecureStore = async (key) => {
    return await SecureStore.getItemAsync(key);
  };

  // Delete from SecureStore
  const deleteFromSecureStore = async (key) => {
    await SecureStore.deleteItemAsync(key);
  };

  return { saveToSecureStore, getFromSecureStore, deleteFromSecureStore };
}
