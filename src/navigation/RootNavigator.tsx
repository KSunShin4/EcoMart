// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';

// --- Màn hình Tạm thời (để trống cho team) ---
const HomeScreen = () => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Trang chủ (Ng2)</Text></View>;
const OrderHistoryScreen = () => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Đơn hàng từng mua (Ng3)</Text></View>;
const CartScreen = () => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Giỏ hàng (Ng3)</Text></View>;

// --- Màn hình thật của BẠN (Ng1) ---
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { OTPScreen } from '../screens/Auth/OTPScreen';
import { AccountScreen } from '../screens/User/AccountScreen';
import { EditProfileScreen } from '../screens/User/EditProfileScreen';
import { AddressScreen } from '../screens/User/AddressScreen';
import { NotificationScreen } from '../screens/User/NotificationScreen';

// (Component Splash Screen)
const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

// --- Định nghĩa các BỘ điều hướng ---
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 1. Bộ điều hướng AUTH (khi chưa đăng nhập)
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
    </AuthStack.Navigator>
  );
}

// 2. Bộ điều hướng MAIN (khi đã đăng nhập)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: true }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{'🏠'}</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Đơn hàng từng mua"
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{'📃'}</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{'🛒'}</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Tài khoản"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/user.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 3. Bộ điều hướng GỐC (Root)
export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const isLoading = useAuthStore((state: any) => state.isLoading);
  const checkAuthStatus = useAuthStore((state: any) => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // 1. ĐÃ ĐĂNG NHẬP
          <>
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            {/* Các màn hình con (không nằm trong tab) */}
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
            <RootStack.Screen name="Address" component={AddressScreen} />
            <RootStack.Screen name="NotificationScreen" component={NotificationScreen} />
          </>
        ) : (
          // 2. CHƯA ĐĂNG NHẬP
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};