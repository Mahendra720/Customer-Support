import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function FAQItem({ faq, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.col}>
        <Text style={styles.q}>{faq?.question}</Text>
        {/* <Text numberOfLines={1} style={styles.a}>{faq?.answer}</Text> */}
      </View>
      <Text style={styles.chev}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0e3e3ff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  col: { flex: 1, paddingRight: 8 },
  q: { fontSize: 14,fontWeight:'500', color: '#222', marginBottom: 0,fontStyle:'italic' },
  a: { fontSize: 14, color: '#666' },
  chev: { fontSize: 25, color: '#000080', fontWeight:'800'},
});
