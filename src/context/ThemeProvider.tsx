import { createContext, useEffect, useState, type ReactNode } from "react";

const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>({
  theme: "light",
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const localTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(localTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"; // Or cycle through themes
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
