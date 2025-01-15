import { View, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import UserSelect from '../../../components/chat/UserSelect';
import { useAuth } from '../../../context/AuthProvider';

export default function NewChat() {
  const { colour } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colour.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <UserSelect />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
}); 