import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const options = [
  {
    label: "Issue with delivered product(s)",
    value: "product_issue"
  },
  {
    label: "Report rider behaviour issues",
    value: "rider_issue"
  },
  {
    label: "Did not receive the order or missing items",
    value: "missing_items"
  }
];

export default function HelpOptionsScreen({ navigation }) {
  const handleOptionPress = (option) => {
    // Navigate to chat screen and pass selected topic/type as param
    navigation.navigate('Chat', {  title: option.label,
    type: option.key, });
  };

  return (
    <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
         <View style={styles.headerWrap}>
                <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
                  <Text style={styles.backIcon}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Need Help with this Order?</Text>
                <View style={{ width: 24 }} />
              </View>
      {/* <Text style={styles.header}></Text> */}
      {options.map((option, idx) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleOptionPress(option)}
          style={styles.option}
        >
          <Text style={styles.optionText}>{option.label}</Text>
          <Text style={styles.chevron}>{'>'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#fff', padding:20 },
  header: {fontSize:18, fontWeight:'600', marginVertical:20, color:'#222'},
  option: {
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:18,
    borderBottomWidth:1,
    borderBottomColor:'#f3f3f3',
    justifyContent:'space-between'
  },
  headerWrap: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
   

    backgroundColor: '#fff',
  },
  
   headerText: {
    flex: 4,
    fontSize:22 ,
    fontWeight: '700',
    color: '#2C114A',
    textAlign: 'center',
   },
   backIcon: {
    fontSize: 22,
    color: '#2C114A',
    width: 24,
    textAlign: 'left',
    marginRight: 4,
  },
  optionText: {fontSize:16, color:'#222'},
  chevron: {fontSize:20, color:'#C2185B'},
  
});
