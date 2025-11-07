import React, { useRef } from "react";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

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

  

  

  
  // ✅ Correct Dynamic Bill Calculation
  const parseRupee = (val) =>
    Number(val?.toString().replace(/[₹,\s]/g, "")) || 0;

  const itemTotal = items.reduce(
    (sum, item) => sum + parseRupee(item.price),
    0
  );
  const totalMrp = items.reduce(
    (sum, item) => sum + parseRupee(item.mrp),
    0
  );

  const handling = 15; // fixed charge
  const delivery = 45; // fixed charge
  const gstOnFees = ((handling + delivery) * 0.18).toFixed(2);
  const saved = totalMrp - itemTotal;
  const total = (
    itemTotal +
    handling +
    delivery +
    parseFloat(gstOnFees)
  ).toFixed(2);
  const struck = (parseFloat(total) + saved).toFixed(2);

  const bill = {
    itemTotal: `₹${itemTotal.toFixed(2)}`,
    handling: `₹${handling.toFixed(2)}`,
    delivery: `₹${delivery.toFixed(2)}`,
    gstOnFees: `₹${gstOnFees}`,
    total: `₹${total}`,
    saved: `₹${saved.toFixed(2)}`,
    struck: `₹${struck}`,
  };

  const meta = order.meta || {
    orderId: order.id || "—",
    receiverName: "Mahi",
    receiverPhone: "9876543210",
    addressLine: "PBHouse, Madhapur",
    placedAt: order.date || "—",
    arrivedAt: "10 mins after order",
  };

  // ✅ Invoice PDF Generation
  const handleDownloadInvoice = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; color: #333; }
            h1 { text-align: center; color: #6c2bd9; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; text-align: left; }
            th { background-color: #f7ecff; color: #6c2bd9; }
            tfoot td { font-weight: bold; border-top: 2px solid #aaa; }
            .summary { margin-top: 20px;margin-left:520px; }
            .total { color: #2e7d32; font-size: 16px; font-weight: bold; }

          </style>
        </head>
        <body>
          <h1>Order Invoice</h1>
          <p><strong>Order ID:</strong> ${meta.orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Receiver:</strong> ${meta.receiverName}</p>
          <p><strong>Address:</strong> ${meta.addressLine}</p>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>MRP</th>
              </tr>

              
            </thead>
            <tbody>
              ${items
                .map(
                  (it) => `
                  <tr>
                    <td>${it.name}</td>
                    <td>${it.qty}</td>
                    <td>${it.price}</td>
                    <td>${it.mrp}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total Bill</td>
                <td>${bill.itemTotal}</td>
              </tr>
            </tfoot>
          </table>

          <div class="summary" >
            <p>Item Total: ${bill.itemTotal}</p>
            <p>Handling Charges: ${bill.handling}</p>
            <p>Delivery: ${bill.delivery}</p>
            <p>GST on Fees: ${bill.gstOnFees}</p>
            <p class="total">Final Amount: ${bill.total}</p>
            <p style="color: #1e824c;">You saved ${bill.saved} on this order!</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing not available on this device");
      }
    } catch (err) {
      console.error("Error generating invoice:", err);
    }
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
               onPress={() =>
              navigation.navigate("ChatbotSupport", {
                products: order.products, // or order.items depending on your data
                orderType: order.status, // e.g., 'delivered', 'returned', etc.
                orderId: order.id,
                rating: "",
              })}
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

          {/* <TouchableOpacity style={styles.downloadBtn}>
            <Text style={styles.downloadText}>
              Download Invoice / Credit Note
            </Text>
          </TouchableOpacity> */}
           <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadInvoice}>
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
