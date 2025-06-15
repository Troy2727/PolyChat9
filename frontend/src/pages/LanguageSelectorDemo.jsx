import { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguageStore } from '../store/useLanguageStore';
import { getLanguageFlag, formatLanguageName } from '../lib/languageUtils';

const LanguageSelectorDemo = () => {
  const { selectedLanguage, recentLanguages, preferences } = useLanguageStore();
  const [selectedLanguage2, setSelectedLanguage2] = useState(null);

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🌍 PolyChat9 Language Selector</h1>
          <p className="text-lg text-base-content/70">
            Advanced language selector with 149+ languages, search, categories, and accessibility features
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Basic Usage */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">🎯 Basic Usage</h2>
              <p className="text-sm text-base-content/70 mb-4">
                Default configuration with all features enabled
              </p>
              
              <div className="space-y-4">
                <LanguageSelector 
                  placeholder="Choose your language"
                  onLanguageChange={(lang) => console.log('Language changed:', lang)}
                />
                
                {selectedLanguage && (
                  <div className="alert alert-success">
                    <div className="flex items-center gap-2">
                      <img
                        src={getLanguageFlag(selectedLanguage)}
                        alt={`${selectedLanguage.name} flag`}
                        className="w-6 h-4 object-cover rounded-sm"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span>
                        Selected: <strong>{selectedLanguage.name}</strong>
                        {selectedLanguage.nativeName !== selectedLanguage.name && (
                          <span className="text-sm opacity-70"> ({selectedLanguage.nativeName})</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Version */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📱 Compact Version</h2>
              <p className="text-sm text-base-content/70 mb-4">
                Small size, no categories, simplified interface
              </p>
              
              <div className="space-y-4">
                <LanguageSelector 
                  size="sm"
                  variant="outline"
                  showCategories={false}
                  placeholder="Language"
                  onLanguageChange={setSelectedLanguage2}
                />
                
                {selectedLanguage2 && (
                  <div className="badge badge-primary gap-2">
                    <img
                      src={getLanguageFlag(selectedLanguage2)}
                      alt={`${selectedLanguage2.name} flag`}
                      className="w-4 h-3 object-cover rounded-sm"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    {selectedLanguage2.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Languages */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">🕒 Recent Languages</h2>
              <p className="text-sm text-base-content/70 mb-4">
                Recently selected languages are automatically tracked
              </p>
              
              <div className="space-y-2">
                {recentLanguages.length > 0 ? (
                  recentLanguages.map((lang, index) => (
                    <div key={lang.code} className="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
                      <span className="badge badge-sm">{index + 1}</span>
                      <img
                        src={getLanguageFlag(lang)}
                        alt={`${lang.name} flag`}
                        className="w-5 h-4 object-cover rounded-sm"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="text-sm">{lang.name}</span>
                      {lang.nativeName !== lang.name && (
                        <span className="text-xs text-base-content/50">({lang.nativeName})</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-base-content/50 py-4">
                    <p>No recent languages yet</p>
                    <p className="text-xs">Select a language to see it here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">⚙️ Current Preferences</h2>
              <p className="text-sm text-base-content/70 mb-4">
                Language selector preferences and settings
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Show Native Names:</span>
                  <span className={preferences.showNativeNames ? 'text-success' : 'text-error'}>
                    {preferences.showNativeNames ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Show Speaker Counts:</span>
                  <span className={preferences.showSpeakerCounts ? 'text-success' : 'text-error'}>
                    {preferences.showSpeakerCounts ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Group by Category:</span>
                  <span className={preferences.groupByCategory ? 'text-success' : 'text-error'}>
                    {preferences.groupByCategory ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Recent Languages:</span>
                  <span className="badge badge-sm">{preferences.maxRecentLanguages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Search Debounce:</span>
                  <span className="badge badge-sm">{preferences.searchDebounceMs}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="card bg-base-200 shadow-xl mt-8">
          <div className="card-body">
            <h2 className="card-title">✨ Features Implemented</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">🔍 Search & Filter</h3>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• Real-time search with debouncing</li>
                  <li>• Search by name, native name, or code</li>
                  <li>• Intelligent relevance sorting</li>
                  <li>• Category-based filtering</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-primary">♿ Accessibility</h3>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• Full keyboard navigation</li>
                  <li>• ARIA labels and roles</li>
                  <li>• Screen reader support</li>
                  <li>• Focus management</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-primary">🎨 UI/UX</h3>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• Beautiful flag icons</li>
                  <li>• Native language names</li>
                  <li>• Category organization</li>
                  <li>• Responsive design</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-primary">💾 Persistence</h3>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• localStorage integration</li>
                  <li>• Recent languages tracking</li>
                  <li>• Browser language detection</li>
                  <li>• Preference management</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-primary">⚡ Performance</h3>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• Virtual scrolling ready</li>
                  <li>• Debounced search</li>
                  <li>• Optimized re-renders</li>
                  <li>• Lazy loading support</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-primary">🌐 Languages</h3>
                <ul className="text-sm space-y-1 text-base-content/70">
                  <li>• 149+ world languages</li>
                  <li>• Popular languages priority</li>
                  <li>• Regional categorization</li>
                  <li>• ISO 639-1 codes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="card bg-base-200 shadow-xl mt-8">
          <div className="card-body">
            <h2 className="card-title">📖 How to Use</h2>
            <div className="prose prose-sm max-w-none">
              <ol>
                <li><strong>Click</strong> the language selector button to open the dropdown</li>
                <li><strong>Search</strong> by typing in the search box (supports name, native name, or language code)</li>
                <li><strong>Browse</strong> by category using the tabs (Popular, European, Asian, etc.)</li>
                <li><strong>Navigate</strong> with keyboard: Arrow keys to move, Enter to select, Escape to close</li>
                <li><strong>Recent</strong> languages appear in the "Recent" tab for quick access</li>
              </ol>
              
              <h3>Keyboard Shortcuts</h3>
              <ul>
                <li><kbd>Space</kbd> or <kbd>Enter</kbd> - Open dropdown</li>
                <li><kbd>↑</kbd> <kbd>↓</kbd> - Navigate options</li>
                <li><kbd>Enter</kbd> - Select highlighted option</li>
                <li><kbd>Escape</kbd> - Close dropdown</li>
                <li><kbd>Tab</kbd> - Close and move to next element</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorDemo;
