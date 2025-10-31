import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

interface LevelUpCelebrationProps {
  level: number;
  onAnimationComplete: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  level,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Trigger confetti
    if (confettiRef.current) {
      confettiRef.current.start();
    }

    // Animation sequence
    Animated.sequence([
      // Entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      // Rotate celebration
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(2000),
      // Exit
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: width / 2, y: -10 }}
        autoStart={false}
        fadeOut
        fallSpeed={3000}
      />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <Ionicons name="trophy" size={80} color="#FFD700" />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>🎊 Level Up! 🎊</Text>
          <Text style={styles.level}>Level {level}</Text>
          <Text style={styles.subtitle}>Harikasın! Yeni seviye!</Text>
        </View>

        <View style={styles.sparkles}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.sparkle}>⭐</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10000,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8DC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F2937',
  },
  level: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  sparkles: {
    flexDirection: 'row',
    gap: 20,
  },
  sparkle: {
    fontSize: 32,
  },
});
