import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Shift } from '../stores/ShiftStore';
import { useTheme } from '../contexts/ThemeContext';

interface ShiftDetailProps {
  shift: Shift;
  onClose: () => void;
}

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const workTypesNames = shift.workTypes.map((wt) => wt.name).join(', ');

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}
    >
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Text
          style={[
            styles.closeText,
            {
              color: isDark ? '#ecebecff' : '#007AFF',
              backgroundColor: !isDark?'#eee':'#181818',
            },
          ]}
        >
          Назад
        </Text>
      </TouchableOpacity>

      <Image source={{ uri: (shift.logo || '').trim() }} style={styles.logo} />
      <Text style={[styles.company, { color: isDark ? '#FFF' : '#222' }]}>
        {shift.companyName}
      </Text>
      <Text style={[styles.address, { color: isDark ? '#B0B0B0' : '#555' }]}>
        {shift.address}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? '#9E9E9E' : '#777' }]}>Дата</Text>
        <Text style={[styles.value, { color: isDark ? '#E0E0E0' : '#222' }]}>
          {shift.dateStartByCity}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? '#9E9E9E' : '#777' }]}>Время</Text>
        <Text style={[styles.value, { color: isDark ? '#E0E0E0' : '#222' }]}>
          {shift.timeStartByCity} – {shift.timeEndByCity}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? '#9E9E9E' : '#777' }]}>Набрано</Text>
        <Text style={[styles.value, { color: isDark ? '#E0E0E0' : '#222' }]}>
          {shift.currentWorkers}/{shift.planWorkers}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? '#9E9E9E' : '#777' }]}>Тип работы</Text>
        <Text style={[styles.value, { color: isDark ? '#E0E0E0' : '#222' }]}>
          {workTypesNames}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? '#9E9E9E' : '#777' }]}>Оплата</Text>
        <Text style={[styles.value, { color: isDark ? '#4CAF50' : '#27ae60' }]}>
          {shift.priceWorker} ₽
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? '#9E9E9E' : '#777' }]}>Рейтинг</Text>
        <Text style={[styles.value, { color: isDark ? '#FFD700' : '#f39c12' }]}>
          {shift.customerRating} ({shift.customerFeedbacksCount})
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
   closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
  },
  company: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
});

export default ShiftDetail;