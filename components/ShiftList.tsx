import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { shiftStore, Shift } from '../stores/ShiftStore';
import { useTheme } from '../contexts/ThemeContext';

interface ShiftListProps {
  onSelect: (shift: Shift) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const ShiftList: React.FC<ShiftListProps> = observer(({ onSelect, onRefresh, refreshing }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (shiftStore.loading && shiftStore.shifts.length === 0) {
    return <ActivityIndicator size="large" color={isDark ? '#BB86FC' : '#6200EE'} style={styles.center} />;
  }

  if (shiftStore.error) {
    return <Text style={[styles.error, { color: isDark ? '#CF6679' : 'red' }]}>{shiftStore.error}</Text>;
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={shiftStore.shifts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
          onPress={() => onSelect(item)}
        >
          <Image source={{ uri: (item.logo || '').trim() }} style={styles.logo} />
          <View style={styles.info}>
            <Text style={[styles.company, { color: isDark ? '#FFF' : '#222' }]}>
              {item.companyName}
            </Text>
            <Text style={[styles.address, { color: isDark ? '#B0B0B0' : '#555' }]}>
              {item.address}
            </Text>
            <Text style={[styles.date, { color: isDark ? '#9E9E9E' : '#888' }]}>
              {item.dateStartByCity} {item.timeStartByCity} – {item.timeEndByCity}
            </Text>
            <Text style={[styles.workers, { color: isDark ? '#BB86FC' : '#007AFF' }]}>
              Набрано: {item.currentWorkers}/{item.planWorkers}
            </Text>
            <Text style={[styles.price, { color: isDark ? '#4CAF50' : '#27ae60' }]}>
              Оплата: {item.priceWorker}₽
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={[styles.empty, { color: isDark ? '#9E9E9E' : '#888' }]}>
          Смены не найдены
        </Text>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[isDark ? '#BB86FC' : '#6200EE']}
          tintColor={isDark ? '#BB86FC' : '#6200EE'}
        />
      }
    />
  );
});

const styles = StyleSheet.create({
  list: { flex: 1, width: '100%' },
  listContent: { paddingBottom: 24 },
  center: { flex: 1, justifyContent: 'center' },
  item: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  info: { flex: 1 },
  company: { fontWeight: '600', fontSize: 16, marginBottom: 2 },
  address: { fontSize: 14, marginBottom: 4 },
  date: { fontSize: 13 },
  workers: { fontSize: 13, marginTop: 2 },
  price: { fontSize: 15, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 64, fontSize: 16 },
  error: { textAlign: 'center', marginTop: 64, fontSize: 16 },
});

export default ShiftList;