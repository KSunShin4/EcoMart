// src/navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  EditProfile: undefined;
  Address: undefined;
  NotificationScreen: undefined;
  ProductList: {
    categoryId?: string;
    categoryName?: string;
    isFlashSale?: boolean;
    isFeatured?: boolean;
  } | undefined;
  ProductDetail: { productId: string };
  Search: undefined;
  Wishlist: undefined;
  Home: undefined;
  Cart: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string } | undefined;
};

export type MainTabParamList = {
  'Trang chủ': undefined;
  'Đơn hàng từng mua': undefined;
  'Giỏ hàng': undefined;
  'Tài khoản': undefined;
};
