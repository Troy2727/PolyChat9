import { useState, useEffect, useCallback } from 'react';
import { detectBrowserLanguage, getLanguageByCode } from '../lib/languageUtils.js';

/**
 * Custom hook for detecting and managing browser language preferences
 * @param {Object} options - Configuration options
 * @returns {Object} Language detection state and methods
 */
export const useLanguageDetection = (options = {}) => {
  const {
    enableAutoDetection = true,
    fallbackLanguage = 'en',
    onLanguageDetected = null,
    detectOnMount = true,
    watchLanguageChange = true,
  } = options;

  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState(null);
  const [browserLanguages, setBrowserLanguages] = useState([]);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  /**
   * Detect browser language with fallback handling
   */
  const detectLanguage = useCallback(async () => {
    if (!enableAutoDetection) return;

    setIsDetecting(true);
    setDetectionError(null);

    try {
      // Get browser languages
      const languages = navigator.languages || [navigator.language || 'en'];
      setBrowserLanguages(languages);

      // Find best match
      let bestMatch = null;
      const supported = [];

      for (const browserLang of languages) {
        // Try full language code first (e.g., 'en-US')
        let langCode = browserLang.toLowerCase();
        let language = getLanguageByCode(langCode);

        // If not found, try just the language part (e.g., 'en')
        if (!language) {
          langCode = browserLang.split('-')[0].toLowerCase();
          language = getLanguageByCode(langCode);
        }

        if (language) {
          supported.push(language);
          if (!bestMatch) {
            bestMatch = language;
          }
        }
      }

      setSupportedLanguages(supported);

      // Use fallback if no match found
      if (!bestMatch) {
        bestMatch = getLanguageByCode(fallbackLanguage) || detectBrowserLanguage();
      }

      setDetectedLanguage(bestMatch);

      // Notify callback
      if (onLanguageDetected && bestMatch) {
        onLanguageDetected(bestMatch);
      }

    } catch (error) {
      console.warn('Language detection failed:', error);
      setDetectionError(error);
      
      // Use fallback language
      const fallback = getLanguageByCode(fallbackLanguage) || detectBrowserLanguage();
      setDetectedLanguage(fallback);
      
      if (onLanguageDetected && fallback) {
        onLanguageDetected(fallback);
      }
    } finally {
      setIsDetecting(false);
    }
  }, [enableAutoDetection, fallbackLanguage, onLanguageDetected]);

  /**
   * Handle language change events
   */
  const handleLanguageChange = useCallback(() => {
    if (watchLanguageChange) {
      detectLanguage();
    }
  }, [detectLanguage, watchLanguageChange]);

  /**
   * Get user's preferred languages in order
   */
  const getPreferredLanguages = useCallback(() => {
    return browserLanguages.map(lang => {
      const code = lang.split('-')[0].toLowerCase();
      return getLanguageByCode(code);
    }).filter(Boolean);
  }, [browserLanguages]);

  /**
   * Check if a language is supported by the browser
   */
  const isLanguageSupported = useCallback((languageCode) => {
    return supportedLanguages.some(lang => lang.code === languageCode);
  }, [supportedLanguages]);

  /**
   * Get language preference score (higher = more preferred)
   */
  const getLanguagePreferenceScore = useCallback((languageCode) => {
    const index = browserLanguages.findIndex(lang => 
      lang.toLowerCase().startsWith(languageCode.toLowerCase())
    );
    return index >= 0 ? browserLanguages.length - index : 0;
  }, [browserLanguages]);

  /**
   * Force re-detection
   */
  const redetect = useCallback(() => {
    detectLanguage();
  }, [detectLanguage]);

  /**
   * Get browser locale information
   */
  const getBrowserLocaleInfo = useCallback(() => {
    try {
      const locale = new Intl.Locale(navigator.language);
      return {
        language: locale.language,
        region: locale.region,
        script: locale.script,
        calendar: locale.calendar,
        numberingSystem: locale.numberingSystem,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    } catch (error) {
      console.warn('Failed to get locale info:', error);
      return {
        language: navigator.language?.split('-')[0] || 'en',
        region: null,
        script: null,
        calendar: null,
        numberingSystem: null,
        timeZone: null,
      };
    }
  }, []);

  /**
   * Check if browser supports Intl APIs
   */
  const checkIntlSupport = useCallback(() => {
    return {
      Intl: typeof Intl !== 'undefined',
      Locale: typeof Intl?.Locale !== 'undefined',
      DateTimeFormat: typeof Intl?.DateTimeFormat !== 'undefined',
      NumberFormat: typeof Intl?.NumberFormat !== 'undefined',
      Collator: typeof Intl?.Collator !== 'undefined',
      RelativeTimeFormat: typeof Intl?.RelativeTimeFormat !== 'undefined',
    };
  }, []);

  // Effect for initial detection
  useEffect(() => {
    if (detectOnMount) {
      detectLanguage();
    }
  }, [detectOnMount, detectLanguage]);

  // Effect for language change detection
  useEffect(() => {
    if (!watchLanguageChange) return;

    // Listen for language change events (if supported)
    const handleStorageChange = (e) => {
      if (e.key === 'language' || e.key === 'locale') {
        handleLanguageChange();
      }
    };

    // Listen for storage changes (other tabs changing language)
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [watchLanguageChange, handleLanguageChange]);

  return {
    // State
    detectedLanguage,
    isDetecting,
    detectionError,
    browserLanguages,
    supportedLanguages,

    // Methods
    detectLanguage,
    redetect,
    getPreferredLanguages,
    isLanguageSupported,
    getLanguagePreferenceScore,
    getBrowserLocaleInfo,
    checkIntlSupport,

    // Computed values
    hasDetectedLanguage: Boolean(detectedLanguage),
    isDetectionSupported: typeof navigator !== 'undefined' && Boolean(navigator.language),
    preferredLanguageCount: supportedLanguages.length,
    intlSupport: checkIntlSupport(),
  };
};

/**
 * Hook for simple language detection without state management
 * @returns {Object} Detected language and basic info
 */
export const useSimpleLanguageDetection = () => {
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const detected = detectBrowserLanguage();
    setLanguage(detected);
  }, []);

  return {
    language,
    isReady: Boolean(language),
  };
};

/**
 * Hook for watching language changes in real-time
 * @param {Function} callback - Called when language changes
 * @returns {Object} Current language and change handler
 */
export const useLanguageChangeWatcher = (callback) => {
  const [currentLanguage, setCurrentLanguage] = useState(null);

  useEffect(() => {
    const detected = detectBrowserLanguage();
    setCurrentLanguage(detected);
    
    if (callback) {
      callback(detected);
    }
  }, [callback]);

  const updateLanguage = useCallback((newLanguage) => {
    setCurrentLanguage(newLanguage);
    if (callback) {
      callback(newLanguage);
    }
  }, [callback]);

  return {
    currentLanguage,
    updateLanguage,
  };
};

export default useLanguageDetection;
