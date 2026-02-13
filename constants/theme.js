import { useColorScheme } from "react-native";

/**
 * Theme tokens for light and dark mode.
 */

const spacing = {
  xs: 4,
  s: 6,
  m: 8,
  l: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
};

export const lightColors = {
  background: "#F6F7FB",
  card: "#FFFFFF",
  primary: "#0B5FFF",
  secondary: "#6366F1",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  danger: "#EF4444",
  warning: "#F59E0B",
  muted: "#F3F4F6",
};

export const darkColors = {
  background: "#0B1220",
  card: "#141C2F",
  primary: "#2F7DFF",
  secondary: "#8B5CF6",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  border: "#243041",
  success: "#22C55E",
  danger: "#F87171",
  warning: "#FBBF24",
  muted: "#1F2937",
};

export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  return { colors, spacing, scheme };
}
