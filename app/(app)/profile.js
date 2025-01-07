import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthProvider";
const Profile = () => {
  const { user, logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{`Hello ${user?.name}!`}</Text>
      <Button
        onPress={logout}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
          width: 200,
        }}
        title='Sign Out'></Button>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Profile;
