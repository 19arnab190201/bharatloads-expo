import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style='dark' />
      <Slot />
    </AuthProvider>
  );
}
