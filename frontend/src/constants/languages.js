// Comprehensive language data for PolyChat9
// ISO 639-1 language codes with country flags and metadata

export const LANGUAGE_DATA = [
  // Popular/Major Languages (Top 20)
  { code: 'en', name: 'English', nativeName: 'English', flag: 'us', category: 'popular', speakers: 1500000000 },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', flag: 'cn', category: 'popular', speakers: 918000000 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'in', category: 'popular', speakers: 600000000 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'es', category: 'popular', speakers: 500000000 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'fr', category: 'popular', speakers: 280000000 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'sa', category: 'popular', speakers: 422000000 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: 'bd', category: 'popular', speakers: 300000000 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'ru', category: 'popular', speakers: 258000000 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'pt', category: 'popular', speakers: 260000000 },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: 'id', category: 'popular', speakers: 270000000 },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: 'pk', category: 'popular', speakers: 230000000 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'de', category: 'popular', speakers: 132000000 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'jp', category: 'popular', speakers: 125000000 },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: 'ke', category: 'popular', speakers: 200000000 },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: 'in', category: 'popular', speakers: 83000000 },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: 'in', category: 'popular', speakers: 96000000 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: 'tr', category: 'popular', speakers: 88000000 },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: 'kr', category: 'popular', speakers: 81000000 },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: 'vn', category: 'popular', speakers: 85000000 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'it', category: 'popular', speakers: 65000000 },

  // European Languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: 'nl', category: 'european', speakers: 24000000 },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: 'pl', category: 'european', speakers: 45000000 },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: 'ua', category: 'european', speakers: 40000000 },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: 'cz', category: 'european', speakers: 10000000 },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: 'sk', category: 'european', speakers: 5000000 },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: 'hu', category: 'european', speakers: 13000000 },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: 'ro', category: 'european', speakers: 24000000 },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: 'bg', category: 'european', speakers: 8000000 },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: 'hr', category: 'european', speakers: 5000000 },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: 'rs', category: 'european', speakers: 12000000 },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: 'si', category: 'european', speakers: 2000000 },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: 'lt', category: 'european', speakers: 3000000 },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: 'lv', category: 'european', speakers: 2000000 },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: 'ee', category: 'european', speakers: 1000000 },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: 'fi', category: 'european', speakers: 5000000 },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: 'se', category: 'european', speakers: 10000000 },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: 'no', category: 'european', speakers: 5000000 },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: 'dk', category: 'european', speakers: 6000000 },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: 'is', category: 'european', speakers: 400000 },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: 'ie', category: 'european', speakers: 1800000 },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: 'gb-wls', category: 'european', speakers: 900000 },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: 'mt', category: 'european', speakers: 500000 },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: 'al', category: 'european', speakers: 7000000 },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: 'mk', category: 'european', speakers: 2000000 },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: 'by', category: 'european', speakers: 5000000 },

  // Asian Languages
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: 'th', category: 'asian', speakers: 60000000 },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: 'mm', category: 'asian', speakers: 33000000 },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: 'kh', category: 'asian', speakers: 16000000 },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: 'la', category: 'asian', speakers: 30000000 },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: 'ge', category: 'asian', speakers: 4000000 },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: 'am', category: 'asian', speakers: 7000000 },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: 'az', category: 'asian', speakers: 23000000 },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', flag: 'kz', category: 'asian', speakers: 13000000 },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргыз', flag: 'kg', category: 'asian', speakers: 4000000 },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', flag: 'uz', category: 'asian', speakers: 44000000 },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: 'tj', category: 'asian', speakers: 8000000 },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen', flag: 'tm', category: 'asian', speakers: 7000000 },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: 'mn', category: 'asian', speakers: 5000000 },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: 'np', category: 'asian', speakers: 16000000 },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: 'lk', category: 'asian', speakers: 17000000 },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: 'in', category: 'asian', speakers: 78000000 },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: 'in', category: 'asian', speakers: 38000000 },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: 'in', category: 'asian', speakers: 44000000 },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: 'in', category: 'asian', speakers: 56000000 },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: 'in', category: 'asian', speakers: 113000000 },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: 'in', category: 'asian', speakers: 38000000 },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: 'in', category: 'asian', speakers: 15000000 },

  // Middle Eastern & African Languages
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: 'il', category: 'middle_eastern', speakers: 9000000 },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: 'ir', category: 'middle_eastern', speakers: 110000000 },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', flag: 'iq', category: 'middle_eastern', speakers: 30000000 },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: 'et', category: 'african', speakers: 57000000 },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: 'er', category: 'african', speakers: 9000000 },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: 'et', category: 'african', speakers: 37000000 },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: 'so', category: 'african', speakers: 21000000 },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: 'ng', category: 'african', speakers: 70000000 },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: 'ng', category: 'african', speakers: 45000000 },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: 'ng', category: 'african', speakers: 27000000 },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: 'za', category: 'african', speakers: 12000000 },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: 'za', category: 'african', speakers: 8000000 },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: 'za', category: 'african', speakers: 7000000 },

  // Americas Languages
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi', flag: 'pe', category: 'americas', speakers: 8000000 },
  { code: 'gn', name: 'Guarani', nativeName: 'Avañeʼẽ', flag: 'py', category: 'americas', speakers: 6000000 },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', flag: 'bo', category: 'americas', speakers: 2000000 },

  // Pacific Languages
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: 'my', category: 'pacific', speakers: 290000000 },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: 'ph', category: 'pacific', speakers: 45000000 },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: 'us', category: 'pacific', speakers: 24000 },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', flag: 'nz', category: 'pacific', speakers: 185000 },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', flag: 'ws', category: 'pacific', speakers: 510000 },
  { code: 'to', name: 'Tongan', nativeName: 'Lea Fakatonga', flag: 'to', category: 'pacific', speakers: 187000 },
  { code: 'fj', name: 'Fijian', nativeName: 'Na Vosa Vakaviti', flag: 'fj', category: 'pacific', speakers: 350000 },

  // Additional European Languages
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', flag: 'es', category: 'european', speakers: 1200000 },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: 'es', category: 'european', speakers: 10000000 },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: 'es', category: 'european', speakers: 2400000 },
  { code: 'br', name: 'Breton', nativeName: 'Brezhoneg', flag: 'fr', category: 'european', speakers: 200000 },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', flag: 'fr', category: 'european', speakers: 150000 },
  { code: 'oc', name: 'Occitan', nativeName: 'Occitan', flag: 'fr', category: 'european', speakers: 800000 },
  { code: 'sc', name: 'Sardinian', nativeName: 'Sardu', flag: 'it', category: 'european', speakers: 1300000 },
  { code: 'rm', name: 'Romansh', nativeName: 'Rumantsch', flag: 'ch', category: 'european', speakers: 60000 },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: 'lu', category: 'european', speakers: 400000 },
  { code: 'fo', name: 'Faroese', nativeName: 'Føroyskt', flag: 'fo', category: 'european', speakers: 66000 },

  // Additional Asian Languages
  { code: 'dv', name: 'Dhivehi', nativeName: 'ދިވެހި', flag: 'mv', category: 'asian', speakers: 340000 },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་ཡིག', flag: 'cn', category: 'asian', speakers: 6000000 },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', flag: 'cn', category: 'asian', speakers: 25000000 },

  // Sign Languages (Special Category)
  { code: 'sgn-us', name: 'American Sign Language', nativeName: 'ASL', flag: 'us', category: 'sign', speakers: 500000 },
  { code: 'sgn-gb', name: 'British Sign Language', nativeName: 'BSL', flag: 'gb', category: 'sign', speakers: 125000 },
  { code: 'sgn-fr', name: 'French Sign Language', nativeName: 'LSF', flag: 'fr', category: 'sign', speakers: 100000 },

  // Constructed Languages (Special Category)
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: 'eo', category: 'constructed', speakers: 2000000 },
  { code: 'ia', name: 'Interlingua', nativeName: 'Interlingua', flag: 'ia', category: 'constructed', speakers: 1500 },
  { code: 'ie', name: 'Interlingue', nativeName: 'Interlingue', flag: 'ie', category: 'constructed', speakers: 100 },

  // Additional African Languages
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: 'rw', category: 'african', speakers: 12000000 },
  { code: 'rn', name: 'Kirundi', nativeName: 'Ikirundi', flag: 'bi', category: 'african', speakers: 9000000 },
  { code: 'lg', name: 'Luganda', nativeName: 'Oluganda', flag: 'ug', category: 'african', speakers: 5000000 },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chicheŵa', flag: 'mw', category: 'african', speakers: 12000000 },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: 'zw', category: 'african', speakers: 14000000 },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: 'ls', category: 'african', speakers: 5000000 },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana', flag: 'bw', category: 'african', speakers: 5000000 },
  { code: 've', name: 'Tshivenda', nativeName: 'Tshivenḓa', flag: 'za', category: 'african', speakers: 1200000 },
  { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga', flag: 'za', category: 'african', speakers: 2000000 },
  { code: 'ss', name: 'Siswati', nativeName: 'siSwati', flag: 'sz', category: 'african', speakers: 2000000 },
  { code: 'nr', name: 'Ndebele', nativeName: 'isiNdebele', flag: 'za', category: 'african', speakers: 1100000 },
  { code: 'nso', name: 'Northern Sotho', nativeName: 'Sesotho sa Leboa', flag: 'za', category: 'african', speakers: 4600000 },

  // Additional Middle Eastern Languages
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: 'af', category: 'middle_eastern', speakers: 60000000 },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: 'pk', category: 'middle_eastern', speakers: 25000000 },
  { code: 'bal', name: 'Balochi', nativeName: 'بلۏچی', flag: 'pk', category: 'middle_eastern', speakers: 8000000 },

  // Additional Indonesian Languages
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: 'id', category: 'asian', speakers: 82000000 },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: 'id', category: 'asian', speakers: 42000000 },
  { code: 'mad', name: 'Madurese', nativeName: 'Basa Madhura', flag: 'id', category: 'asian', speakers: 14000000 },
  { code: 'min', name: 'Minangkabau', nativeName: 'Baso Minangkabau', flag: 'id', category: 'asian', speakers: 6500000 },
  { code: 'bug', name: 'Buginese', nativeName: 'Basa Ugi', flag: 'id', category: 'asian', speakers: 5000000 },
  { code: 'ban', name: 'Balinese', nativeName: 'Basa Bali', flag: 'id', category: 'asian', speakers: 3300000 },
  { code: 'ace', name: 'Acehnese', nativeName: 'Bahsa Acèh', flag: 'id', category: 'asian', speakers: 3500000 },

  // Additional European Regional Languages
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', flag: 'gb-sct', category: 'european', speakers: 57000 },
  { code: 'kw', name: 'Cornish', nativeName: 'Kernewek', flag: 'gb', category: 'european', speakers: 300 },
  { code: 'gv', name: 'Manx', nativeName: 'Gaelg', flag: 'im', category: 'european', speakers: 1800 },
  { code: 'fur', name: 'Friulian', nativeName: 'Furlan', flag: 'it', category: 'european', speakers: 600000 },
  { code: 'lad', name: 'Ladino', nativeName: 'Ladino', flag: 'es', category: 'european', speakers: 200000 },
  { code: 'vec', name: 'Venetian', nativeName: 'Vèneto', flag: 'it', category: 'european', speakers: 4000000 },
  { code: 'lmo', name: 'Lombard', nativeName: 'Lombard', flag: 'it', category: 'european', speakers: 3500000 },
  { code: 'pms', name: 'Piedmontese', nativeName: 'Piemontèis', flag: 'it', category: 'european', speakers: 2000000 },
  { code: 'lij', name: 'Ligurian', nativeName: 'Ligure', flag: 'it', category: 'european', speakers: 500000 },
  { code: 'nap', name: 'Neapolitan', nativeName: 'Napulitano', flag: 'it', category: 'european', speakers: 5700000 },
  { code: 'scn', name: 'Sicilian', nativeName: 'Sicilianu', flag: 'it', category: 'european', speakers: 4700000 },

  // Additional Asian Languages
  { code: 'ceb', name: 'Cebuano', nativeName: 'Binisaya', flag: 'ph', category: 'asian', speakers: 25000000 },
  { code: 'ilo', name: 'Ilocano', nativeName: 'Ilokano', flag: 'ph', category: 'asian', speakers: 9000000 },
  { code: 'hil', name: 'Hiligaynon', nativeName: 'Ilonggo', flag: 'ph', category: 'asian', speakers: 9000000 },
  { code: 'war', name: 'Waray', nativeName: 'Winaray', flag: 'ph', category: 'asian', speakers: 3000000 },
  { code: 'pam', name: 'Kapampangan', nativeName: 'Kapampangan', flag: 'ph', category: 'asian', speakers: 2900000 },
  { code: 'pag', name: 'Pangasinan', nativeName: 'Salitan Pangasinan', flag: 'ph', category: 'asian', speakers: 1800000 },
  { code: 'bcl', name: 'Bikol', nativeName: 'Bikol', flag: 'ph', category: 'asian', speakers: 2500000 },

  // Additional Chinese Languages/Dialects
  { code: 'yue', name: 'Cantonese', nativeName: '粵語', flag: 'hk', category: 'asian', speakers: 85000000 },
  { code: 'wuu', name: 'Wu Chinese', nativeName: '吳語', flag: 'cn', category: 'asian', speakers: 81000000 },
  { code: 'hsn', name: 'Xiang Chinese', nativeName: '湘語', flag: 'cn', category: 'asian', speakers: 38000000 },
  { code: 'hak', name: 'Hakka Chinese', nativeName: '客家話', flag: 'cn', category: 'asian', speakers: 48000000 },
  { code: 'nan', name: 'Min Nan Chinese', nativeName: '閩南語', flag: 'tw', category: 'asian', speakers: 49000000 },

  // Additional Middle Eastern Languages
  { code: 'ckb', name: 'Central Kurdish', nativeName: 'کوردیی ناوەندی', flag: 'iq', category: 'middle_eastern', speakers: 6000000 },
  { code: 'lrc', name: 'Northern Luri', nativeName: 'لۊری شومالی', flag: 'ir', category: 'middle_eastern', speakers: 1800000 },
  { code: 'mzn', name: 'Mazanderani', nativeName: 'مازِرونی', flag: 'ir', category: 'middle_eastern', speakers: 3000000 },
  { code: 'glk', name: 'Gilaki', nativeName: 'گیلکی', flag: 'ir', category: 'middle_eastern', speakers: 2400000 },
  { code: 'azb', name: 'South Azerbaijani', nativeName: 'تۆرکجه', flag: 'ir', category: 'middle_eastern', speakers: 16000000 },

  // Additional African Languages
  { code: 'ff', name: 'Fulah', nativeName: 'Fulfulde', flag: 'sn', category: 'african', speakers: 25000000 },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof', flag: 'sn', category: 'african', speakers: 12000000 },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', flag: 'ml', category: 'african', speakers: 14000000 },
  { code: 'dyu', name: 'Dyula', nativeName: 'Julakan', flag: 'ci', category: 'african', speakers: 12000000 },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', flag: 'gh', category: 'african', speakers: 6000000 },
  { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: 'gh', category: 'african', speakers: 17000000 },
  { code: 'ak', name: 'Akan', nativeName: 'Akan', flag: 'gh', category: 'african', speakers: 11000000 },
  { code: 'gaa', name: 'Ga', nativeName: 'Gã', flag: 'gh', category: 'african', speakers: 745000 },
  { code: 'dag', name: 'Dagbani', nativeName: 'Dagbanli', flag: 'gh', category: 'african', speakers: 1200000 },
  { code: 'kik', name: 'Kikuyu', nativeName: 'Gĩkũyũ', flag: 'ke', category: 'african', speakers: 8000000 },
  { code: 'luo', name: 'Luo', nativeName: 'Dholuo', flag: 'ke', category: 'african', speakers: 4200000 },
  { code: 'kam', name: 'Kamba', nativeName: 'Kikamba', flag: 'ke', category: 'african', speakers: 4000000 },
  { code: 'mer', name: 'Meru', nativeName: 'Kĩmĩrũ', flag: 'ke', category: 'african', speakers: 2000000 },

  // Additional Pacific Languages
  { code: 'ch', name: 'Chamorro', nativeName: 'Chamoru', flag: 'gu', category: 'pacific', speakers: 58000 },
  { code: 'gil', name: 'Gilbertese', nativeName: 'Taetae ni Kiribati', flag: 'ki', category: 'pacific', speakers: 119000 },
  { code: 'mh', name: 'Marshallese', nativeName: 'Kajin M̧ajeļ', flag: 'mh', category: 'pacific', speakers: 44000 },
  { code: 'na', name: 'Nauru', nativeName: 'Dorerin Naoero', flag: 'nr', category: 'pacific', speakers: 7000 },
  { code: 'niu', name: 'Niuean', nativeName: 'ko e vagahau Niuē', flag: 'nu', category: 'pacific', speakers: 8000 },
  { code: 'pau', name: 'Palauan', nativeName: 'Tekoi ra Belau', flag: 'pw', category: 'pacific', speakers: 17000 },
  { code: 'pon', name: 'Pohnpeian', nativeName: 'Lokaiahn Pohnpei', flag: 'fm', category: 'pacific', speakers: 30000 },
  { code: 'kos', name: 'Kosraean', nativeName: 'Kosrae', flag: 'fm', category: 'pacific', speakers: 8000 },
  { code: 'chk', name: 'Chuukese', nativeName: 'Chuuk', flag: 'fm', category: 'pacific', speakers: 45000 },
  { code: 'yap', name: 'Yapese', nativeName: 'Waqab', flag: 'fm', category: 'pacific', speakers: 5000 },

  // Additional Americas Languages
  { code: 'nah', name: 'Nahuatl', nativeName: 'Nāhuatlahtolli', flag: 'mx', category: 'americas', speakers: 1700000 },
  { code: 'myn', name: 'Maya', nativeName: 'Maya', flag: 'mx', category: 'americas', speakers: 6000000 },
  { code: 'chr', name: 'Cherokee', nativeName: 'ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ', flag: 'us', category: 'americas', speakers: 2000 },
  { code: 'lkt', name: 'Lakota', nativeName: 'Lakȟótiyapi', flag: 'us', category: 'americas', speakers: 2000 },
  { code: 'nv', name: 'Navajo', nativeName: 'Diné bizaad', flag: 'us', category: 'americas', speakers: 170000 },
  { code: 'iu', name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ', flag: 'ca', category: 'americas', speakers: 39000 },
  { code: 'ik', name: 'Inupiaq', nativeName: 'Iñupiaq', flag: 'us', category: 'americas', speakers: 3000 },
  { code: 'kl', name: 'Greenlandic', nativeName: 'Kalaallisut', flag: 'gl', category: 'americas', speakers: 57000 },
];

// Language categories for organization
export const LANGUAGE_CATEGORIES = {
  popular: { label: 'Popular Languages', icon: '🌟', order: 1 },
  recent: { label: 'Recently Used', icon: '🕒', order: 2 },
  european: { label: 'European Languages', icon: '🇪🇺', order: 3 },
  asian: { label: 'Asian Languages', icon: '🌏', order: 4 },
  african: { label: 'African Languages', icon: '🌍', order: 5 },
  middle_eastern: { label: 'Middle Eastern Languages', icon: '🕌', order: 6 },
  americas: { label: 'Americas Languages', icon: '🌎', order: 7 },
  pacific: { label: 'Pacific Languages', icon: '🏝️', order: 8 },
  sign: { label: 'Sign Languages', icon: '🤟', order: 9 },
  constructed: { label: 'Constructed Languages', icon: '🔧', order: 10 },
};

// Popular languages for quick access (top 20 most spoken)
export const POPULAR_LANGUAGES = LANGUAGE_DATA
  .filter(lang => lang.category === 'popular')
  .sort((a, b) => b.speakers - a.speakers);

// Create lookup maps for performance
export const LANGUAGE_BY_CODE = LANGUAGE_DATA.reduce((acc, lang) => {
  acc[lang.code] = lang;
  return acc;
}, {});

export const LANGUAGE_BY_NAME = LANGUAGE_DATA.reduce((acc, lang) => {
  acc[lang.name.toLowerCase()] = lang;
  return acc;
}, {});

// Legacy compatibility with existing constants
export const LANGUAGES = LANGUAGE_DATA.map(lang => lang.name);

export const LANGUAGE_TO_FLAG = LANGUAGE_DATA.reduce((acc, lang) => {
  acc[lang.name.toLowerCase()] = lang.flag;
  return acc;
}, {});

// Default language preferences
export const DEFAULT_LANGUAGE = LANGUAGE_DATA.find(lang => lang.code === 'en');
export const BROWSER_LANGUAGE_FALLBACKS = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko'];
