/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LocationService from './components/LocationService';
import LocationDisplay from './components/LocationDisplay';
import { shiftStore, Shift } from './stores/ShiftStore';
import ShiftList from './components/ShiftList';
import ShiftDetail from './components/ShiftDetail';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleLocationUpdate = useCallback((coords: { latitude: number; longitude: number }) => {
    setLocation(coords);
    shiftStore.fetchShifts(coords.latitude, coords.longitude);
  }, []);

  const handleSelectShift = useCallback((shift: Shift) => {
    shiftStore.selectShift(shift);
    setShowDetail(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    shiftStore.clearSelectedShift();
  }, []);

  const handleRefresh = useCallback(() => {
    if (location) {
      shiftStore.fetchShifts(location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.themeIcon, { color: isDark ? '#BB86FC' : '#6200EE' }]}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      <LocationService onLocationUpdate={handleLocationUpdate} />
      <LocationDisplay location={location} />

      <View style={styles.content}>
        {!showDetail ? (
          <ShiftList
            onSelect={handleSelectShift}
            onRefresh={handleRefresh}
            refreshing={shiftStore.loading && shiftStore.shifts.length > 0}/>
        ) : shiftStore.selectedShift ? (
          <ShiftDetail shift={shiftStore.selectedShift} onClose={handleCloseDetail}/>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <SafeAreaProvider> 
        <AppContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  themeIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default App;