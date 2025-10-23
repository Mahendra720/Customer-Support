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
  container: { padding: 16 },
  question: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  answer: { fontSize: 16, color: '#333' },
});
