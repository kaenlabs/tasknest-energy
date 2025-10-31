import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { LocaleProvider } from './src/context/LocaleContext';
import { TaskProvider } from './src/context/TaskContext';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <TaskProvider>
          <HomeScreen />
        </TaskProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
