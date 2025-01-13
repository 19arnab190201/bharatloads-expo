import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import PickAndDrop from "../pickAndDrop";

export default function chat() {
  return (
    <View>
      <SafeAreaView>
        <PickAndDrop />
      </SafeAreaView>
    </View>
  );
}
