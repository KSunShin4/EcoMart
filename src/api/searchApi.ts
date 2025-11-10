// src/api/searchApi.ts
import client from './client';
import { SearchHistory } from '../types/product';

export const searchApi = {
  // Get search history
  getSearchHistory: async (userId: string): Promise<SearchHistory[]> => {
    const response = await client.get<SearchHistory[]>('/searchHistory', {
      params: { userId },
    });
    return response.data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10); // Get latest 10 searches
  },

  // Save search history
  saveSearchHistory: async (userId: string, keyword: string): Promise<SearchHistory> => {
    const response = await client.post<SearchHistory>('/searchHistory', {
      userId,
      keyword,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Clear search history
  clearSearchHistory: async (userId: string): Promise<void> => {
    const history = await searchApi.getSearchHistory(userId);
    await Promise.all(history.map(item => client.delete(`/searchHistory/${item.id}`)));
  },

  // Delete single search history item
  deleteSearchHistoryItem: async (id: string): Promise<void> => {
    await client.delete(`/searchHistory/${id}`);
  },
};
