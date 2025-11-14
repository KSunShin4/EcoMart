// src/screens/User/AddressScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../../api/userApi';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';

type AddressNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Address'>;

export const AddressScreen = () => {
  const navigation = useNavigation<AddressNavigationProp>();
  const queryClient = useQueryClient();
    const userId = useAuthStore.getState().user?.id;
  // Dùng React Query để lấy dữ liệu từ Mock API
  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: userApi.getAddresses,
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      Alert.alert('Thành công', 'Đã xóa địa chỉ');
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error?.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.');
    },
  });

  const handleEdit = (addressId: string) => {
    navigation.navigate('AddEditAddress', { addressId });
  };

  const handleDelete = (addressId: string, addressName: string) => {

    if(!userId){
      Alert.alert('Lỗi', 'User ID không hợp lệ. Vui lòng đăng nhập lại.');
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa địa chỉ "${addressName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => deleteMutation.mutate({
            userId: userId,
            addressId: addressId,
          }),
        },
      ]
    );
  };

  const handleAdd = () => {
    navigation.navigate('AddEditAddress', {});
  };

  const renderAddress = ({ item }: { item: userApi.Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressInfo}>
          <Text style={styles.addressName}>{item.name}</Text>
          {item.isDefault && <Text style={styles.defaultBadge}>Mặc định</Text>}
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => handleEdit(item.id)}>
            <Text style={styles.editButton}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
            <Text style={styles.deleteButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressText}>📞 {item.phone}</Text>
      <Text style={styles.addressText}>📍 {item.fullAddress}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ nhận hàng</Text>
      </View>

      {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>Không thể tải địa chỉ</Text>}

      {!isLoading && (!addresses || addresses.length === 0) && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📍</Text>
          <Text style={styles.emptyTitle}>Bạn chưa có địa chỉ nào</Text>
          <Text style={styles.emptySubtitle}>Thêm địa chỉ để nhận hàng nhanh chóng</Text>
        </View>
      )}

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={!addresses || addresses.length === 0 ? styles.emptyList : styles.list}
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <Button
              title="+ Thêm địa chỉ mới"
              onPress={handleAdd}
            />
          </View>
        }
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
  errorText: { textAlign: 'center', color: 'red', marginTop: 10 },
  list: {
    paddingVertical: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  defaultBadge: {
    color: '#10B981',
    backgroundColor: '#E6F7F0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 4,
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