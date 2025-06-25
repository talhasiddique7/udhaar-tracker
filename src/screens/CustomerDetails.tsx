import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootTabParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootTabParamList, 'CustomerDetails'>;

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Bill {
  id: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial';
  items: BillItem[];
  dueDate?: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payment' | 'bill';
  billId?: string;
  notes?: string;
  paymentMethod?: 'cash' | 'bank' | 'card';
}

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customer } = route.params;
  const [activeTab, setActiveTab] = useState<'bills' | 'transactions'>('bills');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'card'>('cash');

  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      date: '2023-06-15',
      totalAmount: 2500,
      paidAmount: 2500,
      status: 'paid',
      items: [
        { id: '1', name: 'Product A', quantity: 2, price: 500 },
        { id: '2', name: 'Product B', quantity: 3, price: 500 }
      ]
    },
    {
      id: '2',
      date: '2023-06-18',
      totalAmount: 1800,
      paidAmount: 1000,
      status: 'partial',
      items: [
        { id: '3', name: 'Product C', quantity: 1, price: 800 },
        { id: '4', name: 'Product D', quantity: 2, price: 500 }
      ],
      dueDate: '2023-07-18'
    },
    {
      id: '3',
      date: '2023-06-20',
      totalAmount: 1200,
      paidAmount: 0,
      status: 'pending',
      items: [
        { id: '5', name: 'Product E', quantity: 4, price: 300 }
      ],
      dueDate: '2023-07-20'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: '1', 
      date: '2023-06-15', 
      amount: 2500, 
      type: 'bill', 
      billId: '1' 
    },
    { 
      id: '2', 
      date: '2023-06-16', 
      amount: 1000, 
      type: 'payment', 
      notes: 'Advance payment', 
      paymentMethod: 'cash' 
    },
    { 
      id: '3', 
      date: '2023-06-18', 
      amount: 1800, 
      type: 'bill', 
      billId: '2' 
    },
    { 
      id: '4', 
      date: '2023-06-20', 
      amount: 1200, 
      type: 'bill', 
      billId: '3' 
    }
  ]);

  const pendingAmount = bills.reduce(
    (sum, bill) => sum + (bill.totalAmount - bill.paidAmount), 
    0
  );

  const handleMakePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newPayment: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount,
      type: 'payment',
      notes: paymentNotes,
      paymentMethod
    };

    setTransactions([...transactions, newPayment]);
    
    // Update bill payment status if applicable
    if (amount > 0) {
      const updatedBills = bills.map(bill => {
        if (bill.status !== 'paid' && bill.totalAmount > bill.paidAmount) {
          const remaining = bill.totalAmount - bill.paidAmount;
          const paymentApplied = Math.min(amount, remaining);
          return {
            ...bill,
            paidAmount: bill.paidAmount + paymentApplied,
            status: bill.paidAmount + paymentApplied === bill.totalAmount ? 'paid' : 'partial'
          };
        }
        return bill;
      });
      setBills(updatedBills);
    }

    setPaymentAmount('');
    setPaymentNotes('');
    setShowPaymentModal(false);
  };

  const renderBillItem = ({ item }: { item: Bill }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('BillDetails', { bill: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Bill #{item.id}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'paid' && styles.paidBadge,
          item.status === 'pending' && styles.pendingBadge,
          item.status === 'partial' && styles.partialBadge
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.cardDate}>{item.date}</Text>
      
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total:</Text>
        <Text style={styles.amountValue}>Rs {item.totalAmount.toFixed(2)}</Text>
      </View>
      
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Paid:</Text>
        <Text style={styles.amountValue}>Rs {item.paidAmount.toFixed(2)}</Text>
      </View>
      
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Balance:</Text>
        <Text style={[
          styles.amountValue,
          (item.totalAmount - item.paidAmount) > 0 ? styles.negativeBalance : styles.positiveBalance
        ]}>
          Rs {(item.totalAmount - item.paidAmount).toFixed(2)}
        </Text>
      </View>
      
      {item.dueDate && (
        <View style={styles.dueDateRow}>
          <Ionicons name="calendar" size={14} color="#64748b" />
          <Text style={styles.dueDateText}>Due: {item.dueDate}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {item.type === 'payment' ? 'Payment Receipt' : 'Bill'} - {item.date}
        </Text>
        {item.type === 'payment' && (
          <FontAwesome 
            name={item.paymentMethod === 'cash' ? 'money' : 
                  item.paymentMethod === 'bank' ? 'bank' : 'credit-card'} 
            size={16} 
            color="#4f46e5" 
          />
        )}
      </View>
      
      <Text style={[
        styles.transactionAmount,
        item.type === 'payment' ? styles.positiveAmount : styles.negativeAmount
      ]}>
        {item.type === 'payment' ? '+' : '-'} Rs {item.amount.toFixed(2)}
      </Text>
      
      {item.notes && (
        <View style={styles.notesRow}>
          <Ionicons name="document-text" size={14} color="#64748b" />
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
      
      {item.billId && (
        <Text style={styles.billReference}>Bill #{item.billId}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={['bottom']}>
     
      
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerPhone}>{customer.phone}</Text>
        {customer.address && <Text style={styles.customerAddress}>{customer.address}</Text>}
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Pending Balance:</Text>
          <Text style={styles.balanceAmount}>Rs {pendingAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('bills')}
          style={[styles.tab, activeTab === 'bills' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'bills' && styles.activeTabText]}>Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('transactions')}
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transactions</Text>
        </TouchableOpacity>
      </View>

      {/* List Content */}
      <FlatList
        data={activeTab === 'bills' ? bills : transactions}
        renderItem={activeTab === 'bills' ? renderBillItem : renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons 
              name={activeTab === 'bills' ? 'receipt' : 'list-alt'} 
              size={48} 
              color="#cbd5e1" 
            />
            <Text style={styles.emptyText}>
              No {activeTab === 'bills' ? 'bills' : 'transactions'} found
            </Text>
          </View>
        }
      />

      {/* Payment Button */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => setShowPaymentModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.paymentButtonText}>Add Payment</Text>
      </TouchableOpacity>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Record Payment</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.paymentMethodContainer}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'cash' && styles.methodButtonActive
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <FontAwesome name="money" size={18} color={paymentMethod === 'cash' ? 'white' : '#4f46e5'} />
                  <Text style={[
                    styles.methodText,
                    paymentMethod === 'cash' && styles.methodTextActive
                  ]}>Cash</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'bank' && styles.methodButtonActive
                  ]}
                  onPress={() => setPaymentMethod('bank')}
                >
                  <FontAwesome name="bank" size={18} color={paymentMethod === 'bank' ? 'white' : '#4f46e5'} />
                  <Text style={[
                    styles.methodText,
                    paymentMethod === 'bank' && styles.methodTextActive
                  ]}>Bank</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'card' && styles.methodButtonActive
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <FontAwesome name="credit-card" size={18} color={paymentMethod === 'card' ? 'white' : '#4f46e5'} />
                  <Text style={[
                    styles.methodText,
                    paymentMethod === 'card' && styles.methodTextActive
                  ]}>Card</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Optional notes about the payment"
                multiline
                numberOfLines={3}
                value={paymentNotes}
                onChangeText={setPaymentNotes}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleMakePayment}
            >
              <Text style={styles.saveButtonText}>Record Payment</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  customerInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidBadge: {
    backgroundColor: '#dcfce7',
  },
  pendingBadge: {
    backgroundColor: '#fee2e2',
  },
  partialBadge: {
    backgroundColor: '#fef9c3',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  positiveBalance: {
    color: '#16a34a',
  },
  negativeBalance: {
    color: '#dc2626',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDateText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  positiveAmount: {
    color: '#16a34a',
  },
  negativeAmount: {
    color: '#dc2626',
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  billReference: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  paymentButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  methodButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  methodText: {
    marginLeft: 8,
    color: '#4f46e5',
    fontWeight: '500',
  },
  methodTextActive: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomerDetailsScreen;