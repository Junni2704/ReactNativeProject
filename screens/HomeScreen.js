// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
// import { db, auth } from '../firebase';
// import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { getAuth, signOut } from 'firebase/auth';

// const HomeScreen = ({ navigation }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [income, setIncome] = useState(0);
//   const [expense, setExpense] = useState(0);

//   const fetchTransactions = useCallback(async () => {
//     const user = getAuth().currentUser;
//     if (!user) {
//       console.error('User not authenticated');
//       return;
//     }

//     try {
//       const userId = user.uid;
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const q = query(
//         collection(db, 'users', userId, 'transactions'),
//         orderBy('date', 'desc')
//       );
//       const querySnapshot = await getDocs(q);
//       const transactionsList = [];
//       let totalIncome = 0;
//       let totalExpense = 0;

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         transactionsList.push({ ...data, id: doc.id });
//         if (data.type === 'income') {
//           totalIncome += data.amount;
//         } else {
//           totalExpense += data.amount;
//         }
//       });

//       setTransactions(groupTransactionsByDate(transactionsList));
//       setIncome(totalIncome);
//       setExpense(totalExpense);
//     } catch (error) {
//       console.error('Error fetching transactions: ', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTransactions();
//   }, [fetchTransactions]);

//   const groupTransactionsByDate = (transactions) => {
//     const grouped = transactions.reduce((acc, transaction) => {
//       const date = new Date(transaction.date.seconds * 1000).toDateString();
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(transaction);
//       return acc;
//     }, {});

//     const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

//     return sortedKeys.map(date => ({ title: date, data: grouped[date] }));
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Auth' }],
//       });
//     } catch (error) {
//       console.error('Error signing out: ', error);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.transactionItem}>
//       <View style={styles.transactionIcon}>
//         <Text style={styles.transactionIconText}>
//           {item.type === 'income' ? 'I' : 'E'}
//         </Text>
//       </View>
//       <View style={styles.transactionDetails}>
//         <Text style={styles.transactionCategory}>{item.category}</Text>
//         <Text style={styles.transactionAccount}>{item.account}</Text>
//         <Text style={styles.transactionDate}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
//       </View>
//       <Text style={styles.transactionAmount}>{item.type === 'income' ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}</Text>
//     </View>
//   );

//   const renderSectionHeader = ({ section: { title } }) => (
//     <View style={styles.dateSeparator}>
//       <Text style={styles.dateSeparatorText}>{title}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.summaryContainer}>
//         <View style={styles.summaryBox}>
//           <Text style={styles.summaryText}>Income</Text>
//           <Text style={styles.summaryAmount}>${income.toFixed(2)}</Text>
//         </View>
//         <View style={styles.summaryBox}>
//           <Text style={styles.summaryText}>Expense</Text>
//           <Text style={styles.summaryAmount}>${expense.toFixed(2)}</Text>
//         </View>
//         <View style={styles.totalBox}>
//           <Text style={styles.totalText}>Total</Text>
//           <Text style={styles.totalAmount}>${(income - expense).toFixed(2)}</Text>
//         </View>
//       </View>
//       <SectionList
//         sections={transactions}
//         renderSectionHeader={renderSectionHeader}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.transactionsList}
//       />
//       <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExpenseModal', { refreshTransactions: fetchTransactions })}>
//         <Text style={styles.addButtonText}>Add Transaction</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Text style={styles.logoutButtonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F8F9FA',
//   },
//   summaryContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   summaryBox: {
//     flex: 1,
//     margin: 5,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#004085',
//     alignItems: 'center',
//   },
//   totalBox: {
//     flex: 1,
//     margin: 5,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#28A745',
//     alignItems: 'center',
//   },
//   summaryText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   summaryAmount: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   totalText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   totalAmount: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   transactionsList: {
//     paddingBottom: 20,
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   transactionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#004085',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   transactionIconText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   transactionDetails: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   transactionCategory: {
//     fontWeight: 'bold',
//     color: '#28A745',
//   },
//   transactionAccount: {
//     color: '#6C757D',
//   },
//   transactionDate: {
//     color: '#6C757D',
//   },
//   transactionAmount: {
//     fontWeight: 'bold',
//     color: '#28A745',
//   },
//   addButton: {
//     backgroundColor: '#007BFF',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   addButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   logoutButton: {
//     backgroundColor: '#FF0000',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   logoutButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   dateSeparator: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     backgroundColor: '#F8F9FA',
//   },
//   dateSeparatorText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default HomeScreen;


// // import React, { useEffect, useState, useCallback } from 'react';
// // import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
// // import { db, auth } from '../firebase';
// // import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
// // import { getAuth, signOut } from 'firebase/auth';

// // const HomeScreen = ({ navigation }) => {
// //   const [transactions, setTransactions] = useState([]);
// //   const [income, setIncome] = useState(0);
// //   const [expense, setExpense] = useState(0);

// //   const fetchTransactions = useCallback(async () => {
// //     const user = getAuth().currentUser;
// //     if (!user) {
// //       console.error('User not authenticated');
// //       return;
// //     }

// //     try {
// //       const userId = user.uid;
// //       const today = new Date();
// //       today.setHours(0, 0, 0, 0);
// //       const tomorrow = new Date(today);
// //       tomorrow.setDate(today.getDate() + 1);

// //       const q = query(
// //         collection(db, 'users', userId, 'transactions'),
// //         where('date', '>=', today),
// //         where('date', '<', tomorrow),
// //         orderBy('date', 'desc')
// //       );
// //       const querySnapshot = await getDocs(q);
// //       const transactionsList = [];
// //       let totalIncome = 0;
// //       let totalExpense = 0;

// //       querySnapshot.forEach((doc) => {
// //         const data = doc.data();
// //         transactionsList.push({ ...data, id: doc.id });
// //         if (data.type === 'income') {
// //           totalIncome += data.amount;
// //         } else {
// //           totalExpense += data.amount;
// //         }
// //       });

// //       setTransactions(groupTransactionsByDate(transactionsList));
// //       setIncome(totalIncome);
// //       setExpense(totalExpense);
// //     } catch (error) {
// //       console.error('Error fetching transactions: ', error);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchTransactions();
// //   }, [fetchTransactions]);

// //   const groupTransactionsByDate = (transactions) => {
// //     const grouped = transactions.reduce((acc, transaction) => {
// //       const date = new Date(transaction.date.seconds * 1000).toDateString();
// //       if (!acc[date]) {
// //         acc[date] = [];
// //       }
// //       acc[date].push(transaction);
// //       return acc;
// //     }, {});

// //     const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

// //     return sortedKeys.map(date => ({ title: date, data: grouped[date] }));
// //   };

// //   const handleLogout = async () => {
// //     try {
// //       await signOut(auth);
// //       navigation.reset({
// //         index: 0,
// //         routes: [{ name: 'Auth' }],
// //       });
// //     } catch (error) {
// //       console.error('Error signing out: ', error);
// //     }
// //   };

// //   const renderItem = ({ item }) => (
// //     <View style={styles.transactionItem}>
// //       <View style={styles.transactionIcon}>
// //         <Text style={styles.transactionIconText}>
// //           {item.type === 'income' ? 'I' : 'E'}
// //         </Text>
// //       </View>
// //       <View style={styles.transactionDetails}>
// //         <Text style={styles.transactionCategory}>{item.category}</Text>
// //         <Text style={styles.transactionAccount}>{item.account}</Text>
// //         <Text style={styles.transactionDate}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
// //       </View>
// //       <Text style={styles.transactionAmount}>{item.type === 'income' ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}</Text>
// //     </View>
// //   );

// //   const renderSectionHeader = ({ section: { title } }) => (
// //     <View style={styles.dateSeparator}>
// //       <Text style={styles.dateSeparatorText}>{title}</Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.summaryContainer}>
// //         <View style={styles.summaryBox}>
// //           <Text style={styles.summaryText}>Income</Text>
// //           <Text style={styles.summaryAmount}>${income.toFixed(2)}</Text>
// //         </View>
// //         <View style={styles.summaryBox}>
// //           <Text style={styles.summaryText}>Expense</Text>
// //           <Text style={styles.summaryAmount}>${expense.toFixed(2)}</Text>
// //         </View>
// //         <View style={styles.totalBox}>
// //           <Text style={styles.totalText}>Total</Text>
// //           <Text style={styles.totalAmount}>${(income - expense).toFixed(2)}</Text>
// //         </View>
// //       </View>
// //       <SectionList
// //         sections={transactions}
// //         renderSectionHeader={renderSectionHeader}
// //         renderItem={renderItem}
// //         keyExtractor={item => item.id}
// //         contentContainerStyle={styles.transactionsList}
// //       />
// //       <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExpenseModal', { refreshTransactions: fetchTransactions })}>
// //         <Text style={styles.addButtonText}>Add Transaction</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// //         <Text style={styles.logoutButtonText}>Logout</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#F8F9FA',
// //   },
// //   summaryContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 20,
// //   },
// //   summaryBox: {
// //     flex: 1,
// //     margin: 5,
// //     padding: 10,
// //     borderRadius: 10,
// //     backgroundColor: '#004085',
// //     alignItems: 'center',
// //   },
// //   totalBox: {
// //     flex: 1,
// //     margin: 5,
// //     padding: 10,
// //     borderRadius: 10,
// //     backgroundColor: '#28A745',
// //     alignItems: 'center',
// //   },
// //   summaryText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //   },
// //   summaryAmount: {
// //     color: '#FFFFFF',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   totalText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //   },
// //   totalAmount: {
// //     color: '#FFFFFF',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   transactionsList: {
// //     paddingBottom: 20,
// //   },
// //   transactionItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     padding: 10,
// //     marginBottom: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#FFFFFF',
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     elevation: 2,
// //   },
// //   transactionIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#004085',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   transactionIconText: {
// //     color: '#FFFFFF',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   transactionDetails: {
// //     flex: 1,
// //     marginLeft: 10,
// //   },
// //   transactionCategory: {
// //     fontWeight: 'bold',
// //     color: '#28A745',
// //   },
// //   transactionAccount: {
// //     color: '#6C757D',
// //   },
// //   transactionDate: {
// //     color: '#6C757D',
// //   },
// //   transactionAmount: {
// //     fontWeight: 'bold',
// //     color: '#28A745',
// //   },
// //   addButton: {
// //     backgroundColor: '#007BFF',
// //     padding: 15,
// //     borderRadius: 5,
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   addButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //   },
// //   logoutButton: {
// //     backgroundColor: '#FF0000',
// //     padding: 15,
// //     borderRadius: 5,
// //     alignItems: 'center',
// //   },
// //   logoutButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //   },
// //   dateSeparator: {
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     backgroundColor: '#F8F9FA',
// //   },
// //   dateSeparatorText: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });

// // export default HomeScreen;


import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const fetchTransactions = useCallback(async () => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const userId = user.uid;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const q = query(
        collection(db, 'users', userId, 'transactions'),
        orderBy('date', 'desc')
      );

      let attempts = 0;
      const maxAttempts = 3;
      let success = false;

      while (attempts < maxAttempts && !success) {
        try {
          const querySnapshot = await getDocs(q);
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

          setTransactions(groupTransactionsByDate(transactionsList));
          setIncome(totalIncome);
          setExpense(totalExpense);
          success = true;
        } catch (error) {
          attempts += 1;
          if (attempts >= maxAttempts) {
            if (error.code === 'auth/network-request-failed') {
              Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection.');
            } else {
              console.error('Error fetching transactions: ', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching transactions: ', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const groupTransactionsByDate = (transactions) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date.seconds * 1000).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});

    const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    return sortedKeys.map(date => ({ title: date, data: grouped[date] }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

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

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>{title}</Text>
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
      <SectionList
        sections={transactions}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExpenseModal', { refreshTransactions: fetchTransactions })}>
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dateSeparator: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F8F9FA',
  },
  dateSeparatorText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
