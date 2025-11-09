// src/screens/User/EditProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import * as userApi from '../../api/userApi';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Họ và tên là bắt buộc'),
  phone: Yup.string().required('Số điện thoại là bắt buộc'),
  gender: Yup.string().oneOf(['Anh', 'Chị']).required(),
});

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, login } = useAuthStore(); // Lấy user và hàm login (để cập nhật user)
  
  const handleUpdate = async (
    values: { name: string; gender: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    try {
      // Gọi mock API
      const response = await userApi.updateProfile(values.name, values.gender);
      
      // Cập nhật lại thông tin user trong store
      login(useAuthStore.getState().accessToken!, response.data); 
      
      Alert.alert('Thành công', 'Đã lưu chỉnh sửa');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
      </View>

      <Formik
        initialValues={{
          name: user?.name || '',
          phone: user?.phone || '',
          gender: 'Anh', // Mặc định
        }}
        validationSchema={ProfileSchema}
        onSubmit={handleUpdate}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.container}>
            {/* TODO: Thêm Radio Button cho Anh/Chị */}
            <Input
              label="Họ và tên *"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={errors.name}
              touched={touched.name}
            />
            <Input
              label="Số điện thoại *"
              value={values.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={errors.phone}
              touched={touched.phone}
              keyboardType="phone-pad"
              disabled // Không cho sửa SĐT
            />
            <Button
              title="Lưu chỉnh sửa"
              onPress={() => handleSubmit()}
              loading={isSubmitting}
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: { fontSize: 24, marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  container: { padding: 16 },
});