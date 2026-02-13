// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, Platform, TouchableOpacity, Alert } from "react-native";
// import Slider from "@react-native-community/slider";
// import ScreenContainer from "../../components/ScreenContainer";
// import Card from "../../components/Card";
// import StatCard from "../../components/StatCard";
// import DonutChart from "../../components/DonutChart";
// import PrimaryButton from "../../components/PrimaryButton";
// import SecondaryButton from "../../components/SecondaryButton";
// import { useTheme } from "../../constants/theme";
// import { useData } from "../../hooks/useData";
// import {
//   getTotalSpend,
//   getHighestProvider,
//   getLowestProvider,
//   getProviderTotals,
//   getMonthPercentChange,
// } from "../../utils/calculations";
// import { formatCurrency } from "../../utils/format";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Sharing from "expo-sharing";

// /**
//  * Summary screen: analytics, spending alert, export.
//  */
// export default function SummaryScreen() {
//   const { colors } = useTheme();
//   const { purchases, settings, updateSettings, autoImportSupported } =
//     useData();

//   const totalSpend = getTotalSpend(purchases);
//   const highest = getHighestProvider(purchases);
//   const lowest = getLowestProvider(purchases);
//   const providerTotals = getProviderTotals(purchases);
//   const percentChange = getMonthPercentChange(purchases);

//   const dataForChart = Object.keys(providerTotals).map((key) => ({
//     key,
//     value: providerTotals[key],
//     color:
//       key === "MTN"
//         ? "#FBBF24"
//         : key === "Airtel"
//           ? "#EF4444"
//           : key === "Glo"
//             ? "#10B981"
//             : key === "9mobile"
//               ? "#8B5CF6"
//               : "#6366F1",
//   }));

//   const [limit, setLimit] = useState(settings.spendingLimit);

//   // ✅ prevents alert spam
//   const hasWarnedRef = useRef(false);

//   useEffect(() => {
//     setLimit(settings.spendingLimit);
//   }, [settings.spendingLimit]);

//   // ✅ SPENDING LIMIT LOGIC (ACTUALLY DOES SOMETHING)
//   useEffect(() => {
//     // if alerts are off, reset + do nothing
//     if (!settings.spendingAlertEnabled) {
//       hasWarnedRef.current = false;
//       return;
//     }

//     const safeLimit = Number(settings.spendingLimit) || 0;

//     // If user set something weird, ignore
//     if (safeLimit <= 0) return;

//     // Crossed limit: warn once
//     if (totalSpend >= safeLimit && !hasWarnedRef.current) {
//       hasWarnedRef.current = true;

//       Alert.alert(
//         "Spending Limit Reached",
//         `You've spent ${formatCurrency(totalSpend)} which is above your limit of ${formatCurrency(
//           safeLimit,
//         )}.`,
//         [{ text: "OK" }],
//       );
//     }

//     // If back below limit, re-arm so it can alert again next time
//     if (totalSpend < safeLimit) {
//       hasWarnedRef.current = false;
//     }
//   }, [totalSpend, settings.spendingAlertEnabled, settings.spendingLimit]);

//   const handleToggleAlert = (value) => {
//     updateSettings({ spendingAlertEnabled: value });
//   };

//   const handleLimitChangeComplete = (value) => {
//     updateSettings({ spendingLimit: Math.round(value) });
//   };

//   const exportCSV = async () => {
//     try {
//       if (!purchases || purchases.length === 0) return;

//       const header = "Date,Provider,Title,Amount";
//       const rows = purchases
//         .slice()
//         .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))
//         .map((p) => `${p.dateISO},${p.provider},${p.title || ""},${p.amount}`)
//         .join("\n");

//       const csv = `${header}\n${rows}`;
//       const fileUri =
//         FileSystem.documentDirectory + `airtime_report_${Date.now()}.csv`;

//       await FileSystem.writeAsStringAsync(fileUri, csv, {
//         encoding: FileSystem.EncodingType.UTF8,
//       });

//       await Sharing.shareAsync(fileUri, {
//         mimeType: "text/csv",
//         dialogTitle: "Export Airtime CSV",
//         UTI: "public.comma-separated-values-text",
//       });
//     } catch (e) {
//       console.log(e);
//       Alert.alert("Export", "Export failed. Check logs.");
//     }
//   };

//   return (
//     <ScreenContainer scrollable>
//       <Text
//         style={{ color: colors.textPrimary, fontSize: 28, fontWeight: "700" }}
//       >
//         Summary
//       </Text>

//       {/* Total spend */}
//       <View style={{ marginTop: 20 }}>
//         <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
//           Total Spend
//         </Text>
//         <View
//           style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
//         >
//           <Text
//             style={{
//               color: colors.textPrimary,
//               fontSize: 32,
//               fontWeight: "700",
//             }}
//           >
//             {formatCurrency(totalSpend)}
//           </Text>
//           {percentChange !== null && (
//             <View
//               style={{
//                 backgroundColor: colors.success + "33",
//                 paddingHorizontal: 8,
//                 paddingVertical: 4,
//                 borderRadius: 12,
//                 marginLeft: 12,
//               }}
//             >
//               <Text
//                 style={{
//                   color: colors.success,
//                   fontSize: 12,
//                   fontWeight: "600",
//                 }}
//               >
//                 {percentChange > 0 ? "+" : ""}
//                 {percentChange.toFixed(1)}% vs last month
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Highest/Lowest cards */}
//       <View style={{ flexDirection: "row", marginTop: 20 }}>
//         <StatCard
//           iconName="arrow-up"
//           title="Highest Network"
//           value={highest.amount}
//           subtitle={highest.provider || "N/A"}
//           iconColor={
//             highest.provider === "MTN"
//               ? "#FBBF24"
//               : highest.provider === "Airtel"
//                 ? "#EF4444"
//                 : highest.provider === "Glo"
//                   ? "#10B981"
//                   : highest.provider === "9mobile"
//                     ? "#8B5CF6"
//                     : colors.primary
//           }
//         />
//         <StatCard
//           iconName="arrow-down"
//           title="Lowest Network"
//           value={lowest.amount}
//           subtitle={lowest.provider || "N/A"}
//           iconColor={
//             lowest.provider === "MTN"
//               ? "#FBBF24"
//               : lowest.provider === "Airtel"
//                 ? "#EF4444"
//                 : lowest.provider === "Glo"
//                   ? "#10B981"
//                   : lowest.provider === "9mobile"
//                     ? "#8B5CF6"
//                     : colors.primary
//           }
//         />
//       </View>

//       {/* Donut chart */}
//       <Card style={{ marginTop: 20, alignItems: "center" }}>
//         <Text
//           style={{
//             color: colors.textPrimary,
//             fontSize: 18,
//             fontWeight: "600",
//             marginBottom: 8,
//           }}
//         >
//           Network Breakdown
//         </Text>
//         <DonutChart data={dataForChart} size={200} strokeWidth={28} />
//         <View
//           style={{
//             flexDirection: "row",
//             flexWrap: "wrap",
//             marginTop: 12,
//             justifyContent: "center",
//           }}
//         >
//           {dataForChart.map((item) => (
//             <View
//               key={item.key}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginHorizontal: 8,
//                 marginVertical: 4,
//               }}
//             >
//               <View
//                 style={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: 5,
//                   backgroundColor: item.color,
//                   marginRight: 6,
//                 }}
//               />
//               <Text style={{ color: colors.textPrimary, fontSize: 12 }}>
//                 {item.key}
//               </Text>
//               <Text
//                 style={{
//                   color: colors.textSecondary,
//                   fontSize: 12,
//                   marginLeft: 4,
//                 }}
//               >
//                 {totalSpend === 0
//                   ? "0%"
//                   : `${((item.value / totalSpend) * 100).toFixed(0)}%`}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </Card>

//       {/* Spending alert card */}
//       <Card style={{ marginTop: 20 }}>
//         <Text
//           style={{
//             color: colors.textPrimary,
//             fontSize: 18,
//             fontWeight: "600",
//             marginBottom: 8,
//           }}
//         >
//           Spending Alert
//         </Text>
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
//             Enable Alerts
//           </Text>
//           <TouchableOpacity
//             onPress={() => handleToggleAlert(!settings.spendingAlertEnabled)}
//           >
//             <View
//               style={{
//                 width: 40,
//                 height: 24,
//                 borderRadius: 12,
//                 backgroundColor: settings.spendingAlertEnabled
//                   ? colors.primary
//                   : colors.muted,
//                 padding: 3,
//                 justifyContent: settings.spendingAlertEnabled
//                   ? "flex-end"
//                   : "flex-start",
//               }}
//             >
//               <View
//                 style={{
//                   width: 18,
//                   height: 18,
//                   borderRadius: 9,
//                   backgroundColor: "#FFFFFF",
//                 }}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View style={{ marginTop: 16 }}>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
//               Limit: {formatCurrency(limit)}
//             </Text>
//             <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
//               ₦1k – ₦20k
//             </Text>
//           </View>

//           <Slider
//             value={limit}
//             minimumValue={1000}
//             maximumValue={20000}
//             step={500}
//             minimumTrackTintColor={colors.primary}
//             maximumTrackTintColor={colors.border}
//             thumbTintColor={colors.primary}
//             onValueChange={(val) => setLimit(val)}
//             onSlidingComplete={handleLimitChangeComplete}
//             style={{ marginTop: 8 }}
//           />
//         </View>
//       </Card>

//       {/* Data tools card */}
//       <Card style={{ marginTop: 20, marginBottom: 80 }}>
//         <Text
//           style={{
//             color: colors.textPrimary,
//             fontSize: 18,
//             fontWeight: "600",
//             marginBottom: 8,
//           }}
//         >
//           Data Tools
//         </Text>

//         {Platform.OS === "ios" && (
//           <Text
//             style={{ color: colors.warning, fontSize: 12, marginBottom: 12 }}
//           >
//             SMS import is not available on iPhone due to privacy restrictions.
//           </Text>
//         )}

//         {Platform.OS === "android" && !autoImportSupported && (
//           <Text
//             style={{ color: colors.warning, fontSize: 12, marginBottom: 12 }}
//           >
//             Auto-import requires Android Dev Client build. Disabled in Expo Go.
//           </Text>
//         )}

//         <View style={{ flexDirection: "row", marginTop: 8 }}>
//           <SecondaryButton
//             onPress={() => {}}
//             disabled
//             style={{ flex: 1, marginRight: 8 }}
//           >
//             Import from SMS
//           </SecondaryButton>

//           <PrimaryButton
//             onPress={exportCSV}
//             style={{ flex: 1 }}
//             disabled={purchases.length === 0}
//           >
//             Export CSV
//           </PrimaryButton>
//         </View>
//       </Card>
//     </ScreenContainer>
//   );
// }

import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

import Card from "../../components/Card";
import DonutChart from "../../components/DonutChart";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenContainer from "../../components/ScreenContainer";
import SecondaryButton from "../../components/SecondaryButton";

import { useTheme } from "../../constants/theme";
import { useData } from "../../hooks/useData";
import {
  getHighestProvider,
  getLowestProvider,
  getMonthPercentChange,
  getProviderTotals,
  getTotalSpend,
} from "../../utils/calculations";
import { formatCurrency } from "../../utils/format";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export default function SummaryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { purchases, settings, updateSettings, autoImportSupported } =
    useData();

  const totalSpend = useMemo(() => getTotalSpend(purchases), [purchases]);
  const highest = useMemo(() => getHighestProvider(purchases), [purchases]);
  const lowest = useMemo(() => getLowestProvider(purchases), [purchases]);
  const providerTotals = useMemo(
    () => getProviderTotals(purchases),
    [purchases],
  );
  const percentChange = useMemo(
    () => getMonthPercentChange(purchases),
    [purchases],
  );

  const dataForChart = useMemo(() => {
    const order = ["MTN", "Airtel", "Glo", "9mobile", "Unknown"];
    const keys = order.filter(
      (k) => providerTotals[k] != null && providerTotals[k] > 0,
    );
    const fallbackKeys = Object.keys(providerTotals).filter(
      (k) => !keys.includes(k),
    );
    const finalKeys = [...keys, ...fallbackKeys];

    const colorFor = (key) =>
      key === "MTN"
        ? "#1D4ED8" // blue like mock
        : key === "Airtel"
          ? "#10B981"
          : key === "Glo"
            ? "#0EA5E9"
            : key === "9mobile"
              ? "#8B5CF6"
              : "#64748B";

    return finalKeys.map((key) => ({
      key,
      value: providerTotals[key],
      color: colorFor(key),
    }));
  }, [providerTotals]);

  const [limit, setLimit] = useState(settings.spendingLimit);

  // prevent alert spam
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    setLimit(settings.spendingLimit);
  }, [settings.spendingLimit]);

  // Spending limit logic
  useEffect(() => {
    if (!settings.spendingAlertEnabled) {
      hasWarnedRef.current = false;
      return;
    }

    const safeLimit = Number(settings.spendingLimit) || 0;
    if (safeLimit <= 0) return;

    if (totalSpend >= safeLimit && !hasWarnedRef.current) {
      hasWarnedRef.current = true;
      Alert.alert(
        "Spending Limit Reached",
        `You've spent ${formatCurrency(totalSpend)} which is above your limit of ${formatCurrency(
          safeLimit,
        )}.`,
        [{ text: "OK" }],
      );
    }

    if (totalSpend < safeLimit) hasWarnedRef.current = false;
  }, [totalSpend, settings.spendingAlertEnabled, settings.spendingLimit]);

  const handleToggleAlert = (value) => {
    updateSettings({ spendingAlertEnabled: value });
  };

  const handleLimitChangeComplete = (value) => {
    updateSettings({ spendingLimit: Math.round(value) });
  };

  const exportCSV = async () => {
    try {
      if (!purchases || purchases.length === 0) return;

      const header = "Date,Provider,Title,Amount";
      const rows = purchases
        .slice()
        .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))
        .map((p) => `${p.dateISO},${p.provider},${p.title || ""},${p.amount}`)
        .join("\n");

      const csv = `${header}\n${rows}`;
      const fileUri =
        FileSystem.documentDirectory + `airtime_report_${Date.now()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Airtime CSV",
        UTI: "public.comma-separated-values-text",
      });
    } catch (e) {
      console.log(e);
      Alert.alert("Export", "Export failed. Check logs.");
    }
  };

  const pillBg = (colors.success ?? "#16A34A") + "22";
  const screenBg = colors.background ?? "#F5F7FB";

  const pct = (val) => {
    if (!totalSpend) return 0;
    return Math.round((val / totalSpend) * 100);
  };

  const miniCard = ({ type }) => {
    const isHigh = type === "high";
    const title = isHigh ? "HIGHEST" : "LOWEST";
    const iconName = isHigh ? "arrow-up" : "arrow-down";
    const iconBg = isHigh ? "#EAF2FF" : "#EAFBF3";
    const iconColor = isHigh ? "#1D4ED8" : "#16A34A";
    const network = isHigh
      ? highest.provider || "N/A"
      : lowest.provider || "N/A";
    const amount = isHigh ? highest.amount : lowest.amount;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: iconBg,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>

        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
            letterSpacing: 0.8,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: "800",
            marginTop: 6,
          }}
        >
          {network}
        </Text>

        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}
        >
          {formatCurrency(amount || 0)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenContainer scrollable style={{ backgroundColor: screenBg }}>
      {/* Top Bar (Back + Center Title) */}
      <View
        style={{
          height: 52,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 0, padding: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text
          style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "800" }}
        >
          Summary
        </Text>
      </View>

      {/* Total Spend (Centered) */}
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <Text
          style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 6 }}
        >
          Total Spend
        </Text>

        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 44,
            fontWeight: "900",
            letterSpacing: -0.6,
          }}
        >
          {formatCurrency(totalSpend)}
        </Text>

        {percentChange !== null && (
          <View
            style={{
              marginTop: 10,
              backgroundColor: pillBg,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="trending-up"
              size={16}
              color={colors.success ?? "#16A34A"}
            />
            <Text
              style={{
                marginLeft: 8,
                color: colors.success ?? "#16A34A",
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              {percentChange > 0 ? "+" : ""}
              {percentChange.toFixed(0)}% vs last month
            </Text>
          </View>
        )}
      </View>

      {/* Highest / Lowest */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
        {miniCard({ type: "high" })}
        {miniCard({ type: "low" })}
      </View>

      {/* Network Breakdown */}
      <Card
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 18,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: "800",
            marginBottom: 10,
          }}
        >
          Network Breakdown
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 170,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DonutChart data={dataForChart} size={150} strokeWidth={22} />
          </View>

          <View style={{ flex: 1, paddingLeft: 8 }}>
            {dataForChart.slice(0, 4).map((it) => (
              <View
                key={it.key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 6,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: it.color,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {it.key}
                  </Text>
                </View>

                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    fontWeight: "900",
                  }}
                >
                  {pct(it.value)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      {/* Spending Alert */}
      <Card
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 18,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#1D4ED8" />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              Spending Alert
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Notify when spending exceeds limit
            </Text>
          </View>

          {/* Switch styled like mock (keep your Touchable toggle) */}
          <TouchableOpacity
            onPress={() => handleToggleAlert(!settings.spendingAlertEnabled)}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 46,
                height: 28,
                borderRadius: 999,
                backgroundColor: settings.spendingAlertEnabled
                  ? "#1D4ED8"
                  : "#D1D5DB",
                padding: 4,
                justifyContent: settings.spendingAlertEnabled
                  ? "flex-end"
                  : "flex-start",
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#FFFFFF",
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 14 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              Limit
            </Text>
            <Text style={{ color: "#1D4ED8", fontSize: 14, fontWeight: "900" }}>
              {formatCurrency(limit)}
            </Text>
          </View>

          <Slider
            value={limit}
            minimumValue={1000}
            maximumValue={20000}
            step={500}
            minimumTrackTintColor="#1D4ED8"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#1D4ED8"
            onValueChange={(val) => setLimit(val)}
            onSlidingComplete={handleLimitChangeComplete}
            style={{ marginTop: 10 }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              ₦1k{" "}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              ₦20k{" "}
            </Text>
          </View>
        </View>
      </Card>

      {/* Data Tools */}
      <Card
        style={{
          marginTop: 16,
          marginBottom: 90,
          padding: 16,
          borderRadius: 18,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: "#FFECD6",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="grid-outline" size={20} color="#F97316" />
          </View>

          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 16,
              fontWeight: "900",
            }}
          >
            Data Tools
          </Text>
        </View>

        {/* info box like mock */}
        {(Platform.OS === "ios" ||
          (Platform.OS === "android" && !autoImportSupported)) && (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              backgroundColor: "#F8FAFC",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text
              style={{
                flex: 1,
                marginLeft: 10,
                color: colors.textSecondary,
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              {Platform.OS === "ios"
                ? "Due to iOS privacy restrictions, automatic SMS import is unavailable on iPhone. Please enter data manually."
                : "Auto-import requires Android Dev Client build. Disabled in Expo Go."}
            </Text>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <SecondaryButton onPress={() => {}} disabled>
            Import from SMS
          </SecondaryButton>

          <PrimaryButton onPress={exportCSV} disabled={purchases.length === 0}>
            Export CSV
          </PrimaryButton>
        </View>
      </Card>
    </ScreenContainer>
  );
}
