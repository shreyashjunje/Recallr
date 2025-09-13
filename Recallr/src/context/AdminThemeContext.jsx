// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// // interface ThemeContextType {
// //   isDark: boolean;
// //   toggleTheme: () => void;
// // }

// const AdminThemeContext = createContext(undefined);

// export const useTheme = () => {
//   const context = useContext(AdminThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// // interface ThemeProviderProps {
// //   children: ReactNode;
// // }

// export const ThemeProvider = ({ children }) => {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setIsDark(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//     if (!isDark) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   return (
//     <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
//       {children}
//     </AdminThemeContext.Provider>
//   );

// };

import React, { createContext, useContext, useState, useEffect } from "react";

const AdminThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(AdminThemeContext); // ✅ fixed
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};
