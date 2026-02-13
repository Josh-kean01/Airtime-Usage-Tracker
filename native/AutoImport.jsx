import { NativeEventEmitter, NativeModules, Platform } from "react-native";

const { AirtimeAutoImport } = NativeModules;
const emitter = AirtimeAutoImport
  ? new NativeEventEmitter(AirtimeAutoImport)
  : null;

/**
 * Bridge to native auto-import module (Android Dev Client).
 */
export default {
  isAutoImportSupported() {
    return Platform.OS === "android" && !!AirtimeAutoImport;
  },
  openNotificationAccessSettings() {
    if (this.isAutoImportSupported()) {
      AirtimeAutoImport.openNotificationAccessSettings();
    }
  },
  startAutoImport() {
    if (this.isAutoImportSupported()) {
      AirtimeAutoImport.startAutoImport();
    }
  },
  stopAutoImport() {
    if (this.isAutoImportSupported()) {
      AirtimeAutoImport.stopAutoImport();
    }
  },
  subscribeToEvents(handler) {
    if (!this.isAutoImportSupported() || !emitter) {
      return { remove: () => {} };
    }
    return emitter.addListener("AirtimeAutoImportEvent", handler);
  },
};
