import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ChatScreen({ route, navigation }) {
  const { title } = route.params || {};

  // Standard chat messages as before
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleAttachFile = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Permission to access gallery is required!');
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
      setMessages([
        ...messages,
        { id: Math.random().toString(), user: 'customer', image: imageUri },
      ]);
    }
  };

  const sendMessage = () => {
    if (input.trim().length > 0) {
      setMessages([...messages, { id: Math.random().toString(), user: 'customer', text: input }]);
      setInput('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.msg, item.user === 'customer' ? styles.customer : styles.support]}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.chatImage} />
      ) : (
        <Text style={styles.messageText}>{item.text}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerWrap}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Get Help</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.divider} />
      {/* Info card exactly like the reference screenshot */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {title || "Issue with delivered product(s)"}
        </Text>
        <Text style={styles.cardMessage}>
          We're really sorry for the experience. Please reach out to us through the Chat option below.
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleAttachFile}>
            <Ionicons name="attach" size={28} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingVertical : 18, },
  headerWrap: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
   

    backgroundColor: '#fff',
  },
  backIcon: {
    fontSize: 22,
    color: '#2C114A',
    width: 24,
    textAlign: 'left',
    marginRight: 4,
  },
  headerText: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#2C114A',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 2 ,
    marginHorizontal: 0,
  },
  card: {
    
    marginHorizontal: 18,
    marginVertical:5,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C114A',
    marginBottom: 10,
  },
  cardMessage: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2C114A',
    lineHeight: 22
  },
  container: { flex: 1, backgroundColor: '#f6f6f6', padding: 8 },
  list: { flex: 1 },
  msg: {
    padding: 10,
    marginVertical: 4,
    maxWidth: '70%',
    borderRadius: 8,
  },
  customer: {
    alignSelf: 'flex-end',
    backgroundColor: '#e6f3ff',
  },
  support: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    lineHeight: 24,
  },
  chatImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    marginRight: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  sendBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  iconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
