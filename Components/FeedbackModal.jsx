import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useRating } from "../store/RatingContext";

const emojis = [
  { id: 1, symbol: "😠", label: "Awful" },
  { id: 2, symbol: "☹️", label: "Bad" },
  { id: 3, symbol: "😐", label: "Okay" },
  { id: 4, symbol: "🙂", label: "Good" },
  { id: 5, symbol: "😍", label: "Excellent" },
];

const FeedbackModal = ({ orderType, orderId }) => {
  const { rating, setRating } = useRating();
  const navigation = useNavigation();

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "white",
        paddingVertical: 10,
      }}
    >
      {/* Rating prompt */}
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        How would you like to rate my assistance?
      </Text>

      {/* Emoji rating row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {emojis.map((e) => (
          <TouchableOpacity
            key={e.id}
            onPress={() => {
              setRating(e.id);
              navigation.navigate("ChatbotFeedback", { orderType, orderId });
            }}
            style={{
              padding: 5,
              transform: [{ scale: rating === e.id ? 1.2 : 1 }],
            }}
          >
            {/* 👇 Inactive emojis are gray; active is normal */}
            <Text
              style={{
                fontSize: 32,
                opacity: rating === e.id ? 1 : 0.3, // makes others gray
              }}
            >
              {e.symbol}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FeedbackModal;
