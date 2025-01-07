import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingPoint from "../../../assets/images/icons/LoadingPoint";
import { useAuth } from "../../../context/AuthProvider";
import FormInput from "../../../components/FormInput";
import TruckCard from "../../../components/TruckCard";

const SearchTrucks = () => {
  const { colour } = useAuth();

  return (
    <SafeAreaView style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
      <FormInput Icon={LoadingPoint} placeholder='Enter origin' name='origin' />
      <TruckCard
        data={{
          source: "Lagos",
          destination: "Abuja",
          weight: 2000,
          offeredAmount: 500000,
          numberOfWheels: 10,
          vehicleType: "Truck",
          vehicleBodyType: "Open",
          bids: 5,
          views: 100,
          expiresAt: "2022-12-12",
          tripDistance: 1000,
          advanceAmount: 100000,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SearchTrucks;
