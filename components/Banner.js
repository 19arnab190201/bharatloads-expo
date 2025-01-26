import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "expo-router";

const Banner = ({
  description = "Banner Description",
  image = "https://via.placeholder.com/150",
  cta = "Learn More",
  backgroundColor = "#fff",
  textColor = "#000",
  ctaUrl = "/",
  onPress,
}) => {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    bannerContainer: {
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 12,
    },
    bannerLeft: {
      padding: 20,
      width: "70%",
    },
    bannerRight: {
      width: "30%",
    },
    bannerDescription: {
      fontSize: 14,
      fontWeight: "400",
      marginBottom: 10,
      color: textColor,
    },
    bannerButton: {
      marginTop: 2,
      padding: 10,
      paddingVertical: 8,
      borderRadius: 50,
      borderWidth: 1,
      textAlign: "center",
      width: 100,
      borderColor: textColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerLeft}>
        <Text style={styles.bannerDescription}>{description}</Text>
        <Pressable
          style={styles.bannerButton}
          onPress={() => navigation.navigate(ctaUrl)}>
          <Text style={{ color: textColor }}>{cta}</Text>
        </Pressable>
      </View>

      <View style={styles.bannerRight}>
        <Image
          style={{
            width: "100%",
            objectFit: "cover",
            position: "relative",
          }}
          source={image}
        />
      </View>
    </View>
  );
};

export default Banner;
