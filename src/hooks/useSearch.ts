// src/hooks/useSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { searchApi } from '../api/searchApi';
import { Product, SearchHistory } from '../types/product';
import { useAuthStore } from '../store/authStore';

export interface UseSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  submittedQuery: string;
  searchResults: Product[];
  isSearching: boolean;
  searchHistory: SearchHistory[];
  isLoadingHistory: boolean;
  saveSearch: (keyword: string) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  suggestions: string[];
  submitSearch: (query?: string) => void;
}

export const useSearch = (): UseSearchResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  // Submit search function
  const submitSearch = useCallback((query?: string) => {
    const queryToSubmit = query !== undefined ? query : searchQuery;
    if (queryToSubmit.trim().length > 0) {
      setSubmittedQuery(queryToSubmit.trim());
    }
  }, [searchQuery]);

  // Search products
  const {
    data: searchResults = [],
    isLoading: isSearching,
  } = useQuery({
    queryKey: ['search', submittedQuery],
    queryFn: () => productApi.searchProducts(submittedQuery),
    enabled: submittedQuery.length > 0,
  });

  // Get search history
  const {
    data: searchHistory = [],
    isLoading: isLoadingHistory,
  } = useQuery({
    queryKey: ['searchHistory', userId],
    queryFn: () => userId ? searchApi.getSearchHistory(userId) : [],
    enabled: !!userId,
  });

  // Save search mutation
  const saveSearchMutation = useMutation({
    mutationFn: (keyword: string) => {
      if (!userId) return Promise.resolve({} as SearchHistory);
      return searchApi.saveSearchHistory(userId, keyword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] });
    },
  });

  // Clear history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: () => {
      if (!userId) return Promise.resolve();
      return searchApi.clearSearchHistory(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] });
    },
  });

  // Delete history item mutation
  const deleteHistoryItemMutation = useMutation({
    mutationFn: (id: string) => searchApi.deleteSearchHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory', userId] });
    },
  });

  // Generate suggestions from search history and current query
  const suggestions = useCallback(() => {
    if (!searchQuery) {
      return searchHistory.map(h => h.keyword).slice(0, 5);
    }

    const matchingHistory = searchHistory
      .filter(h => h.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(h => h.keyword);

    const matchingTags = searchResults
      .flatMap(p => p.tags)
      .filter((tag, index, self) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
        self.indexOf(tag) === index
      );

    return [...new Set([...matchingHistory, ...matchingTags])].slice(0, 5);
  }, [searchQuery, searchHistory, searchResults]);

  return {
    searchQuery,
    setSearchQuery,
    submittedQuery,
    searchResults,
    isSearching,
    searchHistory,
    isLoadingHistory,
    saveSearch: saveSearchMutation.mutate,
    clearHistory: clearHistoryMutation.mutate,
    deleteHistoryItem: deleteHistoryItemMutation.mutate,
    suggestions: suggestions(),
    submitSearch,
  };
};
