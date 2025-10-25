import { Text, View } from "react-native";

const TypingIndicator = () => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
      marginLeft: 10,
    }}
  >
    <View
      style={{
        backgroundColor: "#dfe5ee",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ fontSize: 15 }}>Zippybuddy is typing...</Text>
    </View>
  </View>
);

export default TypingIndicator;
