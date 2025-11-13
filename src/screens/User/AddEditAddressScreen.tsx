// src/screens/User/AddEditAddressScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import * as userApi from '../../api/userApi';
import { useAuthStore } from '../../store/authStore';

const AddressSchema = Yup.object().shape({
  name: Yup.string().required('Tên người nhận là bắt buộc'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
  fullAddress: Yup.string().required('Địa chỉ là bắt buộc'),
});

type AddEditAddressRouteProp = {
  key: string;
  name: 'AddEditAddress';
  params: {
    addressId?: string; // Nếu có addressId thì là edit, không có thì là add
  };
};

export const AddEditAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddEditAddressRouteProp>();
  const { addressId } = route.params || {};
  const queryClient = useQueryClient();
  const user = useAuthStore((state: any) => state.user);

  // Lấy địa chỉ hiện tại nếu đang edit
  const addresses = queryClient.getQueryData<userApi.Address[]>(['addresses']);
  const address = addressId ? addresses?.find((a) => a.id === addressId) : undefined;

  const createMutation = useMutation({
    mutationFn: (data: Omit<userApi.Address, 'id'>) => userApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      Alert.alert('Thành công', 'Đã thêm địa chỉ mới');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error?.message || 'Không thể thêm địa chỉ. Vui lòng thử lại.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<userApi.Address> }) =>
      userApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      Alert.alert('Thành công', 'Đã cập nhật địa chỉ');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error?.message || 'Không thể cập nhật địa chỉ. Vui lòng thử lại.');
    },
  });

  const handleSubmit = (values: { name: string; phone: string; fullAddress: string; isDefault: boolean }) => {
    if (addressId) {
      // Update
      updateMutation.mutate({
        id: addressId,
        data: values,
      });
    } else {
      // Create
      createMutation.mutate({
        ...values,
        userId: user?.id || '',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {addressId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </Text>
      </View>

      <ScrollView style={styles.container}>
        <Formik
          initialValues={{
            name: address?.name || '',
            phone: address?.phone || user?.phone || '',
            fullAddress: address?.fullAddress || '',
            isDefault: address?.isDefault || false,
          }}
          validationSchema={AddressSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
            <View style={styles.form}>
              <Input
                label="Tên người nhận *"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={errors.name}
                touched={touched.name}
                placeholder="Nhập tên người nhận"
              />

              <Input
                label="Số điện thoại *"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={errors.phone}
                touched={touched.phone}
                keyboardType="phone-pad"
                placeholder="Nhập số điện thoại"
              />

              <Input
                label="Địa chỉ *"
                value={values.fullAddress}
                onChangeText={handleChange('fullAddress')}
                onBlur={handleBlur('fullAddress')}
                error={errors.fullAddress}
                touched={touched.fullAddress}
                placeholder="Nhập địa chỉ nhận hàng"
                multiline
                numberOfLines={4}
              />

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setFieldValue('isDefault', !values.isDefault)}
                >
                  <View style={[styles.checkboxBox, values.isDefault && styles.checkboxBoxChecked]}>
                    {values.isDefault && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
                </TouchableOpacity>
              </View>

              <Button
                title={addressId ? 'Cập nhật' : 'Thêm địa chỉ'}
                onPress={() => handleSubmit()}
                loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  checkboxContainer: {
    marginVertical: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
});

