import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../constants/theme";

/**
 * Small selectable chip used in History filter.
 */
export default function Chip({ label, selected, onPress, style }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          height: 32, // ✅ smaller chip height
          paddingHorizontal: 14,
          borderRadius: 999, // ✅ pill
          alignItems: "center",
          justifyContent: "center",

          // ✅ match "selected = dark pill, unselected = white with border"
          backgroundColor: selected ? colors.primary : colors.muted,
          borderWidth: selected ? 0 : 1,
          borderColor: colors.border,

          marginRight: 10,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: selected ? "#FFFFFF" : colors.textPrimary,
          fontSize: 13,
          fontWeight: selected ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
