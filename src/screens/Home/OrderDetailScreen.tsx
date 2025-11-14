import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image,
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
import client from '../../api/client';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemInfo}>
                Giá: {item.price.toLocaleString('vi-VN')}đ
            </Text>
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

    const handlePayment = async () => {
        if (!selectedAddressId) {
            Alert.alert('Vui lòng chọn địa chỉ.');
            return;
        }

        const selected = addresses.find(a => a.id === selectedAddressId);
        if (!selected) return;

        Alert.alert('Xác nhận', 'Bạn muốn thanh toán đơn hàng này?', [
            { text: 'Không' },
            {
                text: 'Chắc chắn',
                onPress: async () => {
                    try {
                        await client.put(`/orders/${orderId}`, {
                            status: 'completed',
                            shipping_address: selected.fullAddress, // ✅ Ghi chú: lưu full text
                        });
                        updateStatus({ orderId, status: 'completed' });
                    } catch (err) {
                        Alert.alert('Lỗi', 'Không thể hoàn tất thanh toán.');
                    }
                },
            },
        ]);
    };

    const handleCancelOrder = () => {
        Alert.alert('Hủy đơn hàng?', 'Bạn chắc chắn muốn hủy?', [
            { text: 'Không', style: 'cancel' },
            {
                text: 'Hủy',
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết Đơn hàng</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Thông tin chung */}
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

                {/* Sản phẩm */}
                <Card title={`Sản phẩm (${order.items.length})`}>
                    {order.items.map((item, index) => (
                        <OrderItem key={`${item.productId}-${index}`} item={item} />
                    ))}
                </Card>

                {/* Địa chỉ giao hàng (theo trạng thái) */}
                {order.status === 'pending' && (
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
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View>

                                                <FontAwesome5 name="address-card" size={24} color="black" />
                                            </View>

                                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                                <Text style={styles.addressFull}>{item.name}</Text>
                                                <Text style={styles.addressPhone}>{item.phone}</Text>
                                                <Text style={styles.addressFull}>{item.fullAddress}</Text>
                                            </View>


                                        </View>



                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </Card>
                )}

                {order.status === 'completed' && order.shipping_address && (
                    <Card title="Địa chỉ giao hàng">
                        <Text style={styles.addressFull}>{order.shipping_address}</Text>
                    </Card>
                )}

                {/* Tổng tiền */}
                <Card title="Thanh toán">
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tổng tiền:</Text>
                        <Text style={styles.totalAmount}>
                            {order.totalAmount.toLocaleString('vi-VN')}đ
                        </Text>
                    </View>
                </Card>
            </ScrollView>

            {/* Footer */}
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
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    infoLabel: { fontSize: 15, color: '#666' },
    infoValue: { fontSize: 15, color: '#333' },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },
    addAddressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
    },
    addressItem: {
        padding: 5,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        marginBottom: 6,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 2,
    },
    addressItemSelected: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
        elevation: 3,
        paddingLeft: 40
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
        fontWeight: '500',
        paddingLeft: 10,
    },
    addressFull: {
        fontSize: 14,
        color: '#374151',
        marginTop: 4,
        lineHeight: 20,
        paddingLeft: 10,

    },
    selectedIndicator: {
        marginTop: 6,
        color: '#16A34A',
        fontSize: 13,
        fontWeight: '500',
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