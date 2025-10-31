import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AchievementNotification } from './AchievementNotification';
import { ConfettiCelebration } from './ConfettiCelebration';
import { Achievement } from '../types/achievement.types';

interface AchievementQueueProps {
  achievements: Achievement[];
  onComplete: () => void;
}

export const AchievementQueue: React.FC<AchievementQueueProps> = ({
  achievements,
  onComplete,
}) => {
  const [queue, setQueue] = useState<Achievement[]>(achievements);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievements.length > 0 && queue.length === 0) {
      setQueue(achievements);
      setCurrentIndex(0);
      setShowConfetti(true);
    }
  }, [achievements]);

  const handleNotificationDismiss = () => {
    setShowConfetti(false);
    
    if (currentIndex < queue.length - 1) {
      // Show next achievement after a small delay
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setShowConfetti(true);
      }, 500);
    } else {
      // All achievements shown
      setQueue([]);
      setCurrentIndex(0);
      onComplete();
    }
  };

  if (queue.length === 0 || currentIndex >= queue.length) {
    return null;
  }

  const currentAchievement = queue[currentIndex];

  return (
    <View style={styles.container} pointerEvents="box-none">
      <AchievementNotification
        achievement={currentAchievement}
        onDismiss={handleNotificationDismiss}
      />
      <ConfettiCelebration
        trigger={showConfetti}
        count={150}
        duration={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
