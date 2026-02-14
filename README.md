# Airtime Usage Tracker App (ICT303 — Group 5)

A mobile app for students to **record airtime purchases**, **categorize by network provider**, **track spending over time**, **export data (CSV)**, and get **spending limit alerts**.  
Built with **Expo React Native** + **expo-router**. Tested on **Android emulator** and **physical Android device**.

> **Important:** The “Auto‑Import” feature is **NOT SMS import**. It is groundwork for importing from **Android notifications** (Dev Client only). If your network sends recharge confirmations only by SMS, auto‑import will not work.

---

## Features

- ✅ Record airtime purchases manually
- ✅ Categorize by provider: **MTN, Airtel, Glo, 9mobile**
- ✅ Analytics:
  - Weekly trend chart
  - Monthly totals + provider breakdown (Summary)
- ✅ **CSV Export** (writes a CSV file and opens the OS share sheet)
- ✅ **Spending limit alert**
  - In-app alert + local notification scheduling when monthly limit is exceeded
- ✅ Auto‑Import groundwork (Android Dev Client only)
  - Listens for **notifications** and attempts to parse airtime confirmations

---

## Screens (5)

1. Splash  
2. Home  
3. Add Airtime  
4. Usage History  
5. Summary  

---

## Tech Stack

- Expo SDK: **~54.0.33**
- React Native: **0.81.5**
- expo-router: **~6.0.23**
- AsyncStorage: **@react-native-async-storage/async-storage 2.2.0**
- CSV Export: **expo-file-system (~19.0.21) via legacy import** + **expo-sharing (~14.0.8)**
- Notifications: **expo-notifications (~0.32.16)**
- UI utilities: react-native-svg, @expo/vector-icons, Slider, DateTimePicker, Picker

---

## Getting Started (Fresh Clone)

### 1) Clone the repo
```bash
git clone https://github.com/Josh-kean01/Airtime-Usage-Tracker.git
cd Airtime-Usage-Tracker
```

### 2) Install dependencies
```bash
npm install
```

### 3) Run the app

#### Option A — Web (for UI preview)
```bash
npm run web
```

#### Option B — Android (recommended)
This project uses a **Dev Client** because it includes Android native code for notification-based auto-import.

```bash
npm run android
```

> If you see “Expo Go” or your native module is missing, you are likely not running the Dev Client build.

---

## Dev Client vs Expo Go (Very Important)

- **Expo Go** cannot load custom native modules (your auto-import module lives in `android/`).
- **Dev Client** is required to test:
  - Auto-Import native module
  - Notification listener bridge

If you installed the Dev Client build on your device/emulator, open the project with:
```bash
npx expo start --dev-client
```

---

## Environment Setup (Windows)

### Required tools
- Node.js (LTS recommended)
- Git
- Android Studio + Android SDK
- JDK (Java)

### JAVA_HOME (Windows)
1. Install a JDK (Android Studio can install one, or use Temurin/Oracle JDK).
2. Set:
   - `JAVA_HOME` = path to your JDK folder (example: `C:\Program Files\Java\jdk-17`)
3. Add to PATH:
   - `%JAVA_HOME%\bin`

### Android SDK
Install via Android Studio → SDK Manager:
- Android SDK Platform (latest stable)
- Android SDK Platform-Tools
- Android SDK Build-Tools

---

## Project Structure (High Level)

```text
Airtime-Usage-Tracker/
├─ app/
│  ├─ (tabs)/
│  │  ├─ home.jsx
│  │  ├─ history.jsx
│  │  └─ summary.jsx
│  ├─ add-airtime.jsx
│  └─ ...
├─ components/
│  ├─ Card.jsx
│  ├─ Chip.jsx
│  ├─ ConfirmModal.jsx
│  ├─ PrimaryButton.jsx
│  ├─ SecondaryButton.jsx
│  ├─ TransactionItem.jsx
│  └─ ...
├─ hooks/
│  └─ useData.jsx
├─ utils/
│  ├─ calculations.js
│  ├─ format.js
│  └─ parseAutoImport.js
├─ native/
│  └─ AutoImport.jsx
├─ android/
│  └─ app/src/main/java/... (native module + package registration)
├─ package.json
└─ ...
```

> The exact folder tree may include additional files; this is the main structure used in the report.

---

## Data Storage

Purchases and settings persist locally using **AsyncStorage**:

- Purchases key: `purchases_v1`
- Settings key: `settings_v1`

Main state management is handled in:
- `hooks/useData.jsx`

---

## CSV Export

CSV export writes a file to app storage and opens the system share sheet.

Used libraries:
- `expo-file-system/legacy`
- `expo-sharing`

Typical output:
- `airtime_report_<timestamp>.csv`

---

## Spending Alert

When **Spending Alert** is enabled, the app checks monthly total spend after each purchase:
- If monthly total exceeds the limit → schedules a local notification (and may also show an in-app alert depending on UI logic).

---

## Auto‑Import (Notifications, Android Dev Client Only)

Auto-import listens for **notification events** (not SMS) and sends parsed results to JavaScript via a native event emitter.

Key paths:
- `native/AutoImport.jsx`
- `android/app/src/main/java/.../autoimport/`

You must enable **Notification Access** on Android for the listener to work.

---

## Building a Release APK (Android)

From the project root:

```bash
cd android
.\gradlew assembleRelease
```

APK output path:
```text
android/app/build/outputs/apk/release/app-release.apk
```

### Installing the APK on another phone
1. Copy `app-release.apk` to the phone (USB / WhatsApp / Drive).
2. Open it on the phone.
3. Allow “Install unknown apps” when prompted.
4. Install.

---

## Screenshots (Add Yours Here)

Screenshots in `docs/screenshots/` and reference them below.

### UI Screens
- [Screenshot: docs/screenshots/01_splash.png]
- [Screenshot: docs/screenshots/02_home.png]
- [Screenshot: docs/screenshots/03_add_airtime.png]
- [Screenshot: docs/screenshots/04_history.png]
- [Screenshot: docs/screenshots/05_summary.png]

### Feature Evidence
- [Screenshot: docs/screenshots/06_export_share_sheet.png]
- [Screenshot: docs/screenshots/07_spending_alert_trigger.png]
- [Screenshot: docs/screenshots/08_notification_access_settings.png]

---

## Testing (Manual Checklist)

Use this checklist for your report evidence:

- [ ] Add purchase → appears on Home, History, Summary
- [ ] Filter by provider in History
- [ ] Delete transaction (Confirm Modal)
- [ ] Export CSV opens share sheet
- [ ] Summary totals match History sum
- [ ] Spending alert triggers when limit is exceeded
- [ ] Auto-import event received (Dev Client + Notification Access enabled)

---

## Known Limitations

- Auto-import reads **notifications**, not SMS.
- Some networks send recharge confirmations by SMS only → auto-import will not detect them.
- Notification Access must be enabled manually by the user.

---

## License

For academic use (ICT303). 