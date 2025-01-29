import React from "react";
import { Text, View, StyleSheet } from "react-native";


const Coins = ({ coins }) => {

  console.log("coins", coins);
    const styles = StyleSheet.create({
        coins: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#000",
        },
        coinsContainer: {
            backgroundColor: '#FFF6E7',
            padding: 8,
            borderRadius: 20,
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
