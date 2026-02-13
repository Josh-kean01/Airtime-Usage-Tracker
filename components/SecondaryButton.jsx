import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../constants/theme";

/**
 * Secondary (outlined) button.
 */
export default function SecondaryButton({
  children,
  onPress,
  style,
  disabled,
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled ? colors.border : colors.primary,
          paddingVertical: 14,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: disabled ? colors.textSecondary : colors.primary,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
