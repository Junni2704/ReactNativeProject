import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigation.replace('App');
      }
    });

    return unsubscribe; // Clean up the listener on unmount
  }, [navigation]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log('Logged in with:', userCredential.user.email);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-expense.png')} style={styles.image} />
      <Text style={styles.title}>ExpenseLy</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        I'm a new user.{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
          SIGN UP
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;