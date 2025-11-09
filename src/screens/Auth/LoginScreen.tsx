// src/screens/Auth/LoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import * as authApi from '../../api/authApi';

const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
});

type AuthNavigationProp = {
  navigate: (screen: 'OTP', params: { phoneNumber: string }) => void;
};

export const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const handleLogin = async (
    values: { phone: string }, 
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    try {
      await authApi.requestLoginOTP(values.phone);
      navigation.navigate('OTP', { phoneNumber: values.phone });
    } catch (error) {
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <Text style={styles.subtitle}>
          Mời Anh/Chị đăng nhập để đặt hàng nhanh chóng và thuận tiện hơn
        </Text>

        <Formik
          initialValues={{ phone: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <>
              <Input
                label="Số điện thoại"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                error={errors.phone}
                touched={touched.phone}
              />
              <Button
                title="Tiếp tục"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
              />
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});