// import { View, Text } from "react-native";
// import React from "react";

// const ChatbotFeedback = () => {
//   return (
//     <View>
//       <Text>ChatbotFeedback</Text>
//     </View>
//   );
// };

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useRating } from "../store/RatingContext";

export default function ChatbotFeedback({ navigation, route }) {
  const { orderType, orderId } = route.params;
  console.log("chatbot feedback", orderId, orderType);
  const ratings = [
    { id: "awful", emoji: "😠", label: "Awful" },
    { id: "bad", emoji: "☹️", label: "Bad" },
    { id: "average", emoji: "😐", label: "Average" },
    { id: "good", emoji: "🙂", label: "Good" },
    { id: "excellent", emoji: "😍", label: "Excellent" },
  ];

  const feedbackSets = {
    1: {
      question: "What went wrong with your experience?",
      options: [
        "The support was not helpful",
        "Response was delayed",
        "Issue not resolved",
        "Other issues",
      ],
    },
    2: {
      question: "What could be improved?",
      options: [
        "Response time",
        "Resolution process",
        "Support executive attitude",
        "Communication clarity",
      ],
    },
    3: {
      question: "What did you find okay about the interaction?",
      options: [
        "Response time was acceptable",
        "Resolution was partial",
        "Support could be more proactive",
        "Experience was average",
      ],
    },
    4: {
      question: "What did you like about the interaction?",
      options: [
        "Support executive understood the issue",
        "Response was quick",
        "Issue resolved properly",
        "Helpful and polite support",
      ],
    },
    5: {
      question: "What did you like about the interaction?",
      options: [
        "The support executive went out of their way to help me",
        "I'm happy with the resolution",
        "I received a quick response",
        "The support executive understood the issue correctly",
      ],
    },
  };

  const { rating: selectedRating, setRating: setSelectedRating } = useRating();
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [feedback, setFeedback] = useState("");

  const toggleLikeOption = (index) => {
    setSelectedLikes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    const currentOptions = feedbackSets[selectedRating ?? 0]?.options ?? [];
    // const payload = {
    //   rating: ratings[selectedRating - 1].label,
    //   likes: selectedLikes.map((i) => currentOptions[i]),
    //   feedback: feedback.trim(),
    // };
    navigation.navigate("ChatbotSupport", {
      rating: selectedRating,
      orderType,
      orderId,
    });
    // Alert.alert("Feedback submitted", JSON.stringify(payload, null, 2));
  };

  const currentSet = feedbackSets[selectedRating ?? 0];
  const currentOptions = currentSet?.options ?? [];

  const selectedLabel =
    ratings.find((r) => r.id === selectedRating)?.label ?? "";

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <Text style={styles.question}>How was your overall experience?</Text>

          {/* Emoji Row + Label */}
          <View style={styles.ratingRow}>
            {ratings.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.ratingItem}
                onPress={() => {
                  setSelectedRating(r.id);
                  setSelectedLikes([]);
                }}
              >
                <Text
                  style={[
                    styles.emoji,
                    { opacity: selectedRating === r.id ? 1 : 0.4 },
                    selectedRating === r.id && styles.emojiSelected,
                  ]}
                >
                  {r.emoji}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Label shown at the end of the row */}
            {selectedRating && (
              <Text style={styles.selectedLabel}>{selectedLabel}</Text>
            )}
          </View>

          {selectedRating && (
            <>
              <Text style={[styles.question, { marginTop: 16 }]}>
                {currentSet?.question}
              </Text>

              <View style={styles.likesContainer}>
                {currentOptions.map((opt, idx) => {
                  const selected = selectedLikes.includes(idx);
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => toggleLikeOption(idx)}
                      style={[
                        styles.pill,
                        selected ? styles.pillSelected : styles.pillUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          selected && styles.pillTextSelected,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.question, { marginTop: 16 }]}>
                How can we make your experience better?
              </Text>

              <TextInput
                style={styles.textInput}
                placeholder="Write your feedback here..."
                placeholderTextColor="#888"
                multiline
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
                maxLength={500}
              />
            </>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedRating && styles.submitDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedRating}
          >
            <Text style={styles.submitText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  backButton: { padding: 6 },
  backArrow: { fontSize: 18 },
  content: { paddingHorizontal: 18, paddingBottom: 20 },
  question: { fontSize: 16, color: "#333", marginTop: 8 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  ratingItem: { padding: 4 },
  emoji: { fontSize: 28 },
  emojiSelected: { transform: [{ scale: 1.2 }] },
  selectedLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#1f7d28",
  },
  likesContainer: { marginTop: 10, flexDirection: "row", flexWrap: "wrap" },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 8,
  },
  pillSelected: { backgroundColor: "#1f7d28", borderColor: "#1f7d28" },
  pillUnselected: { backgroundColor: "transparent", borderColor: "#ccc" },
  pillText: { color: "#333", fontSize: 14 },
  pillTextSelected: { color: "#fff" },
  textInput: {
    height: 120,
    borderBottomWidth: 2,
    borderColor: "#1f7d28",
    marginTop: 10,
    padding: 10,
    fontSize: 15,
    borderRadius: 6,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom:0,
  },
  submitButton: {
    width: "95%",
    backgroundColor: "#1f7d28",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitDisabled: { backgroundColor: "#a6caa5" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
