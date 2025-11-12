# EcoMart - Ứng dụng E-commerce Sản phẩm xanh

[![React Native](https://img.shields.io/badge/React%20Native-0.72-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img-shields.io/badge/Expo-49-000020.svg?style=flat&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Một ứng dụng thương mại điện tử di động được xây dựng bằng React Native và Expo, tập trung vào việc cung cấp trải nghiệm mua sắm các sản phẩm thân thiện với môi trường.

![Demo GIF](https://user-images.githubusercontent.com/ вашим_id/số_id/tên_file_demo.gif)
*Lưu ý: Thay thế GIF trên bằng ảnh chụp màn hình hoặc GIF demo thực tế của ứng dụng.*

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Các chức năng chính](#các-chức-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và Chạy dự án](#cài-đặt-và-chạy-dự-án)
  - [Yêu cầu](#yêu-cầu)
  - [Các bước cài đặt](#các-bước-cài-đặt)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Các Scripts có sẵn](#các-scripts-có-sẵn)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## Giới thiệu

**EcoMart** là một dự án ứng dụng di động mô phỏng một sàn thương mại điện tử, tập trung vào các sản phẩm hữu cơ, tái chế và bền vững. Dự án được xây dựng với kiến trúc hiện đại, dễ bảo trì và mở rộng, sử dụng các thư viện hàng đầu trong hệ sinh thái React Native.

## Các chức năng chính

- **Xác thực người dùng:** Đăng nhập/Đăng xuất bằng OTP.
- **Trang chủ:** Hiển thị banners, danh mục, sản phẩm Flash Sale, và sản phẩm nổi bật.
- **Quản lý sản phẩm:**
  - Xem danh sách sản phẩm theo danh mục.
  - Lọc sản phẩm theo giá, loại, mùa vụ.
  - Sắp xếp sản phẩm theo nhiều tiêu chí.
  - Xem chi tiết thông tin sản phẩm.
- **Tìm kiếm:**
  - Tìm kiếm sản phẩm theo từ khóa (debounce).
  - Hiển thị gợi ý tìm kiếm.
  - Lưu và quản lý lịch sử tìm kiếm.
- **Giỏ hàng:** Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ.
- **Thanh toán:** Tạo đơn hàng từ giỏ hàng.
- **Lịch sử đơn hàng:**
  - Xem danh sách các đơn hàng đã đặt.
  - Lọc đơn hàng theo trạng thái (Đang xử lý, Hoàn thành, Đã hủy).
  - Xem chi tiết đơn hàng.
  - Thực hiện thanh toán hoặc hủy đơn.
- **Danh sách yêu thích:** Thêm/xóa sản phẩm vào danh sách yêu thích (hoạt động cho cả khách và người dùng đã đăng nhập).
- **Tài khoản người dùng:** Xem và chỉnh sửa thông tin cá nhân, quản lý địa chỉ.
- **Giao diện Loading:** Hiển thị SplashScreen và các skeleton-loading để cải thiện trải nghiệm người dùng.

## Công nghệ sử dụng

- **Nền tảng:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Quản lý trạng thái:**
  - **Server State:** [TanStack Query (React Query)](https://tanstack.com/query) để quản lý dữ liệu từ server (fetching, caching, và cập nhật).
  - **Client State:** [Zustand](https://github.com/pmndrs/zustand) để quản lý trạng thái toàn cục phía client (thông tin đăng nhập, giỏ hàng).
- **Điều hướng:** [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs).
- **Gọi API:** [Axios](https://axios-http.com/) với Interceptors để tự động đính kèm token.
- **Xử lý Form:** [Formik](https://formik.org/) và [Yup](https://github.com/jquense/yup) để quản lý và xác thực form.
- **Giao diện & Icons:** [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/), [Expo Vector Icons](https://docs.expo.dev/guides/icons/).

## Cài đặt và Chạy dự án

### Yêu cầu

- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
- `npm` hoặc `yarn`
- Ứng dụng [Expo Go](https://expo.dev/go) trên điện thoại Android/iOS.

### Các bước cài đặt

1.  **Clone repository:**
    ```bash
    git clone https://github.com/ten_cua_ban/ecomart-app.git
    cd ecomart-app
    ```

2.  **Cài đặt các packages:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```

3.  **Cấu hình Backend (MockAPI):**
    Dự án này sử dụng [MockAPI.io](https://mockapi.io/) để giả lập backend.
    - Đăng nhập vào MockAPI và tạo một project mới.
    - Trong project đó, tạo các **resource** sau (tên phải chính xác):
      - `users`
      - `products`
      - `categories`
      - `banners`
      - `reviews`
      - `orders`
      - `wishlist`
      - `searchHistory`
      - `addresses`
      - `notifications`
    - Sau khi tạo, copy URL của project (ví dụ: `https://xxxxxxxxxxxxxx.mockapi.io`).
    - Mở file `src/api/client.ts` và thay thế giá trị của `MOCK_API_URL` bằng URL bạn vừa copy.

4.  **Chạy dự án:**
    ```bash
    npx expo start
    ```
    - Một mã QR sẽ xuất hiện trên terminal.
    - Mở ứng dụng Expo Go trên điện thoại và quét mã QR để mở ứng dụng.

## Cấu trúc thư mục

Dự án được cấu trúc một cách logic và rõ ràng để dễ dàng bảo trì và mở rộng:
src/
├── api/ # Định nghĩa các hàm gọi API đến backend.
├── assets/ # Chứa các tài nguyên tĩnh như ảnh, icon, font.
├── components/ # Các component nhỏ, có thể tái sử dụng (Button, Card, ProductCard...).
├── hooks/ # Chứa các custom hooks để đóng gói logic nghiệp vụ (useAuth, useCart...).
├── navigation/ # Cấu hình React Navigation (stacks, tabs, types).
├── screens/ # Các component màn hình chính của ứng dụng.
├── store/ # Quản lý trạng thái toàn cục phía client bằng Zustand (authStore, cartStore).
└── types/ # Định nghĩa các kiểu dữ liệu TypeScript chung cho toàn dự án.


## Các Scripts có sẵn

- `npm start` hoặc `npx expo start`: Chạy ứng dụng trong môi trường development.
- `npm run android` hoặc `npx expo run:android`: Chạy ứng dụng trên máy ảo Android.
- `npm run ios` hoặc `npx expo run:ios`: Chạy ứng dụng trên máy ảo iOS.

