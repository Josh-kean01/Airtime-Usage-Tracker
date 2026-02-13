const { withAndroidManifest } = require("@expo/config-plugins");

// Add a permission if not present
function addPermission(manifest, name) {
  manifest.manifest["uses-permission"] =
    manifest.manifest["uses-permission"] || [];
  const perms = manifest.manifest["uses-permission"].map(
    (p) => p.$["android:name"],
  );
  if (!perms.includes(name)) {
    manifest.manifest["uses-permission"].push({ $: { "android:name": name } });
  }
}

// Insert NotificationListenerService into AndroidManifest
function addService(manifest) {
  const app = manifest.manifest.application?.[0];
  if (!app) return manifest;
  app.service = app.service || [];
  const exists = app.service.some(
    (s) => s.$["android:name"] === ".autoimport.AirtimeNotificationListener",
  );
  if (!exists) {
    app.service.push({
      $: {
        "android:name": ".autoimport.AirtimeNotificationListener",
        "android:label": "Airtime Auto Import",
        "android:permission":
          "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",
        "android:exported": "true",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name":
                  "android.service.notification.NotificationListenerService",
              },
            },
          ],
        },
      ],
    });
  }
  return manifest;
}

// Insert BootReceiver for rebinding the service after reboot
function addReceiver(manifest) {
  const app = manifest.manifest.application?.[0];
  if (!app) return manifest;
  app.receiver = app.receiver || [];
  const exists = app.receiver.some(
    (r) => r.$["android:name"] === ".autoimport.BootReceiver",
  );
  if (!exists) {
    app.receiver.push({
      $: {
        "android:name": ".autoimport.BootReceiver",
        "android:enabled": "true",
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [
            { $: { "android:name": "android.intent.action.BOOT_COMPLETED" } },
          ],
        },
      ],
    });
  }
  return manifest;
}

module.exports = function withAutoImportAndroid(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    addPermission(manifest, "android.permission.RECEIVE_BOOT_COMPLETED");
    // BIND_NOTIFICATION_LISTENER_SERVICE is implicitly granted for services; no need to declare in uses-permission.
    addService(manifest);
    addReceiver(manifest);
    return config;
  });
};
