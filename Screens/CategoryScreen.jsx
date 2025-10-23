// import React, { useEffect, useState } from 'react';
// import { ScrollView, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { fetchCategories } from '../api/api';

// export default function CategoryScreen({ navigation }) {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await fetchCategories();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (e) {
//         Alert.alert('Error', e?.message || 'Failed to load categories');
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const openCategory = (cat) => {
//     navigation.navigate('FAQCategory', { category: cat });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>FAQs</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#e53935" />
//       ) : (
//         categories.map((cat) => (
//           <TouchableOpacity key={cat} style={styles.item} onPress={
//             () => {
               
//                 openCategory(cat)
//                 }}>
//             <Text style={styles.label}>{cat.replace(/_/g, ' ')}</Text>
//           </TouchableOpacity>
//         ))
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
//   item: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   label: { fontSize: 16, color: '#333' },
// });
