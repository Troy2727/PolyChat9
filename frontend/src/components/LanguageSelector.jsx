import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronDownIcon, 
  SearchIcon, 
  GlobeIcon, 
  XIcon,
  CheckIcon,
  ClockIcon,
  StarIcon
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore.js';
import { 
  searchLanguages, 
  getLanguagesByCategory, 
  getLanguageFlag, 
  formatLanguageName,
  debounce,
  getSortedCategories
} from '../lib/languageUtils.js';
import { LANGUAGE_CATEGORIES } from '../constants/languages.js';

const LanguageSelector = ({ 
  className = "",
  placeholder = "Select language",
  showSearch = true,
  showCategories = true,
  showRecentLanguages = true,
  maxHeight = "400px",
  onLanguageChange = null,
  disabled = false,
  size = "md",
  variant = "default"
}) => {
  // Store state
  const {
    selectedLanguage,
    recentLanguages,
    isDropdownOpen,
    searchQuery,
    filteredLanguages,
    selectedIndex,
    preferences,
    setSelectedLanguage,
    openDropdown,
    closeDropdown,
    setSearchQuery,
    setFilteredLanguages,
    setSelectedIndex,
    navigateUp,
    navigateDown,
    selectCurrentIndex,
    addLanguageChangeListener,
    removeLanguageChangeListener,
    getAriaLabel,
    getOptionAriaLabel
  } = useLanguageStore();

  // Local state
  const [activeCategory, setActiveCategory] = useState('popular');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Refs
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const triggerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      const results = searchLanguages(query, {
        maxResults: 50,
        includeAll: true
      });
      setFilteredLanguages(results);
    }, preferences.searchDebounceMs),
    [preferences.searchDebounceMs]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedIndex(-1);
    
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      // Show popular languages when no search query
      setFilteredLanguages(getLanguagesByCategory('popular'));
    }
  };

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    
    // Call external callback
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchQuery("");
    
    if (category === 'recent') {
      setFilteredLanguages(recentLanguages);
    } else {
      setFilteredLanguages(getLanguagesByCategory(category));
    }
    
    setSelectedIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
        setTimeout(() => {
          if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        navigateDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateUp();
        break;
      case 'Enter':
        e.preventDefault();
        selectCurrentIndex();
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        triggerRef.current?.focus();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen, closeDropdown]);

  // Initialize filtered languages
  useEffect(() => {
    if (isDropdownOpen && filteredLanguages.length === 0) {
      if (searchQuery.trim()) {
        debouncedSearch(searchQuery);
      } else if (activeCategory === 'recent') {
        setFilteredLanguages(recentLanguages);
      } else {
        setFilteredLanguages(getLanguagesByCategory(activeCategory));
      }
    }
  }, [isDropdownOpen, activeCategory, recentLanguages, searchQuery, filteredLanguages.length, debouncedSearch]);

  // Register language change listener
  useEffect(() => {
    if (onLanguageChange) {
      addLanguageChangeListener(onLanguageChange);
      return () => removeLanguageChangeListener(onLanguageChange);
    }
  }, [onLanguageChange, addLanguageChangeListener, removeLanguageChangeListener]);

  // Size classes
  const sizeClasses = {
    sm: "btn-sm text-sm",
    md: "btn-md text-base", 
    lg: "btn-lg text-lg"
  };

  // Variant classes
  const variantClasses = {
    default: "btn-ghost",
    outline: "btn-outline",
    filled: "btn-primary"
  };

  return (
    <div className={`dropdown dropdown-end ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        tabIndex={0}
        className={`btn ${sizeClasses[size]} ${variantClasses[variant]} gap-2 ${disabled ? 'btn-disabled' : ''}`}
        onClick={isDropdownOpen ? closeDropdown : openDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={getAriaLabel()}
        aria-expanded={isDropdownOpen}
        aria-haspopup="listbox"
      >
        {selectedLanguage ? (
          <>
            <img
              src={getLanguageFlag(selectedLanguage)}
              alt={`${selectedLanguage.name} flag`}
              className="w-5 h-4 object-cover rounded-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="truncate max-w-32">
              {preferences.showNativeNames && selectedLanguage.nativeName !== selectedLanguage.name
                ? selectedLanguage.nativeName
                : selectedLanguage.name
              }
            </span>
          </>
        ) : (
          <>
            <GlobeIcon className="w-5 h-5" />
            <span>{placeholder}</span>
          </>
        )}
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div
          tabIndex={0}
          className="dropdown-content mt-2 p-0 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
          w-80 border border-base-content/10 overflow-hidden"
          style={{ maxHeight }}
        >
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b border-base-content/10">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search languages..."
                  className="input input-sm w-full pl-10 pr-8 bg-base-100 border-base-content/20 
                  focus:border-primary focus:outline-none"
                  aria-label="Search languages"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilteredLanguages(getLanguagesByCategory(activeCategory));
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 
                    hover:bg-base-content/10 rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          {showCategories && !searchQuery && (
            <div className="flex overflow-x-auto p-2 gap-1 border-b border-base-content/10">
              {/* Recent Languages Tab */}
              {showRecentLanguages && recentLanguages.length > 0 && (
                <button
                  onClick={() => handleCategoryChange('recent')}
                  className={`btn btn-xs gap-1 flex-shrink-0 ${
                    activeCategory === 'recent' ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  <ClockIcon className="w-3 h-3" />
                  Recent
                </button>
              )}
              
              {/* Popular Languages Tab */}
              <button
                onClick={() => handleCategoryChange('popular')}
                className={`btn btn-xs gap-1 flex-shrink-0 ${
                  activeCategory === 'popular' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                <StarIcon className="w-3 h-3" />
                Popular
              </button>

              {/* Other Category Tabs */}
              {getSortedCategories()
                .filter(cat => cat.key !== 'popular' && cat.key !== 'recent')
                .slice(0, 3)
                .map(category => (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryChange(category.key)}
                    className={`btn btn-xs gap-1 flex-shrink-0 ${
                      activeCategory === category.key ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.label.split(' ')[0]}</span>
                  </button>
                ))}
            </div>
          )}

          {/* Language List */}
          <div 
            ref={listRef}
            className="max-h-64 overflow-y-auto"
            role="listbox"
            aria-label="Language options"
          >
            {filteredLanguages.length > 0 ? (
              <div className="p-1">
                {filteredLanguages.map((language, index) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`
                      w-full px-3 py-2 rounded-xl flex items-center gap-3 transition-colors text-left
                      ${selectedIndex === index ? 'bg-primary/20 text-primary' : 'hover:bg-base-content/5'}
                      ${selectedLanguage?.code === language.code ? 'bg-primary/10' : ''}
                    `}
                    role="option"
                    aria-selected={selectedLanguage?.code === language.code}
                    aria-label={getOptionAriaLabel(language, index, selectedIndex === index)}
                  >
                    <img
                      src={getLanguageFlag(language)}
                      alt={`${language.name} flag`}
                      className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{language.name}</div>
                      {preferences.showNativeNames && language.nativeName !== language.name && (
                        <div className="text-sm text-base-content/70 truncate">
                          {language.nativeName}
                        </div>
                      )}
                    </div>
                    {selectedLanguage?.code === language.code && (
                      <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-base-content/50">
                <GlobeIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No languages found</p>
                {searchQuery && (
                  <p className="text-sm mt-1">Try a different search term</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
