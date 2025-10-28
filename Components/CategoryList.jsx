import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CategoryList({ categories, onPressCategory }) {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={styles.item}
          activeOpacity={0.8}
          onPress={() => {
            console.log(cat);
            onPressCategory(cat);
          }}
        >
          <Text style={styles.label}>{cat.replace(/_/g, ' ')}</Text>
          <Ionicons name="chevron-forward-outline" size={22} color="#000080"  />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 6,

    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
