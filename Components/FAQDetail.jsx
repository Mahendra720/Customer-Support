import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FAQDetail({ faq }) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{faq?.question}</Text>
      <Text style={styles.answer}>{faq?.answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10,backgroundColor:'#E6E6FA',borderRadius:15 },
  question: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  answer: { fontSize: 15, color: '#4d4848ff' },
});
