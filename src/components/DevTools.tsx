import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DevTools: React.FC = () => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: 16, y: SCREEN_HEIGHT - 200 })).current;
  const lastTap = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // Don't allow other views to take over
      onShouldBlockNativeResponder: () => true, // Block native responder
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        // Direct value setting for faster response
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        
        // If moved less than 10 pixels, treat as tap
        const moved = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
        if (moved < 10) {
          const now = Date.now();
          if (now - lastTap.current < 300) {
            lastTap.current = 0;
          } else {
            lastTap.current = now;
            setTimeout(() => {
              if (lastTap.current !== 0) {
                setIsExpanded((prev) => !prev);
                lastTap.current = 0;
              }
            }, 250);
          }
          return;
        }
        
        // Was dragging - close menu
        setIsExpanded(false);
        
        // Get current position and keep within bounds
        let currentX = (pan.x as any)._value;
        let currentY = (pan.y as any)._value;
        
        const minX = 0;
        const maxX = SCREEN_WIDTH - 48;
        const minY = 50;
        const maxY = SCREEN_HEIGHT - 48;
        
        const finalX = Math.max(minX, Math.min(currentX, maxX));
        const finalY = Math.max(minY, Math.min(currentY, maxY));
        
        // Animate back to bounds if needed
        if (finalX !== currentX || finalY !== currentY) {
          Animated.spring(pan, {
            toValue: { x: finalX, y: finalY },
            useNativeDriver: false,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@TaskNest:onboarding_completed');
      Alert.alert('Success', 'Onboarding reset! Restart the app to see it again.');
    } catch (error) {
      Alert.alert('Error', 'Could not reset onboarding');
    }
  };

  const clearTutorial = async () => {
    try {
      await AsyncStorage.removeItem('@TaskNest:tutorial_completed');
      Alert.alert('Success', 'Tutorial reset! Restart the app to see it again.');
    } catch (error) {
      Alert.alert('Error', 'Could not reset tutorial');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data?',
      'This will delete all tasks and reset the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data cleared! Restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Could not clear data');
            }
          },
        },
      ]
    );
  };

  // Only show in development
  if (__DEV__) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        {/* Floating Icon Button - Drag anywhere on button */}
        <View
          style={[styles.floatingButton, { backgroundColor: theme.primary }]}
          {...panResponder.panHandlers}
        >
          <Ionicons name={isExpanded ? 'close' : 'build'} size={24} color="#fff" />
        </View>

        {/* Expanded Menu */}
        {isExpanded && (
          <View style={[styles.menu, { backgroundColor: theme.surface }]}>
            <View style={styles.menuHeader}>
              <Ionicons name="construct" size={16} color={theme.text} />
              <Text style={[styles.menuTitle, { color: theme.text }]}>Dev Tools</Text>
            </View>

            <TouchableOpacity
              style={[styles.menuButton, { borderBottomColor: theme.border }]}
              onPress={() => {
                clearOnboarding();
                setIsExpanded(false);
              }}
            >
              <Ionicons name="refresh" size={18} color={theme.primary} />
              <Text style={[styles.menuButtonText, { color: theme.text }]}>
                Reset Onboarding
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, { borderBottomColor: theme.border }]}
              onPress={() => {
                clearTutorial();
                setIsExpanded(false);
              }}
            >
              <Ionicons name="help-circle" size={18} color="#FCD34D" />
              <Text style={[styles.menuButtonText, { color: theme.text }]}>Reset Tutorial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                setIsExpanded(false);
                clearAllData();
              }}
            >
              <Ionicons name="trash" size={18} color="#EF4444" />
              <Text style={[styles.menuButtonText, { color: theme.text }]}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menu: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    minWidth: 200,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
