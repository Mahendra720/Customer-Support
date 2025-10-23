import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import { fetchOrders, fetchCategories } from "../api/api";
import OrderCard from "../Components/OrderCard";
import CategoryList from "../Components/CategoryList";

const { width } = Dimensions.get("window");

export default function HelpSupportScreen({ navigation }) {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [returnOrders, setReturnOrders] = useState([]);
  const [replacementOrders, setReplacementOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const orders = await fetchOrders();
        const cats = await fetchCategories();
        setDeliveredOrders(orders.filter((o) => o.status === "delivered"));
        setReturnOrders(orders.filter((o) => o.status === "returned"));
        setReplacementOrders(orders.filter((o) => o.status === "replaced"));
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <StatusBar backgroundColor="#0078D7" barStyle="light-content" />

      {/* ✨ Gradient / Image Header */}
      {/* <ImageBackground
        source={{
          uri: "https://i.ibb.co/pwgrXsm/blue-gradient-bg.jpg",
        }}
        resizeMode="cover"
        style={styles.headerBox}
      >
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          Track your orders, manage returns, or get instant help.
        </Text> */}
      {/* </ImageBackground> */}

      {/* 🛒 Orders Section */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Your Recent Orders</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0078D7"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            <View style={styles.ordersGroup}>
              {deliveredOrders.length === 0 &&
              returnOrders.length === 0 &&
              replacementOrders.length === 0 ? (
                <Text style={styles.noOrdersText}>
                  No recent orders found.
                </Text>
              ) : (
                <>
                  {deliveredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() =>
                        navigation.navigate("OrderDetail", { order })
                      }
                    />
                  ))}

                  {returnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() =>
                        navigation.navigate("OrderDetail", { order })
                      }
                    />
                  ))}

                  {replacementOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() =>
                        navigation.navigate("OrderDetail", { order })
                      }
                    />
                  ))}
                </>
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* 💬 FAQ Section */}
      <View style={styles.faqBox}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.faqSubtitle}>
          Get instant answers to common questions.
        </Text>

        <CategoryList
          categories={categories}
          onPressCategory={(cat) =>
            navigation.navigate("FAQCategory", { category: cat, })
          }
        />
      </View>

      {/* 🧡 Footer Message */}
      <View style={styles.footerBox}>
        <Text style={styles.footerText}>
          Still need help?{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("HelpIssue")}
          >
            Chat with us
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },

  /* 🔹 HEADER */
  headerBox: {
    width,
    height: 180,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0078D7",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#E0E7FF",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },

  /* 🔹 SECTIONS */
  sectionWrapper: {
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  horizontalScroll: {
    paddingHorizontal: 16,
  },
  ordersGroup: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
  },
  noOrdersText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 16,
    marginVertical: 10,
  },

  /* 🔹 FAQ SECTION */
  faqBox: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  faqSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
    marginLeft: 6,
  },

  /* 🔹 FOOTER */
  footerBox: {
    marginTop: 28,
    marginBottom: 10,
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  linkText: {
    color: "#0078D7",
    fontWeight: "700",
  },
});
