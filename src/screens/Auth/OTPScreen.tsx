// src/screens/Auth/OTPScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Button } from '../../components/Button';
import * as authApi from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

type OTPScreenRouteProp = {
  key: string;
  name: 'OTP';
  params: {
    phoneNumber: string;
  };
};

export const OTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<OTPScreenRouteProp>();
  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);
  
  const loginAction = useAuthStore((state: any) => state.login);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 số OTP');
      return;
    }
    setLoading(true);
    try {
      // MockAPI thường không xử lý logic, nên chúng ta tự giả lập
      // Nếu OTP là '123456', gọi API để lấy data
      if (otp === '123456') {
        const response = await authApi.verifyOTP(phoneNumber, otp);
        const { user, accessToken } = response.data;
        await loginAction(accessToken, user);
      } else {
        throw new Error('Mã OTP không đúng');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Mã OTP không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    try {
      await authApi.requestLoginOTP(phoneNumber);
      Alert.alert('Đã gửi lại', 'Mã OTP mới đã được gửi.');
      setCountdown(59);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi lại mã. Vui lòng thử lại sau.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.subtitle}>
          Nhập 6 số được gửi vào Tin nhắn SMS của số điện thoại {phoneNumber}
        </Text>

        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="123456"
        />
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Nếu không nhận được tin nhắn, chọn </Text>
          <TouchableOpacity onPress={handleResendOTP} disabled={countdown > 0}>
            <Text style={[styles.resendButton, countdown > 0 && styles.resendDisabled]}>
              Gửi lại mã {countdown > 0 ? `(${countdown}s)` : ''}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Xác nhận"
          onPress={handleVerifyOTP}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  otpInput: {
    width: '80%',
    height: 60,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    color: '#00884A',
    fontWeight: 'bold',
  },
  resendDisabled: {
    color: '#A9A9A9',
  },
});