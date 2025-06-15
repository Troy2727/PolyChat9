import { create } from "zustand";
import { detectBrowserLanguage, getLanguageByCode } from "../lib/languageUtils.js";

// Storage keys
const STORAGE_KEYS = {
  SELECTED_LANGUAGE: "polychat9-selected-language",
  RECENT_LANGUAGES: "polychat9-recent-languages",
  LANGUAGE_PREFERENCES: "polychat9-language-preferences",
};

// Helper functions for localStorage
const getStoredValue = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse stored value for ${key}:`, error);
    return defaultValue;
  }
};

const setStoredValue = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to store value for ${key}:`, error);
  }
};

// Initialize default language
const getInitialLanguage = () => {
  const storedCode = getStoredValue(STORAGE_KEYS.SELECTED_LANGUAGE, null);
  if (storedCode) {
    const language = getLanguageByCode(storedCode);
    if (language) return language;
  }
  return detectBrowserLanguage();
};

// Initialize recent languages
const getInitialRecentLanguages = () => {
  return getStoredValue(STORAGE_KEYS.RECENT_LANGUAGES, []);
};

// Initialize language preferences
const getInitialPreferences = () => {
  return getStoredValue(STORAGE_KEYS.LANGUAGE_PREFERENCES, {
    showNativeNames: true,
    showSpeakerCounts: false,
    showLanguageCodes: false,
    groupByCategory: true,
    maxRecentLanguages: 5,
    searchDebounceMs: 300,
    enableKeyboardNavigation: true,
    enableVirtualScrolling: true,
    preferredCategories: ['popular', 'recent'],
  });
};

export const useLanguageStore = create((set, get) => ({
  // Current state
  selectedLanguage: getInitialLanguage(),
  recentLanguages: getInitialRecentLanguages(),
  preferences: getInitialPreferences(),
  isDropdownOpen: false,
  searchQuery: "",
  filteredLanguages: [],
  selectedIndex: -1,
  isLoading: false,
  error: null,

  // Language selection actions
  setSelectedLanguage: (language) => {
    const currentState = get();
    
    set({ 
      selectedLanguage: language,
      isDropdownOpen: false,
      searchQuery: "",
      selectedIndex: -1,
    });
    
    // Store in localStorage
    setStoredValue(STORAGE_KEYS.SELECTED_LANGUAGE, language.code);
    
    // Add to recent languages
    currentState.addToRecentLanguages(language);
    
    // Notify listeners (for parent component integration)
    currentState.notifyLanguageChange(language);
  },

  // Recent languages management
  addToRecentLanguages: (language) => {
    const { recentLanguages, preferences } = get();
    const maxRecent = preferences.maxRecentLanguages;
    
    // Remove if already exists
    const filtered = recentLanguages.filter(lang => lang.code !== language.code);
    
    // Add to beginning
    const updated = [language, ...filtered].slice(0, maxRecent);
    
    set({ recentLanguages: updated });
    setStoredValue(STORAGE_KEYS.RECENT_LANGUAGES, updated);
  },

  clearRecentLanguages: () => {
    set({ recentLanguages: [] });
    setStoredValue(STORAGE_KEYS.RECENT_LANGUAGES, []);
  },

  // Dropdown state management
  openDropdown: () => {
    set({ 
      isDropdownOpen: true,
      selectedIndex: -1,
    });
  },

  closeDropdown: () => {
    set({ 
      isDropdownOpen: false,
      searchQuery: "",
      selectedIndex: -1,
    });
  },

  toggleDropdown: () => {
    const { isDropdownOpen } = get();
    if (isDropdownOpen) {
      get().closeDropdown();
    } else {
      get().openDropdown();
    }
  },

  // Search functionality
  setSearchQuery: (query) => {
    set({ 
      searchQuery: query,
      selectedIndex: -1,
    });
  },

  setFilteredLanguages: (languages) => {
    set({ filteredLanguages: languages });
  },

  // Keyboard navigation
  setSelectedIndex: (index) => {
    set({ selectedIndex: index });
  },

  navigateUp: () => {
    const { selectedIndex, filteredLanguages } = get();
    const newIndex = selectedIndex <= 0 ? filteredLanguages.length - 1 : selectedIndex - 1;
    set({ selectedIndex: newIndex });
  },

  navigateDown: () => {
    const { selectedIndex, filteredLanguages } = get();
    const newIndex = selectedIndex >= filteredLanguages.length - 1 ? 0 : selectedIndex + 1;
    set({ selectedIndex: newIndex });
  },

  selectCurrentIndex: () => {
    const { selectedIndex, filteredLanguages } = get();
    if (selectedIndex >= 0 && selectedIndex < filteredLanguages.length) {
      const language = filteredLanguages[selectedIndex];
      get().setSelectedLanguage(language);
    }
  },

  // Preferences management
  updatePreferences: (newPreferences) => {
    const { preferences } = get();
    const updated = { ...preferences, ...newPreferences };
    
    set({ preferences: updated });
    setStoredValue(STORAGE_KEYS.LANGUAGE_PREFERENCES, updated);
  },

  resetPreferences: () => {
    const defaultPreferences = getInitialPreferences();
    set({ preferences: defaultPreferences });
    setStoredValue(STORAGE_KEYS.LANGUAGE_PREFERENCES, defaultPreferences);
  },

  // Loading and error states
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Language change notification system
  languageChangeListeners: new Set(),

  addLanguageChangeListener: (listener) => {
    const { languageChangeListeners } = get();
    languageChangeListeners.add(listener);
  },

  removeLanguageChangeListener: (listener) => {
    const { languageChangeListeners } = get();
    languageChangeListeners.delete(listener);
  },

  notifyLanguageChange: (language) => {
    const { languageChangeListeners } = get();
    languageChangeListeners.forEach(listener => {
      try {
        listener(language);
      } catch (error) {
        console.warn("Error in language change listener:", error);
      }
    });
  },

  // Utility actions
  reset: () => {
    set({
      selectedLanguage: detectBrowserLanguage(),
      recentLanguages: [],
      isDropdownOpen: false,
      searchQuery: "",
      filteredLanguages: [],
      selectedIndex: -1,
      isLoading: false,
      error: null,
    });
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.SELECTED_LANGUAGE);
    localStorage.removeItem(STORAGE_KEYS.RECENT_LANGUAGES);
  },

  // Get current language info
  getCurrentLanguageInfo: () => {
    const { selectedLanguage, preferences } = get();
    return {
      language: selectedLanguage,
      displayName: selectedLanguage?.name || "Unknown",
      nativeName: selectedLanguage?.nativeName || "",
      flag: selectedLanguage?.flag || "",
      code: selectedLanguage?.code || "",
      showNative: preferences.showNativeNames,
    };
  },

  // Bulk operations
  setMultipleLanguages: (languages) => {
    const { preferences } = get();
    const maxRecent = preferences.maxRecentLanguages;
    
    // Update recent languages with the provided list
    const updated = languages.slice(0, maxRecent);
    set({ recentLanguages: updated });
    setStoredValue(STORAGE_KEYS.RECENT_LANGUAGES, updated);
  },

  // Analytics and usage tracking
  trackLanguageUsage: (language, action = 'select') => {
    // This can be extended to send analytics data
    console.log(`Language ${action}:`, language.name, language.code);
  },

  // Accessibility helpers
  getAriaLabel: () => {
    const { selectedLanguage, isDropdownOpen, filteredLanguages } = get();
    const languageName = selectedLanguage?.name || "No language selected";
    const status = isDropdownOpen ? "expanded" : "collapsed";
    const resultCount = filteredLanguages.length;
    
    return `Language selector, currently ${languageName}, ${status}${
      isDropdownOpen ? `, ${resultCount} languages available` : ""
    }`;
  },

  getOptionAriaLabel: (language, index, isSelected) => {
    const position = `${index + 1} of ${get().filteredLanguages.length}`;
    const selection = isSelected ? ", selected" : "";
    return `${language.name} (${language.nativeName}), ${position}${selection}`;
  },
}));
