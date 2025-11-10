// src/screens/Home/HomeScreen.tsx
import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
} from 'react-native';


type Props = {
    navigation: any;
};

const { width } = Dimensions.get('window');

export const CartScreen: React.FC<Props> = ({ navigation }) => {


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
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
            {/* body */}








        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: '#10B981',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
    scrollView: {
        flex: 1,
    },
    bannerContainer: {
        position: 'relative',
        height: 180,
        marginBottom: 16,
    },
    bannerSkeleton: {
        height: 180,
        backgroundColor: '#E0E0E0',
        marginBottom: 16,
    },
    bannerItem: {
        width,
        height: 180,
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 16,
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 12,
        color: '#fff',
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 8,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeIndicator: {
        backgroundColor: '#fff',
        width: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    flashSaleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flashSaleIcon: {
        fontSize: 20,
    },
    seeAllText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
    },
    categoriesScroll: {
        paddingLeft: 16,
    },
    categoryItem: {
        width: 100,
        marginRight: 12,
        alignItems: 'center',
    },
    categorySkeleton: {
        width: 100,
        height: 120,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        marginRight: 12,
    },
    categoryImageContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    categoryName: {
        fontSize: 12,
        color: '#1F2937',
        textAlign: 'center',
        fontWeight: '500',
    },
    categoryCount: {
        fontSize: 10,
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 2,
    },
});
