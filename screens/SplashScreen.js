import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-expense.png')} style={styles.logo} />
      <Text style={styles.title}>Your Expense Manager</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SplashScreen;