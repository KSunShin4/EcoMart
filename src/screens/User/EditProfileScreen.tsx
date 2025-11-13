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
  gender: Yup.string().oneOf(['Anh', 'Chị']).required('Vui lòng chọn giới tính'),
});

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state: any) => state.user);
  const setUser = useAuthStore((state: any) => state.setUser);
  
  const handleUpdate = async (
    values: { name: string; gender: string; phone: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    try {
      // Gọi API để cập nhật profile
      const response = await userApi.updateProfile(values.name, values.gender);
      
      // Cập nhật lại thông tin user trong store
      // Nếu user được tạo mới trên MockAPI, sẽ có ID mới từ MockAPI
      const updatedUser = {
        id: response.data.id || user?.id || '',
        name: response.data.name || values.name,
        gender: response.data.gender || values.gender,
        phone: response.data.phone || user?.phone || values.phone,
      };
      
      setUser(updatedUser);
      
      Alert.alert('Thành công', 'Đã lưu chỉnh sửa');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Nếu lỗi nhưng response vẫn có data (trường hợp MockAPI unavailable nhưng vẫn lưu local)
      if (error?.response?.data) {
        const updatedUser = {
          id: error.response.data.id || user?.id || '',
          name: error.response.data.name || values.name,
          gender: error.response.data.gender || values.gender,
          phone: error.response.data.phone || user?.phone || values.phone,
        };
        setUser(updatedUser);
        Alert.alert('Thành công', 'Đã lưu chỉnh sửa (lưu cục bộ)');
        navigation.goBack();
        return;
      }
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Không thể lưu. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
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
          gender: (user as any)?.gender || 'Anh', // Lấy gender từ user hoặc mặc định 'Anh'
        }}
        validationSchema={ProfileSchema}
        onSubmit={handleUpdate}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
          <View style={styles.container}>
            {/* Radio buttons cho Giới tính */}
            <View style={styles.genderContainer}>
              <Text style={styles.label}>Giới tính *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFieldValue('gender', 'Anh')}
                >
                  <View style={styles.radio}>
                    {values.gender === 'Anh' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Anh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFieldValue('gender', 'Chị')}
                >
                  <View style={styles.radio}>
                    {values.gender === 'Chị' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Chị</Text>
                </TouchableOpacity>
              </View>
              {touched.gender && errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
            </View>

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
  genderContainer: {
    marginVertical: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#10B981',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});