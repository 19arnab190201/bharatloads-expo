import { Dimensions } from "react-native";

export const getTimeLeft = (expiresAt, scheduleDate, whenNeeded) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const scheduleTime = scheduleDate ? new Date(scheduleDate) : null;

  // For scheduled loads that haven't started yet
  if (whenNeeded === "SCHEDULED" && scheduleTime && scheduleTime > now) {
    const timeLeft = scheduleTime - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `Posting in ${days} Days`;
    }
    if (hours > 0) {
      return `Posting in ${hours}h ${minutes}m`;
    }
    return `Posting in ${minutes == 0 ? 1 : minutes}m`;
  }

  // For active or expired loads
  const timeLeft = expiry - now;
  if (timeLeft <= 0) {
    return "Expired";
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 425;

export const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(Math.min(newSize, size * 1.2));
};

export const formatText = (string) => {
  if (!string) return "";
  // replace all the special characters with space
  string = string.replace(/[^a-zA-Z0-9]/g, " ");
  // replace multiple spaces with a single space
  string = string.replace(/\s+/g, " ");
  // convert string to lowercase
  string = string.toLowerCase();
  // remove the trailing space
  string = string.trim();
  //1st letter of each word to uppercase
  string = string.replace(/\b\w/g, (char) => char.toUpperCase());

  return string;
};

export const limitText = (text, limit) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

export const formatVehicle = (text) => {
  //remove spaces and capitalize
  text = text.replace(/\s+/g, "").toUpperCase();
  return text;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => degree * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1.11; // Distance in kilometers
  return Math.round(distance);
};
// make 10000 to 10,000 and like 10000000 to 1,00,00,000 use international numberfunction for money set to inr
export const formatMoneytext = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("₹", "");
};
