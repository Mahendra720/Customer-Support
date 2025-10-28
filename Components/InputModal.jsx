import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const InputModal = ({ value, text, setValue, onClose, handleSubmit }) => {
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: -40,
        paddingVertical: 10,
        backgroundColor: "#00000080",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          backgroundColor: "transparent",
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#c9c9c980",
          }}
        >
          <Ionicons name="close-outline" size={30} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 10 }}>{text}</Text>

        <TextInput
          value={value}
          onChangeText={setValue}
          style={{
            width: "100%",
            height: 70,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        />

        <TouchableOpacity
          style={{
            paddingVertical: 10,
            backgroundColor: value.length >= 1 ? "green" : "gray",
            marginTop: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={value.length === 0}
          onPress={handleSubmit}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputModal;
