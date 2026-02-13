import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenContainer from "../../components/ScreenContainer";
import SecondaryButton from "../../components/SecondaryButton";
import StatCard from "../../components/StatCard";
import TransactionItem from "../../components/TransactionItem";
import TrendChart from "../../components/TrendChart";
import { useTheme } from "../../constants/theme";
import { useData } from "../../hooks/useData";
import AutoImport from "../../native/AutoImport";
import {
  getDailyTotals,
  getMonthPercentChange,
  getMonthTotal,
  getWeekTotal,
} from "../../utils/calculations";
import { formatCurrency } from "../../utils/format";

/**
 * Home screen: shows stats, recent transactions, auto-import toggle.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { purchases, settings, updateSettings, autoImportSupported } =
    useData();

  const [dailyTotals, setDailyTotals] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [changePercent, setChangePercent] = useState(null);

  useEffect(() => {
    setDailyTotals(getDailyTotals(purchases));
    setChangePercent(getMonthPercentChange(purchases));
  }, [purchases]);

  const weekTotal = getWeekTotal(purchases);
  const monthTotal = getMonthTotal(purchases);

  // Export purchases to CSV
  const exportCSV = async () => {
    try {
      if (!purchases || purchases.length === 0) {
        Alert.alert("Export", "No purchases to export.");
        return;
      }

      const rows = [
        ["date", "provider", "title", "amount"],
        ...purchases.map((p) => [
          new Date(p.dateISO).toISOString(),
          p.provider,
          p.title,
          String(p.amount),
        ]),
      ];

      const csv = rows
        .map((r) =>
          r
            .map((cell) => {
              const s = String(cell ?? "");
              const escaped = s.replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(","),
        )
        .join("\n");

      // ✅ Web fallback: download CSV
      if (Platform.OS === "web") {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `airtime-tracker-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
        return;
      }

      // ✅ Native: write file and share
      const fileUri =
        FileSystem.documentDirectory + `airtime-tracker-${Date.now()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Export", "Sharing is not available on this device.");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Airtime Purchases",
        UTI: "public.comma-separated-values-text",
      });
    } catch (e) {
      console.log("Export CSV error:", e);
      Alert.alert("Export", "Export failed. Check logs.");
    }
  };

  // Toggle auto-import in settings
  const toggleAutoImport = (value) => {
    updateSettings({ autoImportEnabled: value });
  };

  const recent = [...purchases]
    .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO))
    .slice(0, 3);

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 28,
              fontWeight: "700",
            }}
          >
            Home
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}
          >
            Welcome back, Alex
          </Text>
        </View>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
      </View>

      {/* Stat cards */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <StatCard
          iconName="calendar"
          title="This Week"
          value={weekTotal}
          iconColor={colors.success}
        />
        <StatCard
          iconName="calendar-outline"
          title="This Month"
          value={monthTotal}
          iconColor={colors.primary}
        />
      </View>

      {/* Spending Trends */}
      <Card style={{ marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              Spending Trends
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 22,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {formatCurrency(weekTotal)}
            </Text>
          </View>
          {changePercent !== null && (
            <View
              style={{
                backgroundColor: colors.success + "33",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: colors.success,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}
        >
          Last 7 days spending activity
        </Text>
        <TrendChart data={dailyTotals} height={120} />
      </Card>

      {/* Buttons row */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <PrimaryButton
          style={{ flex: 1, marginRight: 8 }}
          onPress={() => router.push("/add-airtime")}
        >
          Add Airtime
        </PrimaryButton>
        <SecondaryButton
          style={{ flex: 1 }}
          onPress={exportCSV}
          disabled={purchases.length === 0}
        >
          Export
        </SecondaryButton>
      </View>

      {/* Auto-Import card */}
      <Card style={{ marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Auto-Import
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Automatically detect airtime purchase confirmations from supported
              apps.
            </Text>

            {Platform.OS === "ios" && (
              <Text
                style={{ color: colors.warning, fontSize: 12, marginTop: 4 }}
              >
                Unavailable on iOS. Add manually.
              </Text>
            )}

            {Platform.OS === "android" && !autoImportSupported && (
              <Text
                style={{ color: colors.warning, fontSize: 12, marginTop: 4 }}
              >
                Requires Android Dev Client build. Disabled in Expo Go.
              </Text>
            )}
          </View>

          <Switch
            value={settings.autoImportEnabled}
            onValueChange={toggleAutoImport}
            disabled={Platform.OS !== "android" || !autoImportSupported}
            thumbColor={
              settings.autoImportEnabled ? colors.primary : colors.border
            }
            trackColor={{ true: colors.primary + "55", false: colors.muted }}
          />
        </View>

        {Platform.OS === "android" && autoImportSupported && (
          <TouchableOpacity
            onPress={() => AutoImport.openNotificationAccessSettings()}
            style={{ marginTop: 12 }}
          >
            <Text
              style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}
            >
              Enable Notification Access
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Recent transactions */}
      <Card style={{ marginTop: 20, marginBottom: 80 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Recent Transactions
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text
              style={{ color: colors.primary, fontSize: 14, fontWeight: "500" }}
            >
              View all
            </Text>
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <Text
            style={{ color: colors.textSecondary, fontSize: 14, marginTop: 16 }}
          >
            No recent transactions
          </Text>
        ) : (
          recent.map((item) => <TransactionItem key={item.id} item={item} />)
        )}
      </Card>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-airtime")}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}
