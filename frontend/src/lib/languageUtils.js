// Language utility functions for PolyChat9
import { 
  LANGUAGE_DATA, 
  LANGUAGE_BY_CODE, 
  LANGUAGE_BY_NAME, 
  LANGUAGE_CATEGORIES,
  POPULAR_LANGUAGES,
  DEFAULT_LANGUAGE,
  BROWSER_LANGUAGE_FALLBACKS 
} from '../constants/languages.js';

/**
 * Search languages by name, native name, or code
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Filtered language results
 */
export const searchLanguages = (query, options = {}) => {
  if (!query || query.trim().length === 0) {
    return options.includeAll ? LANGUAGE_DATA : POPULAR_LANGUAGES;
  }

  const searchTerm = query.toLowerCase().trim();
  const maxResults = options.maxResults || 50;
  const categories = options.categories || null;

  let results = LANGUAGE_DATA.filter(lang => {
    // Category filter
    if (categories && !categories.includes(lang.category)) {
      return false;
    }

    // Text matching
    return (
      lang.name.toLowerCase().includes(searchTerm) ||
      lang.nativeName.toLowerCase().includes(searchTerm) ||
      lang.code.toLowerCase().includes(searchTerm) ||
      lang.code.toLowerCase().startsWith(searchTerm)
    );
  });

  // Sort by relevance
  results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aNative = a.nativeName.toLowerCase();
    const bNative = b.nativeName.toLowerCase();
    const aCode = a.code.toLowerCase();
    const bCode = b.code.toLowerCase();

    // Exact matches first
    if (aName === searchTerm) return -1;
    if (bName === searchTerm) return 1;
    if (aNative === searchTerm) return -1;
    if (bNative === searchTerm) return 1;
    if (aCode === searchTerm) return -1;
    if (bCode === searchTerm) return 1;

    // Starts with matches
    if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
    if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
    if (aNative.startsWith(searchTerm) && !bNative.startsWith(searchTerm)) return -1;
    if (bNative.startsWith(searchTerm) && !aNative.startsWith(searchTerm)) return 1;
    if (aCode.startsWith(searchTerm) && !bCode.startsWith(searchTerm)) return -1;
    if (bCode.startsWith(searchTerm) && !bNative.startsWith(searchTerm)) return 1;

    // Sort by speaker count for remaining matches
    return b.speakers - a.speakers;
  });

  return results.slice(0, maxResults);
};

/**
 * Get languages by category
 * @param {string} category - Language category
 * @returns {Array} Languages in the category
 */
export const getLanguagesByCategory = (category) => {
  return LANGUAGE_DATA
    .filter(lang => lang.category === category)
    .sort((a, b) => b.speakers - a.speakers);
};

/**
 * Get language by code
 * @param {string} code - Language code
 * @returns {Object|null} Language object or null
 */
export const getLanguageByCode = (code) => {
  return LANGUAGE_BY_CODE[code] || null;
};

/**
 * Get language by name
 * @param {string} name - Language name
 * @returns {Object|null} Language object or null
 */
export const getLanguageByName = (name) => {
  return LANGUAGE_BY_NAME[name.toLowerCase()] || null;
};

/**
 * Get flag URL for a language
 * @param {Object|string} language - Language object or flag code
 * @returns {string} Flag URL
 */
export const getLanguageFlag = (language) => {
  if (!language) return null;
  
  const flagCode = typeof language === 'string' ? language : language.flag;
  if (!flagCode) return null;

  // Handle special flag codes
  const specialFlags = {
    'gb-wls': 'wales',
    'gb-sct': 'scotland',
    'eo': 'esperanto',
    'ia': 'interlingua',
    'ie': 'interlingue'
  };

  const actualFlag = specialFlags[flagCode] || flagCode;
  
  // Use flagcdn.com for standard flags, custom handling for special ones
  if (specialFlags[flagCode]) {
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_${actualFlag}.svg/32px-Flag_of_${actualFlag}.svg.png`;
  }
  
  return `https://flagcdn.com/24x18/${actualFlag}.png`;
};

/**
 * Detect browser language and find best match
 * @returns {Object} Best matching language
 */
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Try exact match first
  let language = getLanguageByCode(langCode);
  if (language) return language;
  
  // Try fallback languages
  for (const fallback of BROWSER_LANGUAGE_FALLBACKS) {
    language = getLanguageByCode(fallback);
    if (language) return language;
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * Format language display name
 * @param {Object} language - Language object
 * @param {Object} options - Display options
 * @returns {string} Formatted display name
 */
export const formatLanguageName = (language, options = {}) => {
  if (!language) return '';
  
  const { showNative = false, showCode = false, showSpeakers = false } = options;
  
  let name = language.name;
  
  if (showNative && language.nativeName !== language.name) {
    name += ` (${language.nativeName})`;
  }
  
  if (showCode) {
    name += ` [${language.code}]`;
  }
  
  if (showSpeakers) {
    const speakers = formatSpeakerCount(language.speakers);
    name += ` • ${speakers} speakers`;
  }
  
  return name;
};

/**
 * Format speaker count in human-readable format
 * @param {number} count - Speaker count
 * @returns {string} Formatted count
 */
export const formatSpeakerCount = (count) => {
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B`;
  } else if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Group languages by category with sorting
 * @param {Array} languages - Array of languages
 * @returns {Object} Grouped languages by category
 */
export const groupLanguagesByCategory = (languages) => {
  const grouped = {};
  
  languages.forEach(lang => {
    if (!grouped[lang.category]) {
      grouped[lang.category] = [];
    }
    grouped[lang.category].push(lang);
  });
  
  // Sort each category by speaker count
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => b.speakers - a.speakers);
  });
  
  return grouped;
};

/**
 * Get popular languages for quick access
 * @param {number} limit - Number of languages to return
 * @returns {Array} Popular languages
 */
export const getPopularLanguages = (limit = 10) => {
  return POPULAR_LANGUAGES.slice(0, limit);
};

/**
 * Validate language code
 * @param {string} code - Language code to validate
 * @returns {boolean} Whether the code is valid
 */
export const isValidLanguageCode = (code) => {
  return Boolean(LANGUAGE_BY_CODE[code]);
};

/**
 * Get language suggestions based on user's current languages
 * @param {Array} userLanguages - User's current language codes
 * @param {number} limit - Number of suggestions
 * @returns {Array} Suggested languages
 */
export const getLanguageSuggestions = (userLanguages = [], limit = 5) => {
  const userLangCodes = new Set(userLanguages);
  
  // Filter out languages user already has
  const available = LANGUAGE_DATA.filter(lang => !userLangCodes.has(lang.code));
  
  // Prioritize popular languages
  const suggestions = available
    .sort((a, b) => {
      // Popular category gets priority
      if (a.category === 'popular' && b.category !== 'popular') return -1;
      if (b.category === 'popular' && a.category !== 'popular') return 1;
      
      // Then sort by speaker count
      return b.speakers - a.speakers;
    })
    .slice(0, limit);
    
  return suggestions;
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get all available categories sorted by order
 * @returns {Array} Sorted categories
 */
export const getSortedCategories = () => {
  return Object.entries(LANGUAGE_CATEGORIES)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, value]) => ({ key, ...value }));
};
