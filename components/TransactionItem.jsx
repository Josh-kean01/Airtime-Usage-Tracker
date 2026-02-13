import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/theme";
import { formatCurrency, formatDateTime } from "../utils/format";

/**
 * Row for each transaction in History and Recent sections.
 */
export default function TransactionItem({ item, onPress, onDelete }) {
  const { colors } = useTheme();
  const providerColors = {
    MTN: "#FBBF24",
    Airtel: "#EF4444",
    Glo: "#10B981",
    "9mobile": "#8B5CF6",
    Unknown: "#6366F1",
  };
  const color = providerColors[item.provider] || colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
          {item.provider[0]}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "600" }}
        >
          {item.title}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          {formatDateTime(item.dateISO)}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "600" }}
        >
          -{formatCurrency(item.amount)}
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={{ marginTop: 4 }}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
