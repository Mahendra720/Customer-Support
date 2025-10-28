import { Text, View, StyleSheet } from "react-native";
import { getCurrentTime } from "../lib/utils";
import { Ionicons } from "@expo/vector-icons";

const User = ({ response }) => {
  return (
    <View style={styles.userContainer}>
      {/* Message Header */}
      <View style={styles.messageHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.userName}>You</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {getCurrentTime()}
            </Text>
            <Ionicons name="checkmark-done" size={12} color={"#10B981"} />
          </View>
        </View>
        <Text style={styles.messageText}>
          {response.message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: "white",
    width: "auto",
    maxWidth: "85%",
    borderRadius: 10,
    marginBottom: 16,
    marginLeft: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: 'hidden',
  },
messageHeader: {
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "#F3E8FF", // Light purple
},
userName: {
  color: "#6B21A8", // Dark purple
  fontSize: 14,
  fontWeight: "700",
},
messageText: {
  fontSize: 15,
  lineHeight: 22,
  color: "black",
  fontWeight:500 // Dark purple
},
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#475569", // Darker gray
    fontWeight: "500"
  },
  
});

export default User;