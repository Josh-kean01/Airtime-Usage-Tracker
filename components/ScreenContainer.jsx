import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import { useTheme } from "../constants/theme";

/**
 * ScreenContainer
 * - Adds safe area padding
 * - Applies themed background
 * - Supports scrollable or non-scrollable screens
 */
export default function ScreenContainer({
  children,
  scrollable = false,
  style,
}) {
  const { colors } = useTheme();

  if (scrollable) {
    return (
      <SafeAreaView
        style={[{ flex: 1, backgroundColor: colors.background }, style]}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
    >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {children}
      </View>
    </SafeAreaView>
  );
}
