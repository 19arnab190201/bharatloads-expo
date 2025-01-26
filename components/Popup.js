import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthProvider';

const Popup = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  primaryAction,
  secondaryAction,
  loading = false,
  type = 'info' // 'info', 'success', 'error', 'warning'
}) => {
  const { colour } = useAuth();

  const getTypeColor = () => {
    switch(type) {
      case 'success':
        return '#14B8A6';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colour.background,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: getTypeColor(),
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: '#4B5563',
      marginBottom: 20,
      textAlign: 'center',
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    primaryButton: {
      backgroundColor: getTypeColor(),
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      flex: 1,
    },
    secondaryButton: {
      backgroundColor: '#E5E7EB',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      flex: 1,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    secondaryButtonText: {
      color: '#4B5563',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <Pressable 
          style={styles.modalContent}
          onPress={e => e.stopPropagation()}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            {secondaryAction && (
              <Pressable
                style={styles.secondaryButton}
                onPress={secondaryAction.onPress}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryAction.label}
                </Text>
              </Pressable>
            )}
            
            {primaryAction && (
              <Pressable
                style={styles.primaryButton}
                onPress={primaryAction.onPress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {primaryAction.label}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default Popup;
