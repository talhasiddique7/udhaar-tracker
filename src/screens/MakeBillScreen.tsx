import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { RootTabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<RootTabParamList, 'MakeBill'>;

interface Customer {
  id: string;
  name: string;
  phone: string;
  pendingCredit: number;
}

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const { width } = Dimensions.get('window');

// Sample data - replace with your actual data source
const sampleCustomers: Customer[] = [
  { id: '1', name: 'John Smith', phone: '+1234567890', pendingCredit: 250 },
  { id: '2', name: 'Sarah Johnson', phone: '+1234567891', pendingCredit: 0 },
  { id: '3', name: 'Mike Wilson', phone: '+1234567892', pendingCredit: 150 },
];

const MakeBillScreen: React.FC<Props> = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isPaid, setIsPaid] = useState(true); // Payment status toggle
  
  // Add item form states
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemPrice, setItemPrice] = useState('');

  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
  };

  const handleAddItem = () => {
    if (!itemName || !itemPrice || !itemQuantity) {
      Alert.alert('Error', 'Please fill all item details');
      return;
    }

    const quantity = parseInt(itemQuantity);
    const price = parseFloat(itemPrice);
    const total = quantity * price;

    const newItem: BillItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity,
      price,
      total,
    };

    setBillItems([...billItems, newItem]);
    setItemName('');
    setItemQuantity('1');
    setItemPrice('');
    setShowAddItemModal(false);
  };

  const handleRemoveItem = (itemId: string) => {
    setBillItems(billItems.filter(item => item.id !== itemId));
  };

  const handleGenerateBill = () => {
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }
    if (billItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    const actionText = isPaid ? 'Generate Bill' : 'Save as Pending';
    const statusText = isPaid ? 'paid' : 'pending';
    const successMessage = isPaid ? 'Bill generated successfully!' : 'Bill saved as pending!';

    Alert.alert(
      actionText,
      `${actionText} for ${selectedCustomer.name} with total amount Rs${totalAmount} (${statusText})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: isPaid ? 'Generate' : 'Save', onPress: () => {
          // Handle bill generation/saving logic here
          Alert.alert('Success', successMessage);
          // Reset form
          setSelectedCustomer(null);
          setBillItems([]);
          setIsPaid(true); // Reset to paid status
        }}
      ]
    );
  };

  const renderCustomerModal = () => (
    <Modal
      visible={showCustomerModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCustomerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Customer</Text>
            <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={sampleCustomers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.customerItem}
                onPress={() => handleCustomerSelect(item)}
              >
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerPhone}>{item.phone}</Text>
                </View>
                <View style={styles.customerCredit}>
                  <Text style={[
                    styles.creditAmount,
                    { color: item.pendingCredit > 0 ? '#EF4444' : '#10B981' }
                  ]}>
                    Rs{item.pendingCredit}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderAddItemModal = () => (
    <Modal
      visible={showAddItemModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddItemModal(false)}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.addItemModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Enter item name"
                placeholderTextColor="#94A3B8"
                autoFocus={true}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={itemQuantity}
                  onChangeText={setItemQuantity}
                  placeholder="1"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Price (Rs)</Text>
                <TextInput
                  style={styles.input}
                  value={itemPrice}
                  onChangeText={setItemPrice}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderBillItem = ({ item }: { item: BillItem }) => (
    <View style={styles.billItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemInfo}>
          {item.quantity} × Rs{item.price.toFixed(2)}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>Rs{item.total.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create New Bill</Text>
          <View style={styles.billNumber}>
            <Text style={styles.billNumberText}>Bill #INV-{Date.now().toString().slice(-6)}</Text>
          </View>
        </View>

        {/* Customer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowCustomerModal(true)}
            >
              <Ionicons name="person-add" size={20} color="#6366F1" />
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.customerCard}>
            {selectedCustomer ? (
              <>
                <View style={styles.customerRow}>
                  <Ionicons name="person" size={20} color="#6366F1" />
                  <Text style={styles.customerDetail}>{selectedCustomer.name}</Text>
                </View>
                <View style={styles.customerRow}>
                  <Ionicons name="call" size={20} color="#6366F1" />
                  <Text style={styles.customerDetail}>{selectedCustomer.phone}</Text>
                </View>
                <View style={styles.customerRow}>
                  <MaterialIcons name="account-balance-wallet" size={20} color="#6366F1" />
                  <Text style={[
                    styles.customerDetail,
                    { color: selectedCustomer.pendingCredit > 0 ? '#EF4444' : '#10B981' }
                  ]}>
                    Pending: Rs{selectedCustomer.pendingCredit}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.emptyCustomer}>
                <FontAwesome5 name="user-plus" size={32} color="#94A3B8" />
                <Text style={styles.emptyText}>No customer selected</Text>
                <Text style={styles.emptySubtext}>Tap select to choose a customer</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items ({billItems.length})</Text>
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => setShowAddItemModal(true)}
            >
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addItemButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {billItems.length > 0 ? (
            <FlatList
              data={billItems}
              keyExtractor={(item) => item.id}
              renderItem={renderBillItem}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyItems}>
              <MaterialIcons name="shopping-cart" size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>No items added</Text>
              <Text style={styles.emptySubtext}>Add items to create your bill</Text>
            </View>
          )}
        </View>

        {/* Payment Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Status</Text>
          <View style={styles.paymentStatusCard}>
            <View style={styles.paymentStatusRow}>
              <View style={styles.paymentStatusInfo}>
                <Text style={styles.paymentStatusLabel}>
                  {isPaid ? 'Paid' : 'Pending'}
                </Text>
                <Text style={styles.paymentStatusDesc}>
                  {isPaid 
                    ? 'Bill will be generated and marked as paid' 
                    : 'Bill will be saved as pending payment'
                  }
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.paymentToggle,
                  isPaid ? styles.paymentTogglePaid : styles.paymentTogglePending
                ]}
                onPress={() => setIsPaid(!isPaid)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.paymentToggleCircle,
                  isPaid ? styles.paymentToggleCirclePaid : styles.paymentToggleCirclePending
                ]}>
                  {isPaid ? (
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <MaterialIcons name="schedule" size={16} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.bottomSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>Rs{totalAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            isPaid ? styles.statusDotPaid : styles.statusDotPending
          ]} />
          <Text style={[
            styles.statusText,
            isPaid ? styles.statusTextPaid : styles.statusTextPending
          ]}>
            {isPaid ? 'Will be marked as PAID' : 'Will be saved as PENDING'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.generateButton,
            isPaid ? styles.generateButtonPaid : styles.generateButtonPending,
            (!selectedCustomer || billItems.length === 0) && styles.generateButtonDisabled
          ]}
          onPress={handleGenerateBill}
          disabled={!selectedCustomer || billItems.length === 0}
        >
          <MaterialIcons 
            name={isPaid ? "receipt-long" : "save"} 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.generateButtonText}>
            {isPaid ? 'Generate Bill' : 'Save as Pending'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderCustomerModal()}
      {renderAddItemModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  billNumber: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  billNumberText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectButtonText: {
    color: '#6366F1',
    fontWeight: '600',
    marginLeft: 4,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerDetail: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 12,
    fontWeight: '500',
  },
  emptyCustomer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  billItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  itemInfo: {
    fontSize: 14,
    color: '#64748B',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  generateButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonPaid: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  generateButtonPending: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  generateButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Payment Status Styles
  paymentStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentStatusInfo: {
    flex: 1,
  },
  paymentStatusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentStatusDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  paymentToggle: {
    width: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 2,
  },
  paymentTogglePaid: {
    backgroundColor: '#DCFCE7',
  },
  paymentTogglePending: {
    backgroundColor: '#FEF3C7',
  },
  paymentToggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentToggleCirclePaid: {
    backgroundColor: '#059669',
    alignSelf: 'flex-end',
  },
  paymentToggleCirclePending: {
    backgroundColor: '#F59E0B',
    alignSelf: 'flex-start',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusDotPaid: {
    backgroundColor: '#059669',
  },
  statusDotPending: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTextPaid: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#F59E0B',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
  },
  addItemModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
    maxHeight: Platform.OS === 'ios' ? '70%' : '80%',
    minHeight: Platform.OS === 'ios' ? '50%' : '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#64748B',
  },
  customerCredit: {
    alignItems: 'flex-end',
  },
  creditAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Form Styles
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    minHeight: Platform.OS === 'ios' ? 50 : 48,
  },
  addButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MakeBillScreen;