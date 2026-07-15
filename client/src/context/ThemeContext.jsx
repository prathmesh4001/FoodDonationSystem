import { createContext, useContext } from 'react';

// Theme is fixed to light-only — no toggle needed
const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
