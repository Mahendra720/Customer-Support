import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { getCurrentTime } from "../lib/utils";

// interface BotProps {
//   response: MessagesType;
//   handleClick: (option: {
//     id: string;
//     name: string;
//     category?: string;
//   }) => void;
// }

const Bot = ({ response, handleClick }) => {
  if (
    response.message.includes("conversation has been ended") ||
    response.message.includes("you rated this conversation")
  ) {
    return (
      <View style={styles.conversationEndedContainer}>
        <Text style={styles.conversationEndedText}>
          ✅ Conversation completed
        </Text>

        {/* Clickable text for still have questions */}
        <Pressable
          onPress={() =>
            handleClick({ id: "main_menu", name: "Go to main menu" })
          }
        >
          <Text style={styles.stillQueryText}>Still have questions?</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.botContainer}>
      {/* Message Header */}
      <View style={styles.messageHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.botName}>Okalbuddy</Text>
          <Text style={styles.timeText}>{getCurrentTime()}</Text>
        </View>
        <Text style={styles.messageText}>{response.message}</Text>
      </View>

      {/* Options Section */}
      {response.options ? (
        <View style={styles.optionsContainer}>
          {response.options.map((option, index, arr) => (
            <Pressable
              onPress={() => handleClick(option)}
              style={({ pressed }) => [
                styles.optionItem,
                index !== arr.length - 1 && styles.optionItemWithBorder,
                pressed && styles.optionPressed,
              ]}
              key={option.id}
            >
              <Text style={styles.optionText}>{option.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <Pressable
            onPress={() =>
              handleClick({ id: "end_conversation", name: "Okay, got it" })
            }
            style={({ pressed }) => [
              styles.optionItem,
              styles.optionItemWithBorder,
              pressed && styles.optionPressed,
            ]}
          >
            <Text style={styles.gotItText}>Okay, got it</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              handleClick({ id: "main_menu", name: "Go back to main menu" })
            }
            style={({ pressed }) => [
              styles.optionItem,
              pressed && styles.optionPressed,
            ]}
          >
            <Text style={styles.menuText}>Go back to main menu</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conversationEndedContainer: {
    backgroundColor: "#F0F9FF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  conversationEndedText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 8,
  },
  stillQueryText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  botContainer: {
    backgroundColor: "white",
    width: "auto",
    maxWidth: "85%",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  messageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  botName: {
    color: "#1E40AF",
    fontSize: 16,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1E40AF",
    fontWeight: "500",
  },
  optionsContainer: {
    paddingVertical: 4,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionItemWithBorder: {
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  optionPressed: {
    backgroundColor: "#F9FAFB",
  },
  optionText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  gotItText: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 15,
  },
  menuText: {
    color: "#D97706",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default Bot;
