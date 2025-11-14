// src/screens/User/NotificationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as userApi from '../../api/userApi';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';


type NotificationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotificationScreen'>;

export const NotificationScreen = () => {
  const navigation = useNavigation<NotificationNavigationProp>();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: userApi.getNotifications,
    refetchInterval: 30000, // Refetch mỗi 30 giây để cập nhật thông báo mới
  });

  const handleNotificationPress = (notification: any) => {
    if (notification.type === 'order' && notification.orderId) {
      navigation.navigate('OrderDetail', { orderId: notification.orderId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {!isLoading && (!notifications || notifications.length === 0) && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🔔</Text>
          <Text style={styles.emptyTitle}>Chưa có thông báo</Text>
          <Text style={styles.emptySubtitle}>Thông báo về đơn hàng sẽ hiển thị tại đây</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={!notifications || notifications.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationItem}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              {item.message && (
                <Text style={styles.notificationMessage}>{item.message}</Text>
              )}
              <View style={styles.notificationFooter}>
                <Text style={styles.notificationTime}>{item.time}</Text>
                {item.status && (
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {item.status === 'pending' ? 'Đang xử lý' :
                        item.status === 'completed' ? 'Hoàn thành' :
                          item.status === 'cancelled' ? 'Đã hủy' : item.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: { fontSize: 24, marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  list: {
    paddingVertical: 8,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});