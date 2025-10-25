import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

const emojis = [
  { id: 1, symbol: "😡", label: "Awful" },
  { id: 2, symbol: "😢", label: "Bad" },
  { id: 3, symbol: "😐", label: "Okay" },
  { id: 4, symbol: "😀", label: "Good" },
  { id: 5, symbol: "🥰", label: "Excellent" },
];

// interface FeedbackModalProps {
//   onRestartChat?: () => void;
// }

const FeedbackModal = ({ navigation, onRestartChat }) => {
  const [selected, setSelected] = useState("");

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
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
        {emojis.map((e) => (
          <TouchableOpacity
            onPress={() => {
              setSelected(e.id);
              navigation.navigate("ChatbotFeedback");
            }}
            key={e.id}
            style={{
              padding: 5,
              transform: [{ scale: selected === e.id ? 1.2 : 1 }],
            }}
          >
            <Text style={{ fontSize: 32 }}>{e.symbol}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Pressable onPress={onRestartChat} style={{ marginTop: 16 }}>
        <Text>
          Still have an issue?{" "}
          <Text style={{ color: "green" }}>Talk to an agent</Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default FeedbackModal;
