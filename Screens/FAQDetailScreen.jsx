import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FAQDetail from '../Components/FAQDetail';

export default function FAQDetailScreen({ route, navigation }) {
  const { category, faq } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: category });   // 🔥 Shows category name
  }, [category]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FAQDetail faq={faq} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
