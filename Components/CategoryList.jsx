import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryList({ categories, onPressCategory }) {
  return (
    <View>
      {categories.map((cat) => (
        <TouchableOpacity key={cat} style={styles.item} onPress={() => {
            console.log(cat);
            onPressCategory(cat)
            }}>
          <Text style={styles.label}>{cat.replace(/_/g, ' ')}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16, color: '#333' }
});
