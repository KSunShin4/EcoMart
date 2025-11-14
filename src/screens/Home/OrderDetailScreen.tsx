import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { RootStackParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAddresses, Address } from '../../api/userApi';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
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

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const loadAddresses = async () => {
        const all = await getAddresses();
        setAddresses(all);

        const defaultAddr = all.find(addr => addr.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAddresses();
        }, [])
    );

    const handlePayment = () => {
        if (!selectedAddressId) {
            Alert.alert('Vui lòng chọn địa chỉ giao hàng.');
            return;
        }

        Alert.alert('Xác nhận', 'Bạn có chắc muốn hoàn tất thanh toán?', [
            { text: 'Không' },
            {
                text: 'Chắc chắn',
                onPress: () => {
                    updateStatus({ orderId, status: 'completed' });
                },
            },
        ]);
    };

    const handleCancelOrder = () => {
        Alert.alert('Hủy đơn?', 'Bạn chắc chắn muốn hủy đơn hàng này?', [
            { text: 'Không', style: 'cancel' },
            {
                text: 'Hủy đơn',
                style: 'destructive',
                onPress: () => updateStatus({ orderId, status: 'cancelled' }),
            },
        ]);
    };

    if (isLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    if (isError || !order) {
        return <View style={styles.center}><Text>Không tìm thấy đơn hàng.</Text></View>;
    }

    const statusStyle = getStatusStyle(order.status);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết Đơn hàng</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Card title="Thông tin chung">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                        <Text style={styles.infoValue}>#{order.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đặt:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </Text>
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

                <Card
                    title="Địa chỉ giao hàng"
                    meta={
                        <TouchableOpacity onPress={() => navigation.navigate('AddEditAddress')}>
                            <Text style={styles.addAddressText}>+ Thêm</Text>
                        </TouchableOpacity>
                    }
                >
                    {addresses.length === 0 ? (
                        <Text>Bạn chưa có địa chỉ. Nhấn + Thêm để tạo mới.</Text>
                    ) : (
                        addresses.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedAddressId(item.id)}
                            >
                                <View
                                    style={[
                                        styles.addressItem,
                                        item.id === selectedAddressId && styles.addressItemSelected,
                                    ]}
                                >
                                    <Text style={styles.addressName}><FontAwesome5 name="address-card" size={24} color="gray" /> {item.name}</Text>
                                    <Text style={styles.addressPhone}>{item.phone}</Text>
                                    <Text style={styles.addressFull}>{item.fullAddress}</Text>
                                    {/* {item.isDefault && (
                                        <Text style={styles.defaultBadge}>Mặc định</Text>
                                    )} */}
                                    {/* {item.id === selectedAddressId && (
                                        <Text style={styles.selectedIndicator}>Đã chọn ✅</Text>
                                    )} */}
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </Card>

                <Card title="Thanh toán">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tổng tiền:</Text>
                        <Text style={styles.totalAmount}>{order.totalAmount.toLocaleString('vi-VN')}đ</Text>
                    </View>
                </Card>
            </ScrollView>

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
    addressItem: {
        padding: 14,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    addressItemSelected: {
        borderColor: '#10B981',
        backgroundColor: '#D1FAE5',
        elevation: 3,
    },
    addressName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    addressPhone: {
        fontSize: 14,
        color: '#4B5563',
    },
    addressFull: {
        fontSize: 14,
        color: '#374151',
        marginTop: 4,
        lineHeight: 18,
    },
    defaultBadge: {
        marginTop: 6,
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    selectedIndicator: {
        marginTop: 6,
        color: '#16A34A',
        fontSize: 13,
        fontWeight: '500',
    },
    addAddressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
    },
});