import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PointsFloatingNotificationProps {
  points: number;
  action: 'complete' | 'complete_on_time' | 'skip' | 'fail' | 'auto_fail';
  onAnimationComplete: () => void;
}

export const PointsFloatingNotification: React.FC<PointsFloatingNotificationProps> = ({
  points,
  action,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Hold
      Animated.delay(1500),
      // Exit animation - slide up and fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  const isPositive = points > 0;
  const backgroundColor = isPositive ? '#10B981' : '#EF4444';
  const icon = isPositive ? 'arrow-up' : 'arrow-down';

  const getActionEmoji = () => {
    switch (action) {
      case 'complete_on_time':
        return '⚡';
      case 'complete':
        return '✅';
      case 'skip':
        return '⏭️';
      case 'fail':
        return '❌';
      case 'auto_fail':
        return '⚠️';
      default:
        return '⭐';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Text style={styles.emoji}>{getActionEmoji()}</Text>
      <View style={styles.content}>
        <View style={styles.pointsRow}>
          <Ionicons name={icon} size={24} color="#fff" />
          <Text style={styles.points}>{Math.abs(points)}</Text>
          <Text style={styles.star}>⭐</Text>
        </View>
        {action === 'complete_on_time' && (
          <Text style={styles.bonus}>Erken Tamamlama!</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: width / 2 - 100,
    width: 200,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  points: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  star: {
    fontSize: 20,
  },
  bonus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    opacity: 0.9,
  },
});
