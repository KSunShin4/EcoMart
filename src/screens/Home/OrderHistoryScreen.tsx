// src/screens/Home/OrderHistoryScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useOrders } from '../../hooks/useOrders';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OrderHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Đơn hàng từng mua'>;

const TABS = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang xử lý', value: 'pending' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' },
];

const OrderCard = ({ order }: { order: any }) => {
    const navigation = useNavigation<OrderHistoryNavigationProp>();
    const getStatusStyle = (status: string) => {
        if (status === 'completed') return { color: '#10B981', text: 'Hoàn thành' };
        if (status === 'cancelled') return { color: '#EF4444', text: 'Đã hủy' };
        return { color: '#F59E0B', text: 'Đang xử lý' };
    };
    const statusStyle = getStatusStyle(order.status);

    return (
        <Card>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Đơn hàng #{order.id}</Text>
                <Text style={[styles.orderStatus, { color: statusStyle.color }]}>{statusStyle.text}</Text>
            </View>
            <View style={styles.orderBody}>
                <Text style={styles.orderInfo}>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</Text>
                <Text style={styles.orderInfo}>Số sản phẩm: {order.items.length}</Text>
                <Text style={styles.orderTotal}>Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ</Text>
            </View>
            <View style={styles.orderFooter}>
                <Button title="Xem chi tiết" onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })} />
            </View>
        </Card>
    );
};

export const OrderHistoryScreen = () => {
    const { data: orders, isLoading, isError } = useOrders();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('all');

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        if (activeTab === 'all') {
            return orders;
        }
        return orders.filter(order => order.status === activeTab);
    }, [orders, activeTab]);

    const renderTabs = () => (
        <>
            <View style={styles.header1}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Categories')}>
                    <Text style={styles.menuIcon}>☰</Text>
                    <Text style={styles.menuText}>MENU</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => navigation.navigate('Search')}
                >
                    <Text style={styles.searchIcon}>🔍</Text>
                    <Text style={styles.searchPlaceholder}>
                        Mua đơn tươi sống từ 150k - Freeship 3km
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Đơn hàng của bạn</Text>
            </View>







            <View style={styles.tabContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab.value}
                        style={[styles.tab, activeTab === tab.value && styles.activeTab]}
                        onPress={() => setActiveTab(tab.value)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.value && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" style={styles.center} />;
        }
        if (isError) {
            return <Text style={styles.center}>Đã xảy ra lỗi khi tải đơn hàng.</Text>;
        }
        if (!orders || orders.length === 0) {
            return (
                <>

                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>📦</Text>
                        <Text style={styles.emptyTitle}>Bạn chưa có đơn hàng nào</Text>
                        <Button title="Bắt đầu mua sắm" onPress={() => navigation.navigate('Trang chủ')} />
                    </View>
                </>
            );
        }
        return (
            <>



                {renderTabs()}
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <OrderCard order={item} />}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyFilteredContainer}>
                            <Text>Không có đơn hàng nào ở trạng thái này.</Text>
                        </View>
                    }
                />
            </>
        );
    };

    return (
        <View style={styles.container}>
            {renderContent()}

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    list: { paddingVertical: 8 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 12, marginBottom: 12 },
    orderId: { fontSize: 16, fontWeight: '600' },
    orderStatus: { fontSize: 14, fontWeight: 'bold' },
    orderBody: { marginBottom: 16 },
    orderInfo: { fontSize: 14, color: '#666', marginBottom: 4 },
    orderTotal: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    orderFooter: { marginTop: 8 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 80, marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
    emptyFilteredContainer: {
        padding: 40,
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        marginBottom: -1
    },
    activeTab: {
        borderBottomColor: '#10B981',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#10B981',
        fontWeight: '600',
    },

    menuButton: {
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 24,
        color: '#fff',
    },
    menuText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchIcon: {
        fontSize: 16,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 13,
        color: '#9CA3AF',
    },
    header1: {
        backgroundColor: '#10B981',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },


});