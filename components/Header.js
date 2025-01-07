import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import { useAuth } from "../context/AuthProvider";
import { useNavigation } from "expo-router";

const Avatar = ({ name }) => {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: "#24CAB6",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "500",
      textTransform: "uppercase",
    },
  });
  return (
    <Pressable onPress={() => navigation.navigate("profile")}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name[0]}</Text>
      </View>
    </Pressable>
  );
};

const Header = () => {
  const { user, colour } = useAuth();
  console.log(user);

  const styles = StyleSheet.create({
    headerContainer: {
      padding: 10,
      backgroundColor: colour.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    headerLeft: {
      flexDirection: "row",
    },
    headerLeftSub: {
      marginLeft: 10,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "500",
      textTransform: "capitalize",
      color: colour.text,
    },
    headerSubText: {
      fontSize: 16,
      color: "#666",
      textTransform: "capitalize",
      color: colour.secondaryColor,
    },
    headerRight: {},
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Avatar name={user?.name || "U"} />
        <View style={styles.headerLeftSub}>
          <Text style={styles.headerText}>
            {user?.name ? `${user.name}!` : "Welcome!"}
          </Text>
          <Text style={styles.headerSubText}>{user?.userType}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
