# Airtime Usage Tracker App — Implementation Guide (Reproducible)

**Course:** ICT303  
**Project:** Airtime Usage Tracker App (Mobile Application)  
**Repository:** https://github.com/Josh-kean01/Airtime-Usage-Tracker  
**Stack:** Expo React Native + expo-router (Dev Client for native auto-import)

This guide is written so a stranger can clone the repo and run the app on an Android emulator and/or a physical Android phone, and (optionally) build a release APK.

---

## 1) What you are building

An Airtime Usage Tracker that lets users:

- Record airtime purchases (manual entry)
- Categorize by provider (**MTN, Airtel, Glo, 9mobile**)
- View usage history with filtering + delete
- See summary analytics (totals, breakdown, trends)
- Export purchases to **CSV** (share sheet)
- Enable spending limit alerts
- Android-only **auto-import groundwork via NOTIFICATIONS** (not SMS), requiring **Notification Access** and **Dev Client**

> **Important limitation:** Auto-import parses **notification text**, not SMS. If a network sends only SMS confirmations, auto-import will not import those purchases.

---

## 2) Exact versions used (from `package.json`)

These versions matter for reproducibility.

### Core
- `expo`: **~54.0.33**
- `react-native`: **0.81.5**
- `react`: **19.1.0**
- `expo-router`: **~6.0.23**
- `expo-dev-client`: **~6.0.20**

### Storage + export + alerts
- `@react-native-async-storage/async-storage`: **2.2.0**
- `expo-file-system`: **~19.0.21** (export uses **legacy** API import)
- `expo-sharing`: **~14.0.8**
- `expo-notifications`: **~0.32.16**

### UI utilities
- `@expo/vector-icons`: **^15.0.3**
- `@react-native-community/slider`: **5.0.1**
- `react-native-svg`: **15.12.1**

---

## 3) Prerequisites (Windows)

### Required installs
1. **Node.js** (recommended: latest LTS)
2. **Git**
3. **Android Studio** (includes SDK + emulator tools)
4. **JDK 17** (recommended for modern Android builds)

### Android Studio SDK components to install
Open **Android Studio → Settings → Android SDK** and install:

- **Android SDK Platform** (latest stable installed on your machine)
- **Android SDK Build-Tools**
- **Android SDK Platform-Tools**
- **Android Emulator**
- **Command-line Tools (latest)**

---

## 4) Environment variables (Windows)

### A) JAVA_HOME (JDK path)
1. Search Windows: **Environment Variables**
2. Add **System variable**:
   - Name: `JAVA_HOME`
   - Value: your JDK path, e.g. `C:\Program Files\Java\jdk-17`
3. Edit **Path** and add:
   - `%JAVA_HOME%\bin`

Verify in PowerShell:
```powershell
java -version
echo $env:JAVA_HOME
```

### B) ANDROID_HOME (optional but helpful)
If needed, set:
- `ANDROID_HOME` = `C:\Users\<you>\AppData\Local\Android\Sdk`

And add to PATH:
- `%ANDROID_HOME%\platform-tools`
- `%ANDROID_HOME%\emulator`
- `%ANDROID_HOME%\cmdline-tools\latest\bin`

Verify:
```powershell
adb version
```

---

## 5) Clone and install

```bash
git clone https://github.com/Josh-kean01/Airtime-Usage-Tracker.git
cd Airtime-Usage-Tracker
npm install
```

---

## 6) Running the app (Dev Client workflow)

### Why Dev Client?
This project includes **native Android code** for auto-import groundwork. Expo Go does not load custom native modules, so the app must run in a **Dev Client** build.

### A) Run on Android Emulator
1. Start your emulator:
   - Android Studio → Device Manager → Start an AVD
2. In the project folder:
```bash
npx expo run:android
```

### B) Run on a physical Android phone
1. Enable **Developer Options** on your phone
2. Enable **USB debugging**
3. Plug in USB
4. Confirm device is detected:
```powershell
adb devices
```
5. Run:
```bash
npx expo run:android
```

### C) Show the app on emulator AND phone at the same time
Yes.

1) Install the dev client build on both devices (emulator running + phone connected):
```bash
npx expo run:android
```
Repeat if needed so each device gets the app installed.

2) Then run Metro:
```bash
npx expo start --dev-client
```
- Emulator: press **a**
- Phone: open the installed Dev Client app and connect to the dev session

---

## 7) Project structure (high level)

- `app/` — screens + routes (expo-router)
- `components/` — UI components (Card, buttons, Chip, TransactionItem, etc.)
- `hooks/` — state + persistence (`useData`)
- `utils/` — calculations + parsing helpers
- `native/` — JS wrapper for Android native module
- `android/` — native Android project (dev client + native code)

---

## 8) Key modules explained

### A) `hooks/useData`
- Loads purchases + settings from AsyncStorage on app start
- Saves changes back to AsyncStorage
- Exposes: `addPurchase`, `deletePurchase`, `updateSettings`
- Spending alert check happens after `addPurchase`
- Manages auto-import subscription (Android dev-client only)

### B) `utils/calculations`
Central analytics helpers used by Home/Summary:
- week totals, month totals
- provider breakdown
- percent change vs last month

### C) CSV export
- Uses `expo-file-system/legacy` for stable `writeAsStringAsync`
- Uses `expo-sharing` to open share sheet

### D) Spending alert
- When `spendingAlertEnabled` is on, monthly totals are checked
- If total exceeds `spendingLimit`, notification is triggered

### E) Auto-import (Android Notifications)
Flow:
Native notification listener → JS event → parse text → add purchase  
**Not SMS**. Notification Access must be enabled manually.

---

## 9) Manual testing checklist (recommended)

1. Add purchase → shows on Home, History, Summary
2. Filter History by provider chips
3. Delete purchase → removed + totals update
4. Export CSV → share sheet opens + file is valid
5. Summary totals = sum of purchases
6. Spending alert: enable + set low limit + add purchase → alert triggers
7. Auto-import: enable + enable notification access + trigger notification → record created (only if parsable)

---

## 10) Build a release APK (for sharing)

### A) Build (Windows)
From the project root:
```powershell
cd android
.\gradlew.bat assembleRelease
```

### B) Output path
After success, find the APK here:
- `android\app\build\outputs\apk\release\app-release.apk`

### C) Install on another phone
1. Copy `app-release.apk` to the phone
2. Allow **Install unknown apps**
3. Tap APK → Install

---

## 11) Troubleshooting (real issues you already hit)

### 1) Export warning / deprecated filesystem API
Fix: use legacy import:
```js
import * as FileSystem from "expo-file-system/legacy";
```

### 2) “EncodingType is undefined”
Fix: use:
```js
FileSystem.EncodingType.UTF8
```

### 3) Auto-import “does nothing”
Most common causes:
- Running in Expo Go (must use Dev Client)
- Notification Access not enabled
- Telco confirmation arrives by SMS (not notification)

### 4) `.\gradlew assembleRelease` not recognized
On Windows, run:
```powershell
.\gradlew.bat assembleRelease
```

### 5) Metro caching / weird behavior
```bash
npx expo start --clear --dev-client
```

---

## 12) Reproducibility evidence (fresh clone run-through)

1. Clone repo
2. `npm install`
3. Start emulator
4. `npx expo run:android`
5. Add purchases and verify Home/History/Summary update
6. Export CSV
7. Enable spending alert and trigger it
8. Build release APK and install on another phone

---

## Appendix: Useful commands

```bash
# start dev client server
npx expo start --dev-client

# rebuild dev client and install
npx expo run:android

# clear cache
npx expo start --clear

# release apk build (windows)
cd android
.\gradlew.bat assembleRelease
```
