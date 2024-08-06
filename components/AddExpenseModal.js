import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddExpenseModal = ({ navigation, route }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Loan');
  const [account, setAccount] = useState('Cash');

  const { refreshTransactions } = route.params;

  const handleAddTransaction = async () => {
    try {
      const userId = getAuth().currentUser.uid;
      await addDoc(collection(db, 'users', userId, 'transactions'), {
        description,
        amount: parseFloat(amount),
        type,
        category,
        account,
        date: new Date(),
      });
      console.log('Transaction added!');
      refreshTransactions(); // Refresh transactions in HomeScreen
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction: ', error);
    }
  };

  const renderStep1 = () => (
    <View style={styles.container}>
      <Text style={styles.title}>What would you like to add?</Text>
      <TouchableOpacity style={styles.optionButton} onPress={() => { setType('income'); setStep(2); }}>
        <Text style={styles.optionText}>Income</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => { setType('expense'); setStep(2); }}>
        <Text style={styles.optionText}>Expense</Text>
      </TouchableOpacity>
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Add {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
          mode="dropdown" // This line ensures the dropdown opens on both platforms
        >
          <Picker.Item label="Loan" value="Loan" />
          <Picker.Item label="Rent" value="Rent" />
          <Picker.Item label="Business" value="Business" />
          <Picker.Item label="Grocery" value="Grocery" />
          <Picker.Item label="Bills" value="Bills" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>
      <Text style={styles.label}>Account</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={account}
          onValueChange={(itemValue) => setAccount(itemValue)}
          style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
          mode="dropdown" // This line ensures the dropdown opens on both platforms
        >
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Direct Deposit" value="Direct Deposit" />
          <Picker.Item label="E transfer" value="E transfer" />
          <Picker.Item label="Cheque" value="Cheque" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.modalContainer}>
      {step === 1 ? renderStep1() : renderStep2()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  pickerWrapper: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerIOS: {
    height: 150, // Adjust the height for iOS to ensure the picker is fully visible
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AddExpenseModal;
