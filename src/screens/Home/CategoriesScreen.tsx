// src/screens/Home/CategoriesScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,

    StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useCategories } from '../../hooks/useProducts';
import Ionicons from '@expo/vector-icons/Ionicons';
type Props = {
    navigation: any;
};

export const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
    const { data: categories, isLoading } = useCategories();

    const featuredCategory = categories?.find(cat => cat.badge);
    const regularCategories = categories?.filter(cat => cat.id !== featuredCategory?.id);

    return (
        <>
            <View style={styles.header1}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="white" />

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
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#10B981" />

                {/* Header */}

                {/* <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                    <Text style={styles.headerButtonText}>Đóng</Text>
                </TouchableOpacity> */}









                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Featured Category Section */}
                    {featuredCategory && (
                        <View style={styles.featuredSection}>
                            <TouchableOpacity
                                style={styles.featuredCard}
                                onPress={() =>
                                    navigation.navigate('ProductList', {
                                        categoryId: featuredCategory.id,
                                        categoryName: featuredCategory.name,
                                    })
                                }
                            >
                                <View style={styles.featuredContent}>
                                    <View style={styles.featuredTextContainer}>
                                        <Text style={styles.featuredIcon}>{featuredCategory.icon}</Text>
                                        <Text style={styles.featuredTitle}>
                                            {featuredCategory.name}
                                        </Text>
                                        <Text style={styles.featuredSubtitle}>
                                            ({featuredCategory.productCount} sản phẩm)
                                        </Text>
                                    </View>
                                    <Image
                                        source={{ uri: featuredCategory.image }}
                                        style={styles.featuredImage}
                                        contentFit="cover"
                                    />
                                    {featuredCategory.badge && (
                                        <View style={styles.featuredBadge}>
                                            <Text style={styles.featuredBadgeText}>
                                                {featuredCategory.badge}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* All Categories Grid */}
                    <View style={styles.gridSection}>
                        <View style={styles.categoryGrid}>
                            {regularCategories?.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.categoryItem}
                                    onPress={() =>
                                        navigation.navigate('ProductList', {
                                            categoryId: category.id,
                                            categoryName: category.name,
                                        })
                                    }
                                >
                                    <View style={styles.categoryImageContainer}>
                                        <Image
                                            source={{ uri: category.image }}
                                            style={styles.categoryImage}
                                            contentFit="cover"
                                        />
                                        {category.badge && (
                                            <View style={styles.categoryBadge}>
                                                <Text style={styles.categoryBadgeText}>
                                                    {category.badge}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.categoryName} numberOfLines={2}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },

    header: {
        backgroundColor: '#10B981',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerButton: {
        alignItems: 'center',
        minWidth: 50,
    },
    closeIcon: {
        fontSize: 24,
        color: '#fff',
    },
    homeIcon: {
        fontSize: 24,
    },
    headerButtonText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
        marginTop: 2,
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
    featuredSection: {
        padding: 16,
        paddingBottom: 8,
    },
    featuredCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FCD34D',
    },
    featuredContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        position: 'relative',
    },
    featuredTextContainer: {
        flex: 1,
    },
    featuredIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    featuredSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    featuredImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    featuredBadgeText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    gridSection: {
        paddingHorizontal: 8,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryItem: {
        width: '33.33%',
        padding: 8,
        alignItems: 'center',
    },
    categoryImageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
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
        lineHeight: 16,
        paddingHorizontal: 4,
    },
    bottomSpacing: {
        height: 80,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#10B981',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    floatingButtonIcon: {
        fontSize: 24,
    },
    floatingButtonText: {
        fontSize: 8,
        color: '#fff',
        fontWeight: '600',
        marginTop: 2,
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
