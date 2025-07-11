import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const themes = [
    { id: 'light', name: 'Light', icon: 'sun' },
    { id: 'dark', name: 'Dark', icon: 'moon' },
    { id: 'emerald-dark', name: 'Emerald Dark', icon: 'gem' }
  ];
  
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored && themes.some(t => t.id === stored)) {
        return stored;
      }
      // Default to emerald-dark
      return 'emerald-dark';
    }
    return 'emerald-dark';
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes
    themes.forEach(theme => {
      root.classList.remove(theme.id);
      body.classList.remove(theme.id);
    });
    
    // Add current theme class
    root.classList.add(currentTheme);
    body.classList.add(currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Set initial theme on component mount
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes
    themes.forEach(theme => {
      root.classList.remove(theme.id);
      body.classList.remove(theme.id);
    });
    
    // Add current theme class
    root.classList.add(currentTheme);
    body.classList.add(currentTheme);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.theme-toggle')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const selectTheme = (themeId) => {
    setCurrentTheme(themeId);
    setIsDropdownOpen(false);
  };

  const getThemeIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'moon':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'gem':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 002-2v-4a2 2 0 002-2V6a2 2 0 002-2V4a2 2 0 012-2h4m-6 14v2m0 0h4m-4 0h-4m4 0v2m-4-2a2 2 0 00-2 2v0a2 2 0 002 2m0 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[2];

  return (
    <div className="theme-toggle relative">
      <motion.button
        aria-label={`Current theme: ${currentThemeData.name}. Click to open theme selector.`}
        className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-colors duration-300 flex items-center gap-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={currentTheme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-primary"
        >
          {getThemeIcon(currentThemeData.icon)}
        </motion.div>
        <svg 
          className={`w-3 h-3 text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-48 glass rounded-lg border border-border shadow-lg z-50"
        >
          <div className="p-2">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => selectTheme(theme.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentTheme === theme.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted hover:text-foreground hover:bg-secondary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={currentTheme === theme.id ? 'text-primary' : 'text-muted'}>
                  {getThemeIcon(theme.icon)}
                </span>
                <span className="font-medium">{theme.name}</span>
                {currentTheme === theme.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}