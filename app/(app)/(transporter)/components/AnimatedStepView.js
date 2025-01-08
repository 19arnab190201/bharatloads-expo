import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedStepView = ({ children, direction, isActive }) => {
  const slideAnim = useRef(new Animated.Value(direction === 'forward' ? width : -width)).current;

  useEffect(() => {
    if (isActive) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      slideAnim.setValue(direction === 'forward' ? width : -width);
    }
  }, [isActive]);

  return (
    <Animated.View
      style={{
        width: '100%',
        position: 'absolute',
        transform: [{ translateX: slideAnim }],
      }}>
      {children}
    </Animated.View>
  );
};

export default AnimatedStepView; 