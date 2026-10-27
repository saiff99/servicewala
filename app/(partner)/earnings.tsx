import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function PartnerEarningsScreen() {
  const { currentPartnerId, technicians, requestWalletPayout } = useEcosystemStore();
  const partner = technicians.find((t) => t.id === currentPartnerId) || technicians[0];

  const [payoutModalVisible, setPayoutModalVisible] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);

  // Computed metrics
  const totalCompletedJobs = partner.completedJobs;
  const platformFeeEarned = Math.round((partner.totalEarnings / (1 - partner.commissionRate / 100)) * (partner.commissionRate / 100));

  const handlePayoutSubmit = () => {
    const num = parseFloat(payoutAmount);
    if (isNaN(num) || num <= 0) {
      setPayoutMessage('Please enter a valid payout amount.');
      return;
    }
    const res = requestWalletPayout(partner.id, num);
    setPayoutMessage(res.message);
    if (res.success) {
      setTimeout(() => {
        setPayoutModalVisible(false);
        setPayoutAmount('');
        setPayoutMessage(null);
      }, 1500);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* WALLET BALANCE HERO CARD */}
      <View style={styles.heroWalletCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroWalletLabel}>AVAILABLE WALLET BALANCE</Text>
            <Text style={styles.heroWalletAmount}>{currencyFormatter(partner.walletBalance)}</Text>
          </View>
          <View style={styles.walletIconCircle}>
            <Ionicons name="wallet" size={24} color="#10B981" />
          </View>
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroStatsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Lifetime Net Earnings</Text>
            <Text style={styles.statValue}>{currencyFormatter(partner.totalEarnings)}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Commission Rate</Text>
            <Text style={styles.statValue}>{partner.commissionRate}%</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Jobs Done</Text>
            <Text style={styles.statValue}>{totalCompletedJobs}</Text>
          </View>
        </View>

        {/* Instant Payout Button */}
        <TouchableOpacity
          onPress={() => {
            setPayoutAmount(partner.walletBalance.toString());
            setPayoutMessage(null);
            setPayoutModalVisible(true);
          }}
          disabled={partner.walletBalance <= 0}
          style={[
            styles.payoutActionBtn,
            partner.walletBalance <= 0 && styles.payoutActionBtnDisabled,
          ]}
          activeOpacity={0.88}
        >
          <Ionicons name="arrow-up-circle" size={18} color="#FFFFFF" />
          <Text style={styles.payoutActionBtnText}>Transfer to Verified Bank Account</Text>
        </TouchableOpacity>
      </View>

      {/* VERIFIED BANK ACCOUNT DETAILS */}
      <View style={styles.bankCard}>
        <View style={styles.bankHeader}>
          <View style={styles.bankIconWrap}>
            <Ionicons name="business" size={18} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bankName}>HDFC Bank Ltd • Indiranagar Branch</Text>
            <Text style={styles.accountNumber}>A/C: •••• •••• 4102 | IFSC: HDFC0001234</Text>
          </View>
          <View style={styles.bankVerifiedTag}>
            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
            <Text style={styles.bankVerifiedText}>IMPS Active</Text>
          </View>
        </View>
      </View>

      {/* COMMISSIONS BREAKDOWN CARD */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>Commission & Deductions Breakdown</Text>
        <View style={styles.commissionBox}>
          <View style={styles.commRow}>
            <Text style={styles.commLabel}>Servicewala Platform Fee</Text>
            <Text style={styles.commVal}>{partner.commissionRate}% per order</Text>
          </View>
          <View style={styles.commRow}>
            <Text style={styles.commLabel}>TDS Deduction</Text>
            <Text style={styles.commVal}>1% (Section 194C)</Text>
          </View>
          <View style={styles.commRow}>
            <Text style={styles.commLabel}>Estimated Platform Fee Paid</Text>
            <Text style={styles.commVal}>{currencyFormatter(platformFeeEarned)}</Text>
          </View>
          <View style={styles.commRow}>
            <Text style={styles.commLabel}>Insurance Coverage</Text>
            <Text style={[styles.commVal, { color: '#059669', fontWeight: '800' }]}>
              ₹5,00,000 Free
            </Text>
          </View>
        </View>
      </View>

      {/* RECENT EARNINGS HISTORY */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>Recent Earnings & Payout Activity</Text>
        <View style={styles.historyList}>
          {[
            {
              id: 'txn-1',
              title: 'Order SW-98124 Completed',
              sub: 'Plumber: Tap Leakage & Flush Tank Repair',
              amount: '+ ₹515',
              type: 'credit',
              time: 'Today, 03:45 PM',
            },
            {
              id: 'txn-2',
              title: 'IMPS Bank Transfer Dispatched',
              sub: 'Payout to HDFC A/C •••• 4102',
              amount: '- ₹4,000',
              type: 'debit',
              time: 'Yesterday, 07:15 PM',
            },
            {
              id: 'txn-3',
              title: 'Order SW-98118 Completed',
              sub: 'Power Jet AC Servicing (2 units)',
              amount: '+ ₹1,018',
              type: 'credit',
              time: '25 Oct 2026, 05:20 PM',
            },
            {
              id: 'txn-4',
              title: 'Weekly Performance Bonus',
              sub: '5-Star Customer Rating Streak (10 in a row)',
              amount: '+ ₹500',
              type: 'credit',
              time: '24 Oct 2026, 10:00 AM',
            },
          ].map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View
                style={[
                  styles.historyIconCircle,
                  { backgroundColor: item.type === 'credit' ? '#ECFDF5' : '#EEF2FF' },
                ]}
              >
                <Ionicons
                  name={item.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                  size={16}
                  color={item.type === 'credit' ? '#059669' : '#4F46E5'}
                />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historySub}>{item.sub}</Text>
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
              <Text
                style={[
                  styles.historyAmount,
                  { color: item.type === 'credit' ? '#059669' : '#0F172A' },
                ]}
              >
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 120 }} />

      {/* PAYOUT MODAL */}
      <Modal
        visible={payoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPayoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="arrow-up-circle" size={20} color="#10B981" />
              </View>
              <Text style={styles.modalHeading}>Request Instant Bank Payout</Text>
              <TouchableOpacity
                onPress={() => setPayoutModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalBodyText}>
                Transfer available earnings directly to your verified HDFC bank account via IMPS.
                Settlement is immediate.
              </Text>

              <View style={styles.payoutLimitBox}>
                <Text style={styles.payoutLimitLabel}>Max Available for Withdrawal:</Text>
                <Text style={styles.payoutLimitValue}>{currencyFormatter(partner.walletBalance)}</Text>
              </View>

              <Text style={styles.inputLabel}>Enter Amount (₹)</Text>
              <TextInput
                value={payoutAmount}
                onChangeText={setPayoutAmount}
                placeholder="Amount in ₹"
                keyboardType="numeric"
                style={styles.amountInput}
              />

              {payoutMessage && (
                <Text
                  style={[
                    styles.messageText,
                    payoutMessage.includes('dispatched') ? styles.messageSuccess : styles.messageError,
                  ]}
                >
                  {payoutMessage}
                </Text>
              )}

              <TouchableOpacity
                onPress={handlePayoutSubmit}
                style={styles.submitPayoutBtn}
                activeOpacity={0.88}
              >
                <Ionicons name="flash" size={16} color="#FFFFFF" />
                <Text style={styles.submitPayoutBtnText}>Confirm IMPS Payout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrap: {
    padding: 16,
    paddingBottom: 40,
  },
  heroWalletCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    ...THEME.shadows.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroWalletLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  heroWalletAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  walletIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statCol: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  payoutActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.partnerPrimary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  payoutActionBtnDisabled: {
    opacity: 0.5,
  },
  payoutActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  bankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    ...THEME.shadows.subtle,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  accountNumber: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  bankVerifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  bankVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  commissionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...THEME.shadows.subtle,
  },
  commRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  commLabel: {
    fontSize: 13,
    color: '#475569',
  },
  commVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...THEME.shadows.subtle,
  },
  historyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  historySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  historyTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxWidth: 420,
    width: '100%',
    ...THEME.shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  modalIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    gap: 12,
  },
  modalBodyText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  payoutLimitBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  payoutLimitLabel: {
    fontSize: 12,
    color: '#475569',
  },
  payoutLimitValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  amountInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  messageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageSuccess: {
    color: '#059669',
  },
  messageError: {
    color: '#EF4444',
  },
  submitPayoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.partnerPrimary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 6,
  },
  submitPayoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
