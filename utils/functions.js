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
