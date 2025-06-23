import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StatusBar } from 'react-native';

import { RootTabParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootTabParamList, 'CustomerDetails'>;

interface Bill {
  id: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial';
  items: { id: string; name: string; quantity: number; price: number }[];
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payment' | 'bill';
  billId?: string;
  notes?: string;
}

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customer } = route.params;
  const [activeTab, setActiveTab] = useState<'bills' | 'transactions'>('bills');

  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      date: '2023-06-15',
      totalAmount: 2500,
      paidAmount: 2500,
      status: 'paid',
      items: [{ id: '1', name: 'Item A', quantity: 2, price: 500 }]
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2023-06-15', amount: 2500, type: 'bill', billId: '1' },
    { id: '2', date: '2023-06-16', amount: 1000, type: 'payment', notes: 'Cash' }
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const pendingAmount = bills.reduce((sum, bill) => sum + (bill.totalAmount - bill.paidAmount), 0);

  const handleMakePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount');
      return;
    }

    const newPayment: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount,
      type: 'payment',
      notes: paymentNotes
    };

    setTransactions([...transactions, newPayment]);
    setPaymentAmount('');
    setPaymentNotes('');
    setShowPaymentModal(false);
  };

  const renderBillItem = ({ item }: { item: Bill }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Bill #{item.id}</Text>
      <Text>Status: {item.status.toUpperCase()}</Text>
      <Text>Total: Rs {item.totalAmount}</Text>
      <Text>Paid: Rs {item.paidAmount}</Text>
    </View>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.type === 'payment' ? 'Payment' : 'Bill'} - {item.date}
      </Text>
      <Text>
        {item.type === 'payment' ? '+' : '-'} Rs {item.amount}
      </Text>
      {item.notes && <Text>Note: {item.notes}</Text>}
    </View>
  );

  return (
  <SafeAreaView style={styles.safeContainer}>
      <View style={styles.customerHeader}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerPhone}>{customer.phone}</Text>
        <Text style={styles.pendingAmount}>Pending: Rs {pendingAmount}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('bills')}
          style={[styles.tab, activeTab === 'bills' && styles.activeTab]}
        >
          <Text style={activeTab === 'bills' ? styles.activeTabText : styles.tabText}>Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('transactions')}
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
        >
          <Text style={activeTab === 'transactions' ? styles.activeTabText : styles.tabText}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'bills' ? bills : transactions}
        renderItem={activeTab === 'bills' ? renderBillItem : renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {activeTab === 'bills' ? 'bills' : 'transactions'} found</Text>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowPaymentModal(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="white" />
        <Text style={styles.fabText}>
          {activeTab === 'transactions' ? 'Add Transaction' : 'Add Payment'}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={showPaymentModal} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add {activeTab === 'bills' ? 'Payment' : 'Transaction'}</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Amount"
              style={styles.input}
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
            <TextInput
              placeholder="Notes"
              style={[styles.input, { height: 80 }]}
              multiline
              value={paymentNotes}
              onChangeText={setPaymentNotes}
            />
            <TouchableOpacity onPress={handleMakePayment} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default CustomerDetailsScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  customerHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0'
  },
  safeContainer: {
  flex: 1,
  backgroundColor: '#f1f5f9',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
},

  customerName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  customerPhone: { color: '#64748b', marginBottom: 4 },
  pendingAmount: { color: '#dc2626', fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1'
  },
  tabText: { color: '#64748b' },
  activeTabText: { fontWeight: '600', color: '#1e293b' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 5
  },
  fabText: { color: 'white', marginLeft: 8, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0'
  },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalContent: { padding: 16 },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    padding: 14,
    alignItems: 'center',
    borderRadius: 8
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
