"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  forcedTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  forcedTheme,
  storageKey = "ui-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = "data-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // Set custom CSS variables for the warm orange theme with stone gray accents
    root.style.setProperty("--primary", "rgb(234, 88, 12)"); // orange-600
    root.style.setProperty("--primary-foreground", "rgb(255, 255, 255)");
    root.style.setProperty("--primary-hover", "rgb(194, 65, 12)"); // orange-700
    root.style.setProperty("--primary-focus", "rgba(234, 88, 12, 0.5)");
    root.style.setProperty("--primary-light", "rgb(251, 146, 60)"); // orange-400
    root.style.setProperty("--primary-dark", "rgb(194, 65, 12)"); // orange-700
    root.style.setProperty("--accent", "rgb(251, 146, 60)"); // orange-400
    root.style.setProperty("--accent-foreground", "rgb(255, 255, 255)");

    // Add warm/stone gray colors for the theme
    root.style.setProperty("--background", "rgb(28, 25, 23)"); // stone-900
    root.style.setProperty("--foreground", "rgb(250, 250, 249)"); // stone-50
    root.style.setProperty("--card", "rgb(28, 25, 23)"); // stone-900
    root.style.setProperty("--card-foreground", "rgb(250, 250, 249)"); // stone-50
    root.style.setProperty("--popover", "rgb(28, 25, 23)"); // stone-900
    root.style.setProperty("--popover-foreground", "rgb(250, 250, 249)"); // stone-50
    root.style.setProperty("--border", "rgb(68, 64, 60)"); // stone-700
    root.style.setProperty("--input", "rgb(68, 64, 60)"); // stone-700
    root.style.setProperty("--secondary", "rgb(41, 37, 36)"); // stone-800
    root.style.setProperty("--secondary-foreground", "rgb(214, 211, 209)"); // stone-300
    root.style.setProperty("--muted", "rgb(41, 37, 36)"); // stone-800
    root.style.setProperty("--muted-foreground", "rgb(168, 162, 158)"); // stone-400

    if (forcedTheme) {
      root.setAttribute(attribute, forcedTheme);
      return;
    }

    if (disableTransitionOnChange) {
      root.classList.add("transition-none");
      window.setTimeout(() => {
        root.classList.remove("transition-none");
      }, 0);
    }

    const systemTheme = enableSystem ? getSystemTheme() : null;

    if (theme === "system" && systemTheme) {
      root.setAttribute(attribute, systemTheme);
    } else {
      root.setAttribute(attribute, theme);
    }
  }, [theme, forcedTheme, attribute, enableSystem, disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
