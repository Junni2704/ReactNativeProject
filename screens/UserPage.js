import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserPage = () => {
  return (
    <View style={styles.container}>
      <Text>Name: John Doe</Text>
      <Text>Email: johndoe@example.com</Text>
      <Text>DOB: 01/01/1990</Text>
      <Text>Learn About App</Text>
      <Text>Contact Us</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserPage;