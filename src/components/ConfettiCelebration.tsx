import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
  colors?: string[];
  count?: number;
  duration?: number;
}

const { width, height } = Dimensions.get('window');

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  trigger,
  onComplete,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'],
  count = 200,
  duration = 3000,
}) => {
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (trigger && confettiRef.current) {
      confettiRef.current.start();
      
      // Call onComplete after animation finishes
      if (onComplete) {
        const timer = setTimeout(onComplete, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [trigger, onComplete, duration]);

  if (!trigger) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={count}
        origin={{ x: width / 2, y: -10 }}
        autoStart={false}
        fadeOut={true}
        fallSpeed={3000}
        colors={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
