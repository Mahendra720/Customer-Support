import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

// Your issue options
const ISSUE_OPTIONS = [
  "Received wrong product",
  "Damaged product",
  "Torn or tampered packaging",
  "Expired product",
  "Product is missing",
];

export default function SelectItemsAndIssuesScreen({ route }) {
  // Read products from navigation params
  const productsNav = route.params?.products ?? [];

  // Build unique keys per product (prevents bugs!)
  const products = productsNav.map((p, idx) => ({
    ...p,
    _key: `${p.id || p.name || "item"}::${idx}`,
  }));

  const [selectedIssues, setSelectedIssues] = useState({});
  const [expandedId, setExpandedId] = useState(products[0]?._key ?? null);

  const toggleIssueFor = (key, issue) => {
    setSelectedIssues((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(issue)
          ? arr.filter((i) => i !== issue)
          : [...arr, issue],
      };
    });
  };

  const onToggleExpand = (key) => {
    setExpandedId((cur) => (cur === key ? null : key));
  };

  const summary = useMemo(() => selectedIssues, [selectedIssues]);

  return (
    <SafeAreaView style={styles.bg}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View>
          <Text style={styles.sectionTitle}>Select items and issues</Text>
          {products.map((prod) => {
            const key = prod._key;
            const isOpen = expandedId === key;
            const qty = prod.qty ?? prod.quantity ?? 1;
            const price = prod.price ?? prod.amount ?? prod.mrp ?? 0;
            const selectedForThis = selectedIssues[key] || [];
            return (
              <View key={key} style={styles.productCard}>
                <TouchableOpacity
                  style={styles.prodHeader}
                  onPress={() => onToggleExpand(key)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: prod.image }}
                    style={styles.prodImg}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prodName} numberOfLines={1}>
                      {prod.name || prod.title || "Product"}
                    </Text>
                    <Text style={styles.prodDetails}>
                      {qty} piece • ₹{price}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: "#888", paddingLeft: 8 }}>
                    {isOpen ? "▴" : "▾"}
                  </Text>
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.issueArea}>
                    <Text style={styles.selectLabel}>Select issue</Text>
                    {ISSUE_OPTIONS.map((iss) => {
                      const isSelected = selectedForThis.includes(iss);
                      return (
                        <TouchableOpacity
                          key={iss}
                          style={[
                            styles.issueButton,
                            isSelected && styles.issueButtonSelected,
                          ]}
                          onPress={() => toggleIssueFor(key, iss)}
                          activeOpacity={0.9}
                        >
                          <Text
                            style={[
                              styles.issueButtonText,
                              isSelected && { color: "#fff" },
                            ]}
                          >
                            {iss}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => {
              console.log("Selected issues per item:", summary);
              alert("Selections captured. Check console for details.");
            }}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#f7f5fa" },
  sectionTitle: {
    fontSize: 17,
    color: "#111",
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 15,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  prodHeader: { flexDirection: "row", alignItems: "center", gap: 11 },
  prodImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f5eefc",
    marginRight: 12,
  },
  prodName: { fontWeight: "700", fontSize: 15, color: "#2a2050" },
  prodDetails: { fontSize: 13, color: "#666", marginTop: 2 },
  issueArea: { marginTop: 13 },
  selectLabel: {
    fontWeight: "700",
    color: "#8B46EA",
    marginBottom: 11,
    fontSize: 15,
  },
  issueButton: {
    backgroundColor: "#f5eefc",
    borderRadius: 10,
    marginBottom: 9,
    paddingVertical: 12,
    paddingHorizontal: 13,
    alignItems: "center",
  },
  issueButtonSelected: {
    backgroundColor: "#8B46EA",
  },
  issueButtonText: {
    color: "#2C114A",
    fontSize: 15,
    fontWeight: "500",
  },
  continueBtn: {
    backgroundColor: "#8B46EA",
    borderRadius: 16,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    elevation: 2,
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
