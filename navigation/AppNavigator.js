import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import UserPage from '../screens/UserPage';
import AddExpenseModal from '../components/AddExpenseModal';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Daily" component={HomeScreen} />
    <Tab.Screen name="Monthly" component={ExpensesScreen} />
    <Tab.Screen name="User" component={UserPage} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddExpenseModal" component={AddExpenseModal} options={{ presentation: 'modal' }} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;