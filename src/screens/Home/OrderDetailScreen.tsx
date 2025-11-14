// src/screens/Home/OrderDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { RootStackParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';


type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemInfo}>Giá: {item.price.toLocaleString('vi-VN')}đ</Text>
        </View>
        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
    </View>
);

const getStatusStyle = (status: string) => {
    if (status === 'completed') return { color: '#10B981', text: 'Hoàn thành' };
    if (status === 'cancelled') return { color: '#EF4444', text: 'Đã hủy' };
    return { color: '#F59E0B', text: 'Đang xử lý' };
};

export const OrderDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { orderId } = route.params;
    const { data: order, isLoading, isError } = useOrder(orderId);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

    // --- LOGIC XỬ LÝ ---
    const handlePayment = () => {
        Alert.alert(
            'Xác nhận thanh toán',
            'Bạn có chắc chắn muốn hoàn tất thanh toán cho đơn hàng này?',
            [
                { text: 'Không' },
                {
                    text: 'Chắc chắn',
                    onPress: () => updateStatus({ orderId, status: 'completed' }),
                },
            ]
        );
    };

    const handleCancelOrder = () => {
        Alert.alert(
            'Xác nhận hủy đơn',
            'Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
            [
                { text: 'Không', style: 'cancel' },
                {
                    text: 'Chắc chắn hủy',
                    onPress: () => updateStatus({ orderId, status: 'cancelled' }),
                    style: 'destructive',
                },
            ]
        );
    };


    if (isLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    if (isError || !order) {
        return <View style={styles.center}><Text>Không tìm thấy thông tin đơn hàng.</Text></View>;
    }

    const statusStyle = getStatusStyle(order.status);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {/* <Text style={styles.backButton}>←</Text> */}
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết Đơn hàng</Text>
                <View style={{ width: 30 }} />
            </View>
            <ScrollView>
                <Card title="Thông tin chung">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                        <Text style={styles.infoValue}>#{order.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đặt:</Text>
                        <Text style={styles.infoValue}>{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái:</Text>
                        <Text style={[styles.infoValue, { color: statusStyle.color, fontWeight: 'bold' }]}>
                            {statusStyle.text}
                        </Text>
                    </View>
                </Card>

                <Card title={`Sản phẩm (${order.items.length})`}>
                    {order.items.map((item, index) => (
                        <OrderItem key={`${item.productId}-${index}`} item={item} />
                    ))}
                </Card>

                <Card title="Thanh toán">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tổng tiền:</Text>
                        <Text style={styles.totalAmount}>{order.totalAmount.toLocaleString('vi-VN')}đ</Text>
                    </View>
                </Card>
            </ScrollView>
            {/* Nút hành động chỉ hiển thị khi đơn hàng đang xử lý */}
            {order.status === 'pending' && (
                <View style={styles.actionFooter}>
                    <Button
                        title="Thanh toán"
                        onPress={handlePayment}
                        loading={isUpdating}
                    />
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelOrder}
                        disabled={isUpdating}
                    >
                        <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
                    </TouchableOpacity>
                </View>
            )}




        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: { fontSize: 24, fontWeight: 'bold' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    infoLabel: { fontSize: 15, color: '#666' },
    infoValue: { fontSize: 15, color: '#333' },
    totalAmount: { fontSize: 18, color: '#10B981', fontWeight: 'bold' },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '500' },
    itemInfo: { fontSize: 13, color: '#888', marginTop: 4 },
    itemQuantity: { fontSize: 16, fontWeight: '600' },
    actionFooter: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButton: {
        marginTop: 12,
        alignItems: 'center',
        padding: 10,
    },
    cancelButtonText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '500',
    },
});