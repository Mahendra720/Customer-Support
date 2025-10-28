import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params;
  console.log(order);

  // Animations
  const scaleChat = useRef(new Animated.Value(1)).current;
  const scaleHelp = useRef(new Animated.Value(1)).current;

  const animatePressIn = (anim) => {
    Animated.spring(anim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (anim) => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Mock data for demo
  const items = order.items || [
    {
      id: "i1",
      name: "Kurkure Masala Munch",
      qty: "1 pack (75 g)",
      price: "₹19",
      mrp: "₹20",
      image: order.products?.[0]?.image,
    },
    {
      id: "i2",
      name: "Lay's Magic Masala",
      qty: "1 pack (67 g)",
      price: "₹29",
      mrp: "₹30",
      image: order.products?.[1]?.image,
    },
    {
      id: "i3",
      name: "UNIBIC Choco Nut Cookies",
      qty: "1 pack (75 g)",
      price: "₹27",
      mrp: "₹30",
      image: order.products?.[0]?.image,
    },
  ];

  const bill = order.bill || {
    itemTotal: "₹104",
    handling: "₹10.99",
    delivery: "₹0",
    gstOnFees: "₹0.55",
    total: order.price || "₹115.54",
    saved: "₹34",
    struck: "₹151.54",
  };

  const meta = order.meta || {
    orderId: order.id || "—",
    receiverName: "----------",
    receiverPhone: "----------",
    addressLine: "------------",
    placedAt: order.date || "—",
    arrivedAt: "10 mins after order",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Status Header with Chat Icon */}
        <View style={styles.headerCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                {order.status === "placed"
                  ? "Order placed"
                  : order.status === "delivered"
                  ? "Order delivered"
                  : order.status === "returned"
                  ? "Order returned"
                  : "Order replaced"}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Arrived in</Text>
                <Text
                  style={[
                    styles.badgeText,
                    { fontWeight: "700", marginLeft: 4 },
                  ]}
                >
                  10 MINS
                </Text>
              </View>
            </View>

            {/* 💬 Animated Chat Icon */}
            <TouchableWithoutFeedback
              onPressIn={() => animatePressIn(scaleChat)}
              onPressOut={() => animatePressOut(scaleChat)}
              onPress={() => navigation.navigate("HelpIssue", { order })}
            >
              <Animated.View
                style={[
                  styles.chatIconBtn,
                  { transform: [{ scale: scaleChat }] },
                ]}
              >
                <MaterialIcons name="chat" size={22} color="#0078D7" />
                <Text style={styles.chatTextInside}> </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{items.length} items in order</Text>
          {items.map((it) => (
            <View key={it.id} style={styles.itemRow}>
              <Image source={{ uri: it.image }} style={styles.itemImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {it.name}
                </Text>
                <Text style={styles.itemMeta}>{it.qty} • 1 unit</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.itemPrice}>{it.price}</Text>
                <Text style={styles.itemMrp}>{it.mrp}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Item Total</Text>
            <Text style={styles.rowValue}>{bill.itemTotal}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Handling Charge</Text>
            <Text style={styles.rowValue}>{bill.handling}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Delivery Fee</Text>
            <Text style={styles.rowValue}>{bill.delivery}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>GST on Fees</Text>
            <Text style={styles.rowValue}>{bill.gstOnFees}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={[styles.rowLabel, { fontWeight: "700" }]}>
              Total Bill
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.struck}>{bill.struck}</Text>
              <Text style={styles.total}>{bill.total}</Text>
            </View>
          </View>
          <View style={styles.savePill}>
            <Text style={styles.savePillText}>SAVED {bill.saved}</Text>
          </View>

          <TouchableOpacity style={styles.downloadBtn}>
            <Text style={styles.downloadText}>
              Download Invoice / Credit Note
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.kv}>Order ID</Text>
          <Text style={styles.kvValue}>{meta.orderId}</Text>

          <View style={{ height: 12 }} />
          <Text style={styles.kv}>Receiver Details</Text>
          <Text style={styles.kvValue}>
            {meta.receiverName}, {meta.receiverPhone}
          </Text>

          <View style={{ height: 12 }} />
          <Text style={styles.kv}>Delivery Address</Text>
          <Text style={styles.kvValue}>{meta.addressLine}</Text>

          <View style={{ height: 12 }} />
          <Text style={styles.kv}>Order Placed at</Text>
          <Text style={styles.kvValue}>{meta.placedAt}</Text>

          <View style={{ height: 12 }} />
          <Text style={styles.kv}>Order Arrived at</Text>
          <Text style={styles.kvValue}>{meta.arrivedAt}</Text>
        </View>

        {/* Need Help Row */}
        <Animated.View style={{ transform: [{ scale: scaleHelp }] }}>
          <TouchableWithoutFeedback
            onPressIn={() => animatePressIn(scaleHelp)}
            onPressOut={() => animatePressOut(scaleHelp)}
            onPress={() =>
              navigation.navigate("ChatbotSupport", {
                products: order.products, // or order.items depending on your data
                orderType: order.status, // e.g., 'delivered', 'returned', etc.
                orderId: order.id,
                rating: "",
              })
            }
          >
            <Animated.View style={styles.helpRow}>
              <View style={styles.helpLeft}>
                <MaterialIcons
                  name="chat"
                  size={26}
                  color="#0078D7"
                  style={styles.helpIcon}
                />
                <View style={styles.helpTextBox}>
                  <Text style={styles.helpTitle}>
                    Need help with this order?
                  </Text>
                  <Text style={styles.helpSub}>
                    Find your issue or reach out via chat
                  </Text>
                </View>
              </View>
              <Text style={styles.helpArrow}>›</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomBtn, { backgroundColor: "#115b13ff" }]}
        >
          <Text style={[styles.bottomBtnText, { color: "#fff" }]}>
            Rate Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomBtn, { backgroundColor: "#115b13ff" }]}
        >
          <Text style={[styles.bottomBtnText, { color: "#fff" }]}>
            Order Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: { paddingHorizontal: 16, paddingTop: 12 },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ecc71",
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d2d2d",
    marginRight: 12,
  },
  badge: {
    flexDirection: "row",
    backgroundColor: "#f3e6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#6c2bd9", fontSize: 11 },
  chatIconBtn: {
    backgroundColor: "#E0ECFF",
    padding: 10,
    borderRadius: 22,
    shadowColor: "#0078D7",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    marginRight: 10,
  },

  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2d2d2d",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImg: { width: 40, height: 40, marginRight: 12, borderRadius: 6 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#333" },
  itemMeta: { fontSize: 12, color: "#777", marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#333" },
  itemMrp: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginTop: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  rowLabel: { color: "#555", fontSize: 14 },
  rowValue: { color: "#333", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  struck: {
    color: "#999",
    textDecorationLine: "line-through",
    fontSize: 12,
    textAlign: "right",
  },
  total: { color: "#2d2d2d", fontWeight: "700", fontSize: 16 },
  savePill: {
    alignSelf: "flex-start",
    backgroundColor: "#e9f9ee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  savePillText: { color: "#1e824c", fontWeight: "700", fontSize: 12 },
  downloadBtn: {
    backgroundColor: "#f7ecff",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },
  downloadText: { color: "#6c2bd9", fontWeight: "600" },

  kv: { color: "#777", fontSize: 13 },
  kvValue: { color: "#333", fontSize: 14, fontWeight: "600", marginTop: 2 },

  helpRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 18,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  helpLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  helpIcon: {
    marginRight: 14,
    backgroundColor: "#E0ECFF",
    padding: 8,
    borderRadius: 10,
  },
  helpTextBox: { flexShrink: 1 },
  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 2,
  },
  helpSub: { fontSize: 13, color: "#6B7280" },
  helpArrow: { fontSize: 24, color: "#9CA3AF", marginLeft: 6 },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    padding: 12,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bottomBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  bottomBtnText: { fontWeight: "700" },
  chatTextInside: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -5 }, { translateY: -10 }], // center text
    fontSize: 10,
    color: "#0078D7",
    fontWeight: "700",
  },
});
