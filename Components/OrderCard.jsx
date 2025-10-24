import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function OrderCard({ order, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <Text style={styles.status}>
{
  order.status === 'placed'
    ? 'Order placed'
    : order.status === 'delivered'
    ? 'Order delivered'
    : order.status === 'returned'
    ? 'Order returned'
    : 'Order replaced'
}
        </Text>
        <Text style={styles.date}>Placed at {order.date}</Text>
        <Text style={styles.price}>{order.price}</Text>
        <View style={styles.imageRow}>
          {order.products.map((p, i) => (
            <Image key={i} source={{ uri: p.image }} style={styles.productImage} resizeMode="contain" />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    width: 220,
    marginRight: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  price: {
    position: 'absolute',
    right: 10,
    top: 10,
    fontWeight: '700',
    fontSize: 15,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  productImage: {
    width: 65,
    height: 65,
    marginRight: 8,
    borderRadius: 6,
  },
});
