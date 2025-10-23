import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HelpSupportScreen from '../Screens/HelpSupportScreen';
import FAQCategoryScreen from '../Screens/FAQCategoryScreen';
import FAQDetailScreen from '../Screens/FAQDetailScreen';
import OrderDetailScreen from '../Screens/OrderDetailsScreen';
import ChatScreen from '../Screens/ChatScreen';
import HelpIssueScreen from '../Screens/IssueScreen';
import HelpOptionsScreen from '../Screens/HelpOptionsScreen';
import HelpScreen from '../Screens/HelpScreen';
const Stack = createStackNavigator();
 
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="HelpSupport">
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Customer Support',headerShown:true}} />
      <Stack.Screen name="FAQCategory" component={FAQCategoryScreen} options={{ title: 'FAQs' }} />
      <Stack.Screen name="FAQDetail" component={FAQDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen}options={{ title: 'Order' }}/>
     <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Customer Chat',headerShown:false }}/>
     <Stack.Screen name="HelpOptionsScreen" component={HelpOptionsScreen}  options={{headerShown:false}}/>
     <Stack.Screen name="HelpScreen" component={HelpScreen} />
     <Stack.Screen
  name="HelpIssue"
  component={HelpIssueScreen}
  options={{ title: 'Help' }}
/>
    </Stack.Navigator>
  );
}
