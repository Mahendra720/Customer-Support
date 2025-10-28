import React, { useEffect, useState } from 'react';
import { ScrollView, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { fetchFAQsByCategory } from '../api/api';
import FAQItem from '../Components/FAQItem';

export default function FAQCategoryScreen({ route, navigation }) {
    
    // console.log('API Response Data:', JSON.stringify(res.data, null, 2));
    // console.log('Category requested:', category);

  const { category } = route.params;
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFAQs = async () => {
      setLoading(true);
      try {
        const data = await fetchFAQsByCategory(category);
        setFaqs(Array.isArray(data) ? data : []);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to load FAQs');
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    loadFAQs();
  }, [category]);

  return (
<ScrollView contentContainerStyle={styles.container}>
  <Text style={styles.header}>{category.replace(/_/g, ' ')}</Text>

  {loading ? (
    <ActivityIndicator size="large" color="#e53935" />
  ) : faqs.length === 0 ? (
    <Text>No FAQs found for this category.</Text>
  ) : (
    faqs.map((faq, i) => (
      <FAQItem
        key={`${faq?.question || 'q'}-${i}`}
        faq={faq}
        onPress={() => navigation.navigate('FAQDetail', { category, faq })}
      />
    ))
  )}
</ScrollView>

  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 20, paddingHorizontal: 20},
  header: { fontSize: 20, paddingVertical: 10, fontWeight: '500',color:'#000080' },
});
