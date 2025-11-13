// src/screens/Home/CartScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useCart } from '../../hooks/useCart';
import { CartItem } from '../../store/cartStore';
import { Button } from '../../components/Button';
import { useNavigation } from '@react-navigation/native';

const CartItemCard: React.FC<{
    item: CartItem;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}> = ({ item, onUpdateQuantity, onRemove }) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: item.product.thumbnail }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
            <Text style={styles.itemPrice}>{item.product.price.toLocaleString('vi-VN')}đ</Text>
            <TouchableOpacity onPress={() => onRemove(item.product.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Xóa</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>
                <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export const CartScreen = () => {
    const { cartItems, totalPrice, totalItems, updateQuantity, removeFromCart, checkout, isCheckingOut } = useCart();
    const navigation = useNavigation();

    if (cartItems.length === 0) {
        return (
            <>
                <View style={styles.header1}>
                    <TouchableOpacity style={styles.menuButton}>
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
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>🛒</Text>
                    <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
                    <Button title="Tiếp tục mua sắm" onPress={() => navigation.navigate('Trang chủ')} />
                </View>

            </>

        );
    }

    return (
        <>
            {/* header */}
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
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Giỏ hàng ({totalItems})</Text>
                </View>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.product.id}
                    renderItem={({ item }) => (
                        <CartItemCard item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
                    )}
                    contentContainerStyle={styles.list}
                />
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    <Button title="Đặt hàng" onPress={() => checkout()} loading={isCheckingOut} />
                </View>
            </View>
        </>);
};

// ... (Thêm styles ở cuối)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { paddingTop: 10, padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    list: { paddingVertical: 8 },
    itemContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, marginVertical: 4, marginHorizontal: 8, borderRadius: 8, alignItems: 'center' },
    itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
    itemDetails: { flex: 1, justifyContent: 'space-between' },
    itemName: { fontSize: 15, fontWeight: '500' },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#10B981', marginVertical: 4 },
    removeButton: { alignSelf: 'flex-start' },
    removeButtonText: { color: '#EF4444', fontSize: 13 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    quantityButtonText: { fontSize: 18, fontWeight: 'bold' },
    quantityText: { fontSize: 16, marginHorizontal: 12, fontWeight: '600' },
    footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    totalLabel: { fontSize: 16, color: '#666' },
    totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#10B981' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 80, marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
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