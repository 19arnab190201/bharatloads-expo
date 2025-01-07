import { View, Text } from "react-native";
import React, { useEffect } from "react";

import { useAuth } from "../../context/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function Layout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("test");

    if (isAuthenticated) {
      console.log("Authenticated");
    } else {
      console.log("Not Authenticated");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View>
        <Redirect href='/login' />
      </View>
    );
  }

  return <Slot />;
}
