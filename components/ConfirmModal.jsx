import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/theme";

/**
 * Confirmation modal used for deleting transactions.
 * Matches the screenshot: icon, title, message, Cancel text, red Delete button.
 */
export default function ConfirmModal({
  visible,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
          padding: 22,
        }}
      >
        <View
          style={{
            width: "100%",
            borderRadius: 18,
            backgroundColor: "#FFFFFF",
            padding: 18,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          {/* Icon + Title row */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: "#FEE2E2",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="warning" size={20} color="#DC2626" />
            </View>

            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              {title}
            </Text>
          </View>

          {/* Message */}
          {!!message && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                lineHeight: 18,
                marginTop: 10,
              }}
            >
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.85}
              style={{
                marginLeft: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 16,
                height: 40,
                borderRadius: 10,
                backgroundColor: "#DC2626",
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
              <Text
                style={{
                  marginLeft: 8,
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "800",
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
