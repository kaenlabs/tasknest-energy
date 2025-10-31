import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useAchievements } from '../context/AchievementContext';
import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { AchievementQueue } from '../components/AchievementQueue';
import { translate } from '../locales/i18n';

export type RootTabParamList = {
  Tasks: undefined;
  Statistics: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { locale } = useLocale(); // This will trigger re-render on language change
  const { unlockedQueue, clearUnlockedQueue } = useAchievements();

  return (
    <>
      <NavigationContainer>
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.primary,
            height: 3,
          },
          tabBarShowIcon: true,
          swipeEnabled: true,
        }}
      >
        <Tab.Screen
          name="Tasks"
          component={HomeScreen}
          options={{
            tabBarLabel: translate('tabs.tasks'),
            tabBarIcon: ({ color }) => (
              <Ionicons name="list" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatsScreen}
          options={{
            tabBarLabel: translate('tabs.statistics'),
            tabBarIcon: ({ color }) => (
              <Ionicons name="stats-chart" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    
    {/* Achievement notification queue with confetti */}
    <AchievementQueue
      achievements={unlockedQueue}
      onComplete={clearUnlockedQueue}
    />
    </>
  );
};
