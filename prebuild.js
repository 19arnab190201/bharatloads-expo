const fs = require("fs");
const path = require("path");

// Ensure the android/app directory exists
const androidAppDir = path.join(__dirname, "android", "app");
if (!fs.existsSync(androidAppDir)) {
  fs.mkdirSync(androidAppDir, { recursive: true });
}

// Decode and write the Google Services JSON
if (process.env.GOOGLE_SERVICES_JSON) {
  const googleServicesPath = path.join(androidAppDir, "google-services.json");
  const decodedConfig = Buffer.from(
    process.env.GOOGLE_SERVICES_JSON,
    "base64"
  ).toString();
  fs.writeFileSync(googleServicesPath, decodedConfig);
  console.log("✅ Successfully wrote google-services.json");
} else {
  console.warn("⚠️ GOOGLE_SERVICES_JSON environment variable not found");
}

// If you also need iOS configuration, add similar logic for GoogleService-Info.plist
if (process.env.GOOGLE_SERVICES_PLIST) {
  const iosPath = path.join(__dirname, "ios");
  if (!fs.existsSync(iosPath)) {
    fs.mkdirSync(iosPath, { recursive: true });
  }

  const googleServicesPlistPath = path.join(
    iosPath,
    "GoogleService-Info.plist"
  );
  const decodedPlist = Buffer.from(
    process.env.GOOGLE_SERVICES_PLIST,
    "base64"
  ).toString();
  fs.writeFileSync(googleServicesPlistPath, decodedPlist);
  console.log("✅ Successfully wrote GoogleService-Info.plist");
}
