import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions } from 'react-native';

const SwipeButton = ({ onSwipeComplete, text = "Swipe to Post Load" }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const windowWidth = Dimensions.get('window').width;
  const buttonWidth = windowWidth - 40; // Accounting for container padding
  const threshold = buttonWidth * 0.9; // 90% of button width

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0 && gesture.dx <= threshold) {
          pan.x.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx >= threshold) {
          Animated.spring(pan.x, {
            toValue: threshold,
            useNativeDriver: false,
          }).start(() => {
            setIsCompleted(true);
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

  const styles = StyleSheet.create({
    container: {
      height: 60,
      backgroundColor: '#E8E8E8',
      borderRadius: 30,
      justifyContent: 'center',
      marginVertical: 20,
      overflow: 'hidden',
    },
    swiper: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#14B8A6',
      position: 'absolute',
      left: 5,
      zIndex: 1,
    },
    text: {
      alignSelf: 'center',
      fontSize: 16,
      color: '#666',
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.swiper, { transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default SwipeButton; 