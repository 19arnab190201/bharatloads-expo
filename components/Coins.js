import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { normalize } from "../utils/functions";


const Coins = ({ coins }) => {

  console.log("coins", coins);
    const styles = StyleSheet.create({
        coins: {
            fontSize: normalize(16),
            fontWeight: "bold",
            color: "#000",
        },
        coinsContainer: {
            backgroundColor: '#FFF6E7',
            padding: normalize(8),
            borderRadius: normalize(20),
        }
    })
    if(coins>999){
      coins=Math.round(coins/1000);
      var isK = true;
    }
  return <View style={styles.coinsContainer}>
    <Text style={styles.coins}>🪙 {coins}{isK && 'k' }</Text>
  </View>;
};

export default Coins;
