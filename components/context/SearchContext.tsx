"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  searchCategories: string[];
  showApplyNowOnly: boolean;
  isSearchOpen: boolean;
  setSearchQuery: (query: string) => void;
  setSearchCategories: (categories: string[]) => void;
  setShowApplyNowOnly: (show: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [showApplyNowOnly, setShowApplyNowOnly] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchCategories([]);
    setShowApplyNowOnly(false);
    setIsSearchOpen(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchCategories,
        showApplyNowOnly,
        isSearchOpen,
        setSearchQuery,
        setSearchCategories,
        setShowApplyNowOnly,
        setIsSearchOpen,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
