import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { createContext, useContext, useEffect, useState } from "react";
import AutoImport from "../native/AutoImport";
import parseAutoImportText from "../utils/parseAutoImport";

const PURCHASES_KEY = "purchases_v1";
const SETTINGS_KEY = "settings_v1";

const DataContext = createContext();

/**
 * Provides purchases and settings context across the app.
 * Handles auto-import (Android Dev Client) and spending alerts.
 */

export function DataProvider({ children }) {
  const [purchases, setPurchases] = useState([]);
  const [settings, setSettings] = useState({
    spendingAlertEnabled: false,
    spendingLimit: 10000,
    autoImportEnabled: false,
  });
  const [autoImportSupported, setAutoImportSupported] = useState(false);
  const [dedupeMap, setDedupeMap] = useState({});

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PURCHASES_KEY);
        if (saved) {
          setPurchases(JSON.parse(saved));
        }
        const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (e) {
        console.warn("Failed to load saved data", e);
      }
    })();
    // Determine if auto-import is supported (Android Dev Client)
    setAutoImportSupported(AutoImport.isAutoImportSupported());
  }, []);

  // Save purchases to storage
  const savePurchases = async (items) => {
    setPurchases(items);
    try {
      await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save purchases", e);
    }
  };

  // Save settings to storage
  const saveSettings = async (value) => {
    setSettings(value);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
    } catch (e) {
      console.warn("Failed to save settings", e);
    }
  };

  // Add a purchase (manual or auto)
  const addPurchase = async (purchase) => {
    const updated = [...purchases, purchase];
    await savePurchases(updated);
    // Spending alert check
    if (settings.spendingAlertEnabled) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthTotal = updated
        .filter((p) => {
          const d = new Date(p.dateISO);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        })
        .reduce((sum, p) => sum + p.amount, 0);
      if (monthTotal > settings.spendingLimit) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Spending Alert",
            body: `You have exceeded your monthly limit of ₦${settings.spendingLimit.toLocaleString()}.`,
          },
          trigger: null,
        });
      }
    }
  };

  // Delete a purchase by id
  const deletePurchase = async (id) => {
    const updated = purchases.filter((p) => p.id !== id);
    await savePurchases(updated);
  };

  // Update settings partially
  const updateSettings = async (partial) => {
    const newSettings = { ...settings, ...partial };
    await saveSettings(newSettings);
  };

  // Manage auto-import subscription
  useEffect(() => {
    if (!autoImportSupported) {
      return;
    }
    let subscription = null;
    if (settings.autoImportEnabled) {
      // Start the native service and subscribe to events
      AutoImport.startAutoImport();
      subscription = AutoImport.subscribeToEvents(({ text, timestamp }) => {
        const parsed = parseAutoImportText(text, timestamp);
        if (!parsed) return;
        if (dedupeMap[parsed.dedupeKey]) {
          return;
        }
        setDedupeMap((prev) => ({ ...prev, [parsed.dedupeKey]: true }));
        addPurchase({
          id: Date.now().toString(),
          title: `${parsed.provider} Top-up`,
          provider: parsed.provider,
          amount: parsed.amount,
          dateISO: parsed.dateISO,
          source: "auto_import_notification",
        });
      });
    } else {
      // Stop the service when disabled
      AutoImport.stopAutoImport();
    }
    // Cleanup
    return () => {
      if (subscription) subscription.remove();
    };
  }, [settings.autoImportEnabled, autoImportSupported, dedupeMap]);

  return (
    <DataContext.Provider
      value={{
        purchases,
        addPurchase,
        deletePurchase,
        settings,
        updateSettings,
        autoImportSupported,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
