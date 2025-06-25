import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

const UdhaarTrackerApp = () => {
  const [displayValues, setDisplayValues] = useState({
    customers: 0,
    totalOwed: 0,
    totalPending: 0,
    overdueAmount: 0,
  });

  // Sample data
  const dashboardData = {
    customers: 24,
    totalOwed: 15750,
    totalPending: 8950,
    overdueAmount: 2300,
    recentTransactions: [
      { id: 1, name: "Ahmed Khan", amount: 1500, type: "owed", date: "2 days ago" },
      { id: 2, name: "Sara Ali", amount: 850, type: "pending", date: "1 day ago" },
      { id: 3, name: "Hassan Sheikh", amount: 2200, type: "owed", date: "3 days ago" },
      { id: 4, name: "Fatima Malik", amount: 650, type: "pending", date: "Today" },
    ]
  };

  useEffect(() => {
    // Simple animation effect
    const timer = setTimeout(() => {
      setDisplayValues(dashboardData);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-IN')}`;
  };

  const StatCard = ({ title, value, isAmount = false }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>
        {isAmount ? formatCurrency(value) : value}
      </Text>
    </View>
  );

  const TransactionItem = ({ transaction }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: transaction.type === 'owed' ? '#666' : '#333' }
      ]}>
        {transaction.type === 'owed' ? '-' : '+'}{formatCurrency(transaction.amount)}
      </Text>
    </View>
  );

  const ActionButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profilePicture}>
            <Text style={styles.profileInitial}>U</Text>
          </View>
          <Text style={styles.headerTitle}>Udhaar Tracker</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Customers"
            value={displayValues.customers}
          />
          <StatCard
            title="Amount I Owe"
            value={displayValues.totalOwed}
            isAmount={true}
          />
          <StatCard
            title="Pending from Others"
            value={displayValues.totalPending}
            isAmount={true}
          />
          <StatCard
            title="Overdue Amount"
            value={displayValues.overdueAmount}
            isAmount={true}
          />
        </View>

        {/* Net Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Net Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(Math.abs(dashboardData.totalPending - dashboardData.totalOwed))}
          </Text>
          <Text style={styles.balanceStatus}>
            {(dashboardData.totalPending - dashboardData.totalOwed) >= 0 ? 'In your favor' : 'You owe more'}
          </Text>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionsContainer}>
            {dashboardData.recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <ActionButton
              title="Add Customer"
              onPress={() => console.log('Add Customer')}
            />
            <ActionButton
              title="Record Payment"
              onPress={() => console.log('Record Payment')}
            />
            <ActionButton
              title="Send Reminder"
              onPress={() => console.log('Send Reminder')}
            />
            <ActionButton
              title="View Reports"
              onPress={() => console.log('View Reports')}
            />
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C757D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statTitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  balanceStatus: {
    fontSize: 12,
    color: '#6C757D',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
  },
  bottomPadding: {
    height: 20,
  },
});

export default UdhaarTrackerApp;