// import { useNavigation } from "@react-navigation/native";
// import React from "react";
// import { TouchableOpacity, Text, View } from "react-native";
// import { useRating } from "../store/RatingContext";

// const emojis = [
//   { id: 1, symbol: "😠", label: "Awful" },
//   { id: 2, symbol: "☹️", label: "Bad" },
//   { id: 3, symbol: "😐", label: "Okay" },
//   { id: 4, symbol: "🙂", label: "Good" },
//   { id: 5, symbol: "😍", label: "Excellent" },
// ];

// const FeedbackModal = () => {
//   const { rating, setRating } = useRating();
//   const navigation = useNavigation();

//   return (
//     <View
//       style={{
//         alignItems: "center",
//         marginTop: 10,
//         backgroundColor: "white",
//         paddingVertical: 10,
//       }}
//     >
//       {/* Rating prompt */}
//       <Text style={{ fontSize: 16, marginBottom: 10 }}>
//         How would you like to rate my assistance?
//       </Text>

//       {/* Emoji rating row */}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "center",
//           gap: 12,
//         }}
//       >
//         {emojis.map((e) => (
//           <TouchableOpacity
//             key={e.id}
//             onPress={() => {
//               setRating(e.id);
//               navigation.navigate("ChatbotFeedback");
//             }}
//             style={{
//               padding: 5,
//               transform: [{ scale: rating === e.id ? 1.2 : 1 }],
//             }}
//           >
//             {/* 👇 Inactive emojis are gray; active is normal */}
//             <Text
//               style={{
//                 fontSize: 32,
//                 opacity: rating === e.id ? 1 : 0.3, // makes others gray
//               }}
//             >
//               {e.symbol}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default FeedbackModal;

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useRating } from "../store/RatingContext";

const { height } = Dimensions.get("window");

const emojis = [
  { id: "awful", symbol: "😠", label: "Awful", color: "#ff4d4d" },
  { id: "bad", symbol: "☹️", label: "Bad", color: "#ff944d" },
  { id: "average", symbol: "😐", label: "Average", color: "#ffcc00" },
  { id: "good", symbol: "🙂", label: "Good", color: "#4CAF50" },
  { id: "excellent", symbol: "😍", label: "Excellent", color: "#00C3FF" },
];

const FeedbackModal = ({ visible = true, onClose, orderId, orderType }) => {
  const { setRating } = useRating();
  const [selected, setSelected] = useState(null);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handlePress = (emoji) => {
    setSelected(emoji.id);
    setRating(emoji.id);

    // Close the bottom sheet first
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 350,
      easing: Easing.in(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
      // Navigate FIRST to feedback screen
      navigation.navigate("ChatbotFeedback", {
        rating: emoji,
        orderId,
        orderType,
      });
    });
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.title}>
        How would you like to rate my assistance?
      </Text>
      <View style={styles.emojiRow}>
        {emojis.map((emoji) => (
          <TouchableOpacity
            // onPress={() => {
            //   setRating(e.id);
            //   navigation.navigate("ChatbotFeedback", { orderType, orderId });
            // }}
            // style={{
            //   padding: 5,
            //   transform: [{ scale: rating === e.id ? 1.2 : 1 }],
            // }}
            key={emoji.id}
            onPress={() => handlePress(emoji)}
            style={[
              styles.emojiButton,
              {
                transform: [{ scale: selected === emoji.id ? 1.2 : 1 }],
              },
            ]}
          >
            <Text
              style={{ fontSize: 35, opacity: selected === emoji.id ? 1 : 0.4 }}
            >
              {emoji.symbol}
            </Text>
            <Text
              style={[
                styles.label,
                { color: selected === emoji.id ? emoji.color : "#555" },
              ]}
            >
              {emoji.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 15,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  emojiButton: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});

export default FeedbackModal;
