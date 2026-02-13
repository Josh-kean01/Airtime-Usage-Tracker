import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import { formatCurrency } from "../utils/format";
import { useTheme } from "../constants/theme";

/**
 * StatCard used for weekly, monthly, highest, lowest info.
 */
export default function StatCard({
  iconName,
  title,
  value,
  subtitle,
  iconColor,
}) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, marginRight: 12 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Ionicons
          name={iconName}
          size={24}
          color={iconColor || colors.primary}
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
      </View>
      <Text
        style={{ color: colors.textPrimary, fontSize: 22, fontWeight: "700" }}
      >
        {typeof value === "number" ? formatCurrency(value) : value}
      </Text>
      {subtitle && (
        <Text
          style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}
        >
          {subtitle}
        </Text>
      )}
    </Card>
  );
}
