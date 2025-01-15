import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { api } from '../../utils/api';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthProvider';

export default function UserSelect() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();

  const startChat = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to start a chat');
      }

      setLoading(true);
      setError(null);
      
      // Create or get existing chat
      const response = await api.post('/chat', {
        userId: userId.trim()
      });

      if (response.data?.success && response.data?.chat?._id) {
        // Navigate to the chat
        router.push({
          pathname: '/(app)/chat/[id]',
          params: { id: response.data.chat._id }
        });
      } else {
        console.error('Unexpected response:', response.data);
        throw new Error('Invalid chat response from server');
      }
    } catch (err) {
      console.error('Error starting chat:', err);
      setError(err.response?.data?.message || err.message || 'Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter User ID to Chat With</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Enter user ID..."
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={startChat}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Start Chat</Text>
          )}
        </TouchableOpacity>
        
        {/* Debug info */}
        <View style={styles.debugInfo}>
          <Text>Debug Info:</Text>
          <Text>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
          <Text>Current User ID: {currentUser?._id || 'Not found'}</Text>
          <Text>API URL: {process.env.EXPO_PUBLIC_API_URL}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
}); 