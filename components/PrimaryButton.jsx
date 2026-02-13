import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../constants/theme";

export default function PrimaryButton({
  children,
  onPress,
  style,
  disabled,
  showIcon = true,
  iconName = "add",
}) {
  const { colors } = useTheme();

  const bg = disabled ? colors.border : (colors.primary ?? "#2563EB");
  const textColor = disabled ? colors.textSecondary : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.88}
      style={[
        {
          backgroundColor: bg,
          height: 56,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",

          shadowColor: "#2563EB",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: disabled ? 0 : 0.25,
          shadowRadius: 14,
          elevation: disabled ? 0 : 7,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showIcon && !disabled && (
          <Ionicons name={iconName} size={18} color={textColor} />
        )}
        <Text
          style={{
            color: textColor,
            fontSize: 16,
            fontWeight: "800",
            marginLeft: showIcon && !disabled ? 10 : 0,
          }}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
