import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

interface LocationServiceProps {
  onLocationUpdate: (coords: { latitude: number; longitude: number }) => void;
}

const LocationService: React.FC<LocationServiceProps> = ({ onLocationUpdate }) => {
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Разрешение на геолокацию',
              message: 'Приложению нужен доступ к точному местоположению.',
              buttonNeutral: 'Спросить позже',
              buttonNegative: 'Отмена',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Разрешение не получено');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          onLocationUpdate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Ошибка геолокации:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000,
        }
      );
    };

    requestLocationPermission();
  }, [onLocationUpdate]);

  return null;
};

export default LocationService;
