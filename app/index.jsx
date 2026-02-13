import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../constants/theme";

/**
 * Splash screen. Shows logo and auto-navigates to tabs/home after a delay.
 */
export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "700" }}>
            ₦
          </Text>
        </View>
        <Text
          style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "700" }}
        >
          Airtime Tracker
        </Text>
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}
        >
          Track your airtime spending smartly
        </Text>
      </View>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  logoContainer: {
    alignItems: "center",
  },
});
