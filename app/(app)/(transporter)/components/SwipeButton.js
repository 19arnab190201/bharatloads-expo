import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const SwipeButton = ({ 
  onSwipeComplete, 
  text = "Swipe to Post Load",
  isLoading = false,
  disabled = false,
  successText = "Load Posted Successfully!"
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [swipeSuccess, setSwipeSuccess] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const windowWidth = Dimensions.get('window').width;
  const buttonWidth = windowWidth - 40;
  const threshold = buttonWidth * 0.9;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [isLoading]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !isLoading && !swipeSuccess,
      onPanResponderMove: (_, gesture) => {
        if (!disabled && !isLoading && !swipeSuccess && gesture.dx > 0 && gesture.dx <= threshold) {
          pan.x.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (disabled || isLoading || swipeSuccess) return;

        if (gesture.dx >= threshold) {
          Animated.spring(pan.x, {
            toValue: threshold,
            useNativeDriver: false,
          }).start(() => {
            setIsCompleted(true);
            setSwipeSuccess(true);
            onSwipeComplete();
          });
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const getBackgroundColor = () => {
    if (disabled) return '#E8E8E8';
    if (swipeSuccess) return '#4ade80';
    return '#f1f5f9';
  };

  const styles = StyleSheet.create({
    container: {
      height: 60,
      backgroundColor: getBackgroundColor(),
      borderRadius: 30,
      justifyContent: 'center',
      marginVertical: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: disabled ? '#ccc' : swipeSuccess ? '#4ade80' : '#14B8A6',
    },
    swiper: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: disabled ? '#ccc' : '#14B8A6',
      position: 'absolute',
      left: 5,
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    text: {
      alignSelf: 'center',
      fontSize: 16,
      color: disabled ? '#999' : swipeSuccess ? '#15803d' : '#475569',
      fontWeight: '600',
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#e2e8f0',
      position: 'absolute',
      left: 0,
      zIndex: 0,
    },
  });

  const progressWidth = pan.x.interpolate({
    inputRange: [0, threshold],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14B8A6" />
        </View>
      )}
      
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressWidth,
          },
        ]}
      />
      
      <Animated.View
        style={[styles.swiper, { transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      >
        {swipeSuccess ? (
          <AntDesign name="check" size={24} color="white" />
        ) : (
          <AntDesign name="arrowright" size={24} color="white" />
        )}
      </Animated.View>
      
      <Text style={styles.text}>
        {swipeSuccess ? successText : isLoading ? "Posting Load..." : text}
      </Text>
    </Animated.View>
  );
};

export default SwipeButton; 