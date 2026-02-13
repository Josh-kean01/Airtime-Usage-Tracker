import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import { useTheme } from "../constants/theme";
import { useRouter } from "expo-router";
import { useData } from "../hooks/useData";
import { formatDateTime } from "../utils/format";

/**
 * Add Airtime screen: manual entry form.
 */
export default function AddAirtimeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addPurchase } = useData();
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("MTN");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const err = {};
    const numeric = parseFloat(amount);
    if (!numeric || numeric <= 0) err.amount = "Amount is required";
    if (!provider) err.provider = "Select a provider";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSave = () => {
    if (!validate()) return;
    const numeric = parseFloat(amount);
    const purchase = {
      id: Date.now().toString(),
      title: `${provider} Top-up`,
      provider,
      amount: numeric,
      dateISO: date.toISOString(),
      notes,
      source: "manual",
    };
    addPurchase(purchase);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.back();
    }, 1200);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "700" }}
        >
          Add Airtime
        </Text>
      </View>

      {/* Amount input */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}
        >
          Amount (₦)
        </Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor={colors.textSecondary}
          style={{
            borderWidth: 1,
            borderColor: errors.amount ? colors.danger : colors.border,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 12,
            color: colors.textPrimary,
          }}
        />
        {errors.amount && (
          <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
            {errors.amount}
          </Text>
        )}
      </View>

      {/* Provider picker */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}
        >
          Network Provider
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: errors.provider ? colors.danger : colors.border,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Picker
            selectedValue={provider}
            onValueChange={(itemValue) => setProvider(itemValue)}
            style={{ color: colors.textPrimary }}
          >
            {["MTN", "Airtel", "Glo", "9mobile", "Unknown"].map((p) => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>
        {errors.provider && (
          <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
            {errors.provider}
          </Text>
        )}
      </View>

      {/* Date & Time picker */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}
        >
          Date & Time
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
            {formatDateTime(date.toISOString())}
          </Text>
          <Ionicons name="calendar" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Notes input */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}
        >
          Notes
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes (e.g., data bundle)"
          placeholderTextColor={colors.textSecondary}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 12,
            color: colors.textPrimary,
          }}
        />
      </View>

      {/* Save button */}
      <PrimaryButton onPress={onSave}>Save Purchase</PrimaryButton>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
      {saved && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Purchase saved successfully
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
