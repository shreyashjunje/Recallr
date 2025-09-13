import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";



const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("quiz-theme");
    return saved ? JSON.parse(saved) : true;
  });

  // useEffect(() => {
  //   localStorage.setItem('quiz-theme', JSON.stringify(isDark));
  //   if (isDark) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [isDark]);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("quiz-theme", JSON.stringify(isDark));

    // cleanup when ThemeProvider unmounts
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
