// ✅ FILE: src/screens/CustomersScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '../navigation/AppNavigator';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootTabParamList, 'Customers'>;

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  pendingBalance: number;
}

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'John Doe', phone: '9876543210', address: '123 Main St', pendingBalance: 250 },
    { id: '2', name: 'Jane Smith', phone: '9876543211', address: '456 Oak Ave', pendingBalance: 0 },
    { id: '3', name: 'Bob Johnson', phone: '9876543212', address: '789 Pine Rd', pendingBalance: 1500 },
  ]);

  const [searchText, setSearchText] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({ 
    name: '', 
    phone: '', 
    address: '', 
    pendingBalance: 0 
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      Alert.alert('Error', 'Please enter at least name and phone number');
      return;
    }

    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', phone: '', address: '', pendingBalance: 0 });
    setShowAddModal(false);
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity 
      style={styles.customerItem}
      onPress={() => navigation.navigate('CustomerDetails', { customer: item })}
    >
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
        {item.address ? <Text style={styles.customerAddress}>{item.address}</Text> : null}
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[
          styles.balanceText,
          item.pendingBalance > 0 ? styles.positiveBalance : styles.zeroBalance
        ]}>
          Rs {item.pendingBalance.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Customer</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {filteredCustomers.length > 0 ? (
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>No customers found</Text>
          <Text style={styles.emptySubtext}>Add your first customer to get started</Text>
        </View>
      )}

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Customer</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name*</Text>
              <TextInput
                style={styles.input}
                value={newCustomer.name}
                onChangeText={(text) => setNewCustomer({...newCustomer, name: text})}
                placeholder="Customer name"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone*</Text>
              <TextInput
                style={styles.input}
                value={newCustomer.phone}
                onChangeText={(text) => setNewCustomer({...newCustomer, phone: text})}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={newCustomer.address}
                onChangeText={(text) => setNewCustomer({...newCustomer, address: text})}
                placeholder="Full address"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Balance</Text>
              <TextInput
                style={styles.input}
                value={newCustomer.pendingBalance.toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  setNewCustomer({...newCustomer, pendingBalance: value});
                }}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddCustomer}
            >
              <Text style={styles.saveButtonText}>Save Customer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  listContent: {
    padding: 16,
  },
  customerItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  balanceContainer: {
    marginLeft: 12,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#dc2626',
  },
  zeroBalance: {
    color: '#16a34a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomersScreen;
