import { Tabs } from "expo-router";
import {
  Pressable,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Bid from "../../../assets/images/icons/Bid";
import Home from "../../../assets/images/icons/Home";
import Loads from "../../../assets/images/icons/Loads";
import Chat from "../../../assets/images/icons/Chat";
import Offer from "../../../assets/images/icons/Offer";

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginLeft: 20,
    }}>
    <Text style={styles.backButtonText}>Back</Text>
  </TouchableOpacity>
);

export default function TabLayout() {
  return (
    <Tabs
      pressColor={"transparent"}
      screenOptions={{
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ color: "transparent" }} />
        ),
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        tabBarPressColor: "transparent",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1E293B",
          borderTopWidth: 0,
          height: 85,
          paddingTop: 23,
          paddingHorizontal: 5,
          marginBottom: 20,
          marginHorizontal: 10,
          borderRadius: 20,
        },
        headerShown: true,
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused ? (
                <View style={styles.tabButtonInner}>
                  <Home />
                  <View style={styles.tabButtonActiveChip}></View>
                </View>
              ) : (
                <Home />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='loads'
        options={{
          title: "Your Loads",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused ? (
                <View style={styles.tabButtonInner}>
                  <Loads />
                  <View style={styles.tabButtonActiveChip}></View>
                </View>
              ) : (
                <Loads />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='bids'
        options={{
          title: "Bids",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused ? (
                <View style={styles.tabButtonInner}>
                  <Bid />
                  <View style={styles.tabButtonActiveChip}></View>
                </View>
              ) : (
                <Bid />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused ? (
                <View style={styles.tabButtonInner}>
                  <Chat />
                  <View style={styles.tabButtonActiveChip}></View>
                </View>
              ) : (
                <Chat />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='offer'
        options={{
          title: "Offer",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused ? (
                <View style={styles.tabButtonInner}>
                  <Offer />
                  <View style={styles.tabButtonActiveChip}></View>
                </View>
              ) : (
                <Offer />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButtonInner: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#334155",
    marginVertical: 12,
  },
  tabButtonActiveChip: {
    position: "absolute",
    bottom: 0,
    width: "60%",
    height: 6,
    backgroundColor: "#14B8A6",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
