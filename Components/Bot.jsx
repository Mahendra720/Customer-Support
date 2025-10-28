// import { getCurrentTime } from "@/utils";
import React from "react";
import { Pressable, Text, View } from "react-native";
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
      <View
        style={{
          backgroundColor: "#FFF8E1",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
          width: "90%",
        }}
      >
        <Text style={{ textAlign: "center" }}>✅ {response.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "white",
        width: "auto",
        maxWidth: "70%",
        borderRadius: 10,
      }}
    >
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          // backgroundColor: "#B39DDB",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: "#dfe5ee",
        }}
      >
        <Text
          style={{
            color: "#000080",
            fontSize: 14,
            fontWeight: "700",
            marginBottom: 5,
          }}
        >
          Okalbuddy
        </Text>
        <Text style={{ fontSize: 15 }}>{response.message}</Text>
        <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12 }}>{getCurrentTime()}</Text>
        </View>
      </View>

      {response.options ? (
        <View>
          {response.options.map((option, index, arr) => (
            <Pressable
              onPress={() => handleClick(option)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderBottomWidth: index === arr.length - 1 ? 0 : 1,
                borderColor: "gray",
              }}
              key={option.id}
            >
              <Text
                style={{
                  color: "#4169E1",
                  fontWeight: "900",
                  fontSize: 16,
                }}
              >
                {option.name}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View>
          <Pressable
            onPress={() =>
              handleClick({ id: "end_conversation", name: "Okay, got it" })
            }
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderColor: "gray",
            }}
          >
            <Text
              style={{
                color: "#4169E1",
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              Okay, got it
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              handleClick({ id: "main_menu", name: "Go back to main menu" })
            }
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: "#4169E1",
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              Go back to main menu
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Bot;
