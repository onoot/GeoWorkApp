import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LocationDisplayProps {
  location: { latitude: number; longitude: number } | null;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ location }) => {
  const { theme } = useTheme();
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    const fetchCity = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&accept-language=ru`
        );
        if(!response.ok)
          throw response.ok
        const data = await response.json();
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.region ||
          'Неизвестно';
        setCity(city);
      } catch (err) {
        console.warn('Ошибка определения города:', err);
        setCity('Ошибка'+err);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [location]);

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <ActivityIndicator size="small" color={theme === 'dark' ? '#BB86FC' : '#6200EE'} />
      ) : (
        <Text style={[styles.label, { color: theme === 'dark' ? '#E0E0E0' : '#222' }]}>
          Смены в {city}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default LocationDisplay;