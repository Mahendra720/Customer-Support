import { Text, View } from "react-native";
import { getCurrentTime } from "../lib/utils";

import { Ionicons } from "@expo/vector-icons";

const User = ({ response }) => {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#e9e9e980",
        width: "auto",
        maxWidth: "50%",
        alignItems: "center",
        borderRadius: 10,
        marginLeft: "auto",
      }}
    >
      <Text style={{ fontSize: 15 }}>{response.message}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
          marginLeft: "auto",
        }}
      >
        <Text style={{ fontSize: 12 }}>{getCurrentTime()}</Text>
        <Ionicons name="checkmark-done" size={12} color={"#2847F0"} />
      </View>
    </View>
  );
};

export default User;
