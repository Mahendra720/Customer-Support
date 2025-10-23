import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  TextInput,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function SupportScreen() {
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const API_URL = "http://192.168.1.53:3000/faqs";

  useEffect(() => {
    fetchFaqs();
    setMessages([
    //   { id: "1", user: "support", text: "Hi 👋! How can we help you today?" },
    ]);
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      console.log("Fetching from:", API_URL);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data = await res.json();
      console.log("Fetched FAQs:", data);
      setFaqs(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFaqSelect = (item) => {
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), user: "customer", text: item.question },
      { id: Math.random().toString(), user: "support", text: item.answer },
    ]);
    scrollToEnd();
  };

  const handleAttachFile = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Gallery access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), user: "customer", image: imageUri },
      ]);
      scrollToEnd();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Math.random().toString(),
      user: "customer",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToEnd();

    try {
      // 🔍 Search by question field from your JSON
      const res = await fetch(
        `${API_URL}?question_like=${encodeURIComponent(input)}`
      );
      const data = await res.json();
      console.log("Response:", data);

      const reply =
        data.length > 0
          ? data[0].answer
          : "Sorry 😔, I couldn’t find an answer for that.";

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Math.random().toString(), user: "support", text: reply },
        ]);
        scrollToEnd();
      }, 700);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.msg,
        item.user === "customer" ? styles.customer : styles.support,
      ]}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.chatImage} />
      ) : (
        <Text style={styles.msgText}>{item.text}</Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <>
      <Text style={styles.header}>Need Help with this Order?</Text>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#0078D7" />
        ) : (
          faqs.map((it, idx) => (
            <TouchableOpacity
              key={it.id}
              style={[
                styles.row,
                idx !== faqs.length - 1 && styles.rowDivider,
              ]}
              onPress={() => handleFaqSelect(it)}
            >
              <Text style={styles.rowText}>{it.question}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      {/* <Text style={styles.chatHeader}>Chat with Support</Text> */}
    </>
  );

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F9FF" }}>
        
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              ListHeaderComponent={renderHeader}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={{ padding: 16 }}
              onContentSizeChange={scrollToEnd}
            />

            {/* Chat Input */}
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleAttachFile}
              >
                <Ionicons name="attach" size={28} color="#888" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={input}
                onChangeText={setInput}
              />

              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F5F9FF" },
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1E3A8A",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  rowText: { fontSize: 15, color: "#1E293B", flexShrink: 1 },
  chevron: { fontSize: 22, color: "#CBD5E1" },
  chatHeader: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  msg: { padding: 10, marginVertical: 4, maxWidth: "75%", borderRadius: 8 },
  msgText: { fontSize: 14, color: "#1E293B" },
  customer: { alignSelf: "flex-end", backgroundColor: "#DCFCE7" },
  support: { alignSelf: "flex-start", backgroundColor: "#E0E7FF" },
  chatImage: { width: 150, height: 150, borderRadius: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#0078D7",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  iconBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
   