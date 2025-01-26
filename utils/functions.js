import { Dimensions } from "react-native";

export const getTimeLeft = (timeToExpiry) => {
  const now = new Date();
  const expiry = new Date(timeToExpiry);
  const diff = expiry - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  if (hours < 0 || minutes < 0) {
    return "Expired";
  }
  return `${hours}h ${minutes}m Left`;
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
}
