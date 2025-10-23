import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LocationDisplayProps {
  location: { latitude: number; longitude: number } | null;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ location }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setCity(null);
      setError(null);
      return;
    }

    const fetchCity = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&accept-language=ru`,
          {
            headers: {
              'User-Agent': 'GeoWorkApp/1.0 (contact@example.com)',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Сервер вернул не JSON');
        }

        const data = await response.json();
        const cityName =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.region ||
          'Неизвестно';
        setCity(cityName);
      } catch (err: any) {
        console.warn('Ошибка определения города:', err);
        setError('Не удалось определить город');
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [location]);

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <ActivityIndicator size="small" color={isDark ? '#BB86FC' : '#6200EE'} />
      ) : error ? (
        <Text style={[styles.label, { color: isDark ? '#CF6679' : 'red' }]}>
          {error}
        </Text>
      ) : (
        <Text style={[styles.label, { color: isDark ? '#E0E0E0' : '#222' }]}>
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