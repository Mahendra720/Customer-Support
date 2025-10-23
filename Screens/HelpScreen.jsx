import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function HelpScreen({ navigation, route }) {
  const { title } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrap}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Get Help</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.divider} />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {title || "Issue with delivered product(s)"}
        </Text>
        <Text style={styles.cardMessage}>
          We're really sorry for the experience. Please reach out to us through the Chat option below.
        </Text>
      </View>
      {/* Optionally add your Chat button here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
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
    marginBottom: 8,
    marginHorizontal: 0, // full width divider
  },
  card: {
    marginTop: 24,
    marginHorizontal: 18,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
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
  }
});
