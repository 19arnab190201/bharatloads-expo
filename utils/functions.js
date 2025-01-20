import { Dimensions } from "react-native";

export const getTimeLeft = (timeToExpiry) => {
  console.log("timeToExpiry", timeToExpiry);
  const now = new Date();
  const expiry = new Date(timeToExpiry);
  const diff = expiry - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}h ${minutes}m`;
};


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 500;

export const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(Math.min(newSize, size * 1.2));
};