// context/ThemeContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const lightColors = {
  bg: "#F6F7FB",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF1F8",
  primary: "#16326B",
  primaryDark: "#0F2450",
  accent: "#E8A33D",
  success: "#2E9E5B",
  successBg: "#E4F5EB",
  critical: "#D64545",
  criticalBg: "#FBE6E6",
  text: "#14171F",
  textSecondary: "#5B6272",
  border: "#E4E7EE",
};

const darkColors = {
  bg: "#0D1220",
  surface: "#161C2C",
  surfaceAlt: "#1E2537",
  primary: "#5B8DEF",
  primaryDark: "#3E6BD1",
  accent: "#F2B25C",
  success: "#3FBE79",
  successBg: "#153826",
  critical: "#EF5B5B",
  criticalBg: "#3A1B1E",
  text: "#EDEFF5",
  textSecondary: "#9AA1B5",
  border: "#262E44",
};

export type ThemeColors = typeof lightColors;

type ThemeContextType = {
  colors: ThemeColors;
  mode: "light" | "dark";
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<"light" | "dark">(system === "dark" ? "dark" : "light");

  useEffect(() => {
    AsyncStorage.getItem("beatsync_theme").then((saved) => {
      if (saved === "light" || saved === "dark") setMode(saved);
    });
  }, []);

  const toggleMode = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    AsyncStorage.setItem("beatsync_theme", next);
  };

  const colors = mode === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ colors, mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}