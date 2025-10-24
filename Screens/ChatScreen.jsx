import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ChatScreen({ navigation, route }) {
  // Get the current order's products/images from navigation params
  // These params should be sent from OrderDetailsScreen or wherever you navigate from
  const products = route?.params?.products || [];
  const orderType = route?.params?.orderType || "delivered"; // or "returned", etc

  return (
    <SafeAreaView style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.brand}>Okal</Text>
        <Text style={styles.greeting}>
          Hello! Welcome to Okal Support.{"\n"}
          I’m here to assist you. Can you specify the issue with your order?
        </Text>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("SelectItemsAndIssues", {
            products,
            orderType,
            category: "delivered",
          })}
        >
          <Text style={styles.bigButtonText}>Issue with Delivered Items</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("SelectItemsAndIssues", {
            products,
            orderType,
            category: "missing",
          })}
        >
          <Text style={styles.bigButtonText}>Items are missing</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("SelectItemsAndIssues", {
            products,
            orderType,
            category: "rider_behaviour",
          })}
        >
          <Text style={styles.bigButtonText}>Report rider behaviour issues</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <Text style={styles.chevron}>⌄</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#f7f5fa" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginTop: 45,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  brand: {
    color: "#8B46EA",
    fontWeight: "700",
    fontSize: 21,
    marginBottom: 2
  },
  greeting: {
    fontSize: 19,
    color: "#232323",
    fontWeight: "500",
    marginBottom: 18,
    marginTop: 3,
  },
  bigButton: {
    borderWidth: 1,
    borderColor: "#ece6fc",
    backgroundColor: "#fbf9fd",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginVertical: 5,
    marginBottom: 7,
    justifyContent: "space-between"
  },
  bigButtonText: {
    fontSize: 18,
    color: "#222",
    fontWeight: "bold",
  },
  arrow: {
    color: "#8B46EA",
    fontSize: 21,
    marginLeft: 12,
    marginBottom: -2,
    fontWeight: '800'
  },
  chevron: {
    fontSize: 26,
    color: "#8B46EA",
    marginTop: 6
  },
});
