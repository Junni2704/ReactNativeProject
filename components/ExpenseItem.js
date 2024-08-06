import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpenseItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text>{item.description}</Text>
      <Text>{item.amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default ExpenseItem;