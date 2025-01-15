import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { ChatProvider } from "../context/ChatProvider";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChatProvider>
        <StatusBar style='dark' />
        <Slot />
      </ChatProvider>
    </AuthProvider>
  );
}
