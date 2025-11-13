// src/screens/Home/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductCard } from '../../components/ProductCard';
import { useSearch } from '../../hooks/useSearch';
import { useWishlist } from '../../hooks/useWishlist';
import Ionicons from '@expo/vector-icons/Ionicons';
type Props = NativeStackScreenProps<any, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    searchResults,
    isSearching,
    searchHistory,
    saveSearch,
    clearHistory,
    deleteHistoryItem,
    suggestions,
  } = useSearch();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    // Show history when search is empty
    setShowHistory(searchQuery.length === 0);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      saveSearch(query);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    saveSearch(suggestion);
    setShowHistory(false);
  };

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.searchInputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearHistoryText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchHistory.length === 0 ? (
        <Text style={styles.emptyHistoryText}>Chưa có lịch sử tìm kiếm</Text>
      ) : (
        <ScrollView style={styles.historyList}>
          {searchHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <TouchableOpacity
                style={styles.historyItemContent}
                onPress={() => handleSelectSuggestion(item.keyword)}
              >
                <Text style={styles.historyIcon}>🕐</Text>
                <Text style={styles.historyKeyword}>{item.keyword}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteHistoryItem(item.id)}
                style={styles.deleteHistoryButton}
              >
                <Text style={styles.deleteHistoryIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderSuggestions = () => {
    if (searchQuery.length === 0 || suggestions.length === 0) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Gợi ý</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => handleSelectSuggestion(suggestion)}
          >
            <Text style={styles.suggestionIcon}>🔍</Text>
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      );
    }

    if (debouncedQuery.length === 0) {
      return null;
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            Không tìm thấy sản phẩm "{debouncedQuery}"
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          Kết quả tìm kiếm ({searchResults.length})
        </Text>
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: item.id })
                }
                onWishlistPress={() => toggleWishlist(item.id)}
                isInWishlist={isInWishlist(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsList}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSearchBar()}

      {showHistory ? (
        renderHistory()
      ) : (
        <>
          {renderSuggestions()}
          {renderSearchResults()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  clearIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#EF4444',
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 40,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIcon: {
    fontSize: 18,
  },
  historyKeyword: {
    fontSize: 15,
    color: '#1F2937',
  },
  deleteHistoryButton: {
    padding: 4,
  },
  deleteHistoryIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionIcon: {
    fontSize: 16,
  },
  suggestionText: {
    fontSize: 14,
    color: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    padding: 16,
    backgroundColor: '#fff',
  },
  resultsList: {
    padding: 12,
  },
  productItem: {
    width: '50%',
    padding: 4,
  }, searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
});
