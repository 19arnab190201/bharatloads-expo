import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";

const SearchTrucks = () => {
  const { colour } = useAuth();

  return (
    <SafeAreaView style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
      <FormInput Icon={LoadingPoint} placeholder='Enter origin' name='origin' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SearchTrucks;
