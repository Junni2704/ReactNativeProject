import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ExpensesScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const userId = user.uid;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    const q = query(
      collection(db, 'users', userId, 'transactions'),
      where('date', '>=', startOfMonth),
      where('date', '<', endOfMonth),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsList = [];
      let totalIncome = 0;
      let totalExpense = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionsList.push({ ...data, id: doc.id });
        if (data.type === 'income') {
          totalIncome += data.amount;
        } else {
          totalExpense += data.amount;
        }
      });

      setTransactions(transactionsList);
      setIncome(totalIncome);
      setExpense(totalExpense);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionIconText}>
          {item.type === 'income' ? 'I' : 'E'}
        </Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionAccount}>{item.account}</Text>
        <Text style={styles.transactionDate}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.transactionAmount}>{item.type === 'income' ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Income</Text>
          <Text style={styles.summaryAmount}>${income.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Expense</Text>
          <Text style={styles.summaryAmount}>${expense.toFixed(2)}</Text>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>${(income - expense).toFixed(2)}</Text>
        </View>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#004085',
    alignItems: 'center',
  },
  totalBox: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#28A745',
    alignItems: 'center',
  },
  summaryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  summaryAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionsList: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#004085',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionCategory: {
    fontWeight: 'bold',
    color: '#28A745',
  },
  transactionAccount: {
    color: '#6C757D',
  },
  transactionDate: {
    color: '#6C757D',
  },
  transactionAmount: {
    fontWeight: 'bold',
    color: '#28A745',
  },
});

export default ExpensesScreen;
