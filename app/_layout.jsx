import React from "react";
import { Slot } from "expo-router";
import { DataProvider } from "../hooks/useData";

/**
 * Root layout wraps the entire app with DataProvider.
 * Use this file to provide global contexts.
 */
export default function RootLayout() {
  return (
    <DataProvider>
      <Slot />
    </DataProvider>
  );
}
