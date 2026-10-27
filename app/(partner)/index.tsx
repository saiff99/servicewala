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

export default function PartnerJobsScreen() {
  const {
    currentPartnerId,
    technicians,
    orders,
    partnerAcceptJob,
    partnerStartJob,
    partnerCompleteJob,
    toggleTechnicianDuty,
  } = useEcosystemStore();

  const partner = technicians.find((t) => t.id === currentPartnerId) || technicians[0];
  const isOnline = partner.status === 'online';

  // Find active job currently assigned to this partner
  const activeJob = orders.find(
    (o) =>
      o.assignedTechnicianId === partner.id &&
      (o.status === 'assigned' || o.status === 'in_progress')
  );

  // Find incoming requested jobs that any online partner can accept
  const incomingRequests = orders.filter((o) => o.status === 'requested');

  // OTP Modal State
  const [otpModalMode, setOtpModalMode] = useState<'start' | 'end' | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleStartJobSubmit = () => {
    if (!activeJob) return;
    setOtpError(null);
    const res = partnerStartJob(activeJob.id, enteredOtp);
    if (res.success) {
      setSuccessBanner(res.message);
      setOtpModalMode(null);
      setEnteredOtp('');
    } else {
      setOtpError(res.message);
    }
  };

  const handleCompleteJobSubmit = () => {
    if (!activeJob) return;
    setOtpError(null);
    const res = partnerCompleteJob(activeJob.id, enteredOtp);
    if (res.success) {
      setSuccessBanner(res.message);
      setOtpModalMode(null);
      setEnteredOtp('');
    } else {
      setOtpError(res.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* DUTY STATUS BANNER */}
      <View
        style={[
          styles.dutyBanner,
          isOnline ? styles.dutyBannerOnline : styles.dutyBannerOffline,
        ]}
      >
        <View style={styles.dutyBannerLeft}>
          <View
            style={[
              styles.dutyIndicator,
              { backgroundColor: isOnline ? '#10B981' : '#EF4444' },
            ]}
          />
          <View>
            <Text style={styles.dutyTitle}>
              {isOnline ? 'You are ON-DUTY & Available' : 'You are currently OFFLINE'}
            </Text>
            <Text style={styles.dutySub}>
              {isOnline
                ? `Receiving jobs within ${partner.city}`
                : 'Turn on duty above to receive new job requests.'}
            </Text>
          </View>
        </View>

        {!isOnline && (
          <TouchableOpacity
            onPress={() => toggleTechnicianDuty(partner.id)}
            style={styles.goOnlineBtn}
          >
            <Text style={styles.goOnlineText}>Go Online</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SUCCESS BANNER ALERT */}
      {successBanner && (
        <View style={styles.alertSuccess}>
          <Ionicons name="checkmark-circle" size={18} color="#065F46" />
          <Text style={styles.alertSuccessText}>{successBanner}</Text>
          <TouchableOpacity onPress={() => setSuccessBanner(null)}>
            <Ionicons name="close" size={16} color="#065F46" />
          </TouchableOpacity>
        </View>
      )}

      {/* DAILY METRICS BAR */}
      <View style={styles.metricsBar}>
        <View style={styles.metricItem}>
          <Text style={styles.metricVal}>{partner.completedJobs}</Text>
          <Text style={styles.metricLabel}>Total Jobs</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricVal, { color: '#059669' }]}>
            {currencyFormatter(partner.walletBalance)}
          </Text>
          <Text style={styles.metricLabel}>Wallet Balance</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.metricVal}>{partner.rating}</Text>
          </View>
          <Text style={styles.metricLabel}>Rating</Text>
        </View>
      </View>

      {/* SECTION 1: ACTIVE ONGOING JOB */}
      {activeJob ? (
        <View style={styles.activeJobContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.pulseActiveDot} />
            <Text style={styles.sectionTitle}>
              {activeJob.status === 'in_progress' ? '⚡ Job In-Progress' : '📍 Assigned Active Job'}
            </Text>
            <View
              style={[
                styles.activeStatusTag,
                {
                  backgroundColor:
                    activeJob.status === 'in_progress' ? '#D1FAE5' : '#DBEAFE',
                },
              ]}
            >
              <Text
                style={[
                  styles.activeStatusTagText,
                  {
                    color:
                      activeJob.status === 'in_progress' ? '#065F46' : '#1E40AF',
                  },
                ]}
              >
                {activeJob.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.activeJobCard}>
            {/* Top row: Order # & Scheduled Time */}
            <View style={styles.jobCardTop}>
              <View>
                <Text style={styles.orderNum}>{activeJob.bookingNumber}</Text>
                <Text style={styles.orderSlot}>
                  Slot: {activeJob.scheduledDate} ({activeJob.scheduledSlot})
                </Text>
              </View>
              <View style={styles.payoutBadge}>
                <Text style={styles.payoutLabel}>Total Payout</Text>
                <Text style={styles.payoutAmount}>{currencyFormatter(activeJob.finalAmount)}</Text>
              </View>
            </View>

            {/* Customer Details Box */}
            <View style={styles.customerBox}>
              <View style={styles.customerHeaderRow}>
                <Ionicons name="person-circle" size={32} color={THEME.colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.customerName}>{activeJob.customerName}</Text>
                  <Text style={styles.customerPhone}>{activeJob.customerPhone}</Text>
                </View>
                <View style={styles.callIconBtn}>
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.addressBox}>
                <Ionicons name="navigate" size={16} color="#4F46E5" />
                <Text style={styles.addressText}>
                  {activeJob.customerAddress.street}, {activeJob.customerAddress.city} -{' '}
                  {activeJob.customerAddress.pincode}
                </Text>
              </View>

              {activeJob.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>Note: {activeJob.notes}</Text>
                </View>
              )}
            </View>

            {/* Services inside this job */}
            <View style={styles.servicesInJob}>
              <Text style={styles.servicesInJobTitle}>Services to perform:</Text>
              {activeJob.items.map((it, idx) => (
                <View key={idx} style={styles.srvItemRow}>
                  <Ionicons name="checkmark-done" size={14} color="#10B981" />
                  <Text style={styles.srvItemName}>
                    {it.quantity}x {it.name}
                  </Text>
                  <Text style={styles.srvItemPrice}>{currencyFormatter(it.price * it.quantity)}</Text>
                </View>
              ))}
            </View>

            {/* OTP VERIFICATION ACTIONS */}
            <View style={styles.actionContainer}>
              {activeJob.status === 'assigned' && (
                <TouchableOpacity
                  onPress={() => {
                    setEnteredOtp('');
                    setOtpError(null);
                    setOtpModalMode('start');
                  }}
                  style={styles.startJobActionBtn}
                  activeOpacity={0.88}
                >
                  <Ionicons name="key" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Arrived on Site (Verify Start OTP)</Text>
                </TouchableOpacity>
              )}

              {activeJob.status === 'in_progress' && (
                <TouchableOpacity
                  onPress={() => {
                    setEnteredOtp('');
                    setOtpError(null);
                    setOtpModalMode('end');
                  }}
                  style={styles.completeJobActionBtn}
                  activeOpacity={0.88}
                >
                  <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Complete Job (Verify End OTP)</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : null}

      {/* SECTION 2: NEW JOB REQUESTS BOARD */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="radio" size={18} color="#3B82F6" />
          <Text style={styles.sectionTitle}>
            Incoming Job Requests ({incomingRequests.length})
          </Text>
        </View>

        {incomingRequests.length === 0 ? (
          <View style={styles.noRequestsCard}>
            <Ionicons name="sparkles" size={28} color="#94A3B8" />
            <Text style={styles.noRequestsTitle}>No pending jobs in your area</Text>
            <Text style={styles.noRequestsSub}>
              New customer orders placed from the Customer Portal will instantly appear here with live alert chime.
            </Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {incomingRequests.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestCardTop}>
                  <View>
                    <View style={styles.reqBadgeRow}>
                      <Text style={styles.requestNumber}>{req.bookingNumber}</Text>
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    </View>
                    <Text style={styles.requestSlot}>
                      {req.scheduledDate} • {req.scheduledSlot}
                    </Text>
                  </View>

                  <View style={styles.requestPriceWrap}>
                    <Text style={styles.requestPriceLabel}>Partner Earnings</Text>
                    <Text style={styles.requestPriceValue}>
                      {currencyFormatter(Math.round(req.finalAmount * (1 - partner.commissionRate / 100)))}
                    </Text>
                    <Text style={styles.commissionSub}>
                      After {partner.commissionRate}% comm.
                    </Text>
                  </View>
                </View>

                {/* Items preview */}
                <View style={styles.requestItemsBox}>
                  {req.items.map((it, idx) => (
                    <Text key={idx} style={styles.requestItemText}>
                      • {it.quantity}x {it.name}
                    </Text>
                  ))}
                </View>

                <View style={styles.reqLocRow}>
                  <Ionicons name="location" size={14} color="#64748B" />
                  <Text style={styles.reqLocText} numberOfLines={1}>
                    {req.customerAddress.city} - {req.customerAddress.pincode} ({req.customerAddress.street})
                  </Text>
                </View>

                {/* ACCEPT CTA */}
                <TouchableOpacity
                  onPress={() => partnerAcceptJob(req.id, partner.id)}
                  style={styles.acceptJobBtn}
                  activeOpacity={0.85}
                >
                  <Ionicons name="flash" size={16} color="#FFFFFF" />
                  <Text style={styles.acceptJobText}>Accept Job Instantly</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 120 }} />

      {/* OTP MODAL */}
      <Modal
        visible={!!otpModalMode}
        transparent
        animationType="fade"
        onRequestClose={() => setOtpModalMode(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons
                  name={otpModalMode === 'start' ? 'key' : 'checkmark-done'}
                  size={20}
                  color="#4F46E5"
                />
              </View>
              <Text style={styles.modalTitle}>
                {otpModalMode === 'start' ? 'Enter Customer Start OTP' : 'Enter Customer End OTP'}
              </Text>
              <TouchableOpacity onPress={() => setOtpModalMode(null)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalDesc}>
                {otpModalMode === 'start'
                  ? 'Ask the customer for the 4-digit Start OTP visible on their booking screen before commencing service.'
                  : 'Verify the 4-digit End OTP after the customer inspects and signs off on the completed work.'}
              </Text>

              {/* Hint badge showing what OTP is for easy pairing in testing */}
              {activeJob && (
                <View style={styles.testHintBadge}>
                  <Ionicons name="information-circle" size={14} color="#3B82F6" />
                  <Text style={styles.testHintText}>
                    (Test Hint: {"Customer's"} {otpModalMode === 'start' ? 'Start' : 'End'} OTP is{' '}
                    <Text style={{ fontWeight: '900' }}>
                      {otpModalMode === 'start' ? activeJob.startOtp : activeJob.endOtp}
                    </Text>
                    )
                  </Text>
                </View>
              )}

              <TextInput
                value={enteredOtp}
                onChangeText={setEnteredOtp}
                placeholder="4-Digit OTP"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={4}
                style={styles.otpInput}
                autoFocus
              />

              {otpError && <Text style={styles.otpErrorMsg}>{otpError}</Text>}

              <TouchableOpacity
                onPress={
                  otpModalMode === 'start' ? handleStartJobSubmit : handleCompleteJobSubmit
                }
                style={styles.modalSubmitBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSubmitBtnText}>
                  {otpModalMode === 'start' ? 'Verify & Begin Work' : 'Verify & Collect Earnings'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
  dutyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  dutyBannerOnline: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  dutyBannerOffline: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  dutyBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dutyIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dutyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  dutySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  goOnlineBtn: {
    backgroundColor: THEME.colors.partnerPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  goOnlineText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  alertSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  alertSuccessText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    ...THEME.shadows.subtle,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  activeJobContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pulseActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  activeStatusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeStatusTagText: {
    fontSize: 10,
    fontWeight: '900',
  },
  activeJobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    ...THEME.shadows.card,
  },
  jobCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  orderSlot: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  payoutBadge: {
    alignItems: 'flex-end',
  },
  payoutLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  payoutAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#059669',
  },
  customerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  customerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerPhone: {
    fontSize: 12,
    color: '#64748B',
  },
  callIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  addressText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 16,
  },
  notesBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  servicesInJob: {
    marginBottom: 16,
    gap: 6,
  },
  servicesInJobTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 2,
  },
  srvItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  srvItemName: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1,
  },
  srvItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionContainer: {
    marginTop: 6,
  },
  startJobActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    ...THEME.shadows.subtle,
  },
  completeJobActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    ...THEME.shadows.subtle,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  sectionContainer: {
    marginTop: 8,
  },
  noRequestsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noRequestsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  noRequestsSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  requestCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reqBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  newBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  requestSlot: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  requestPriceWrap: {
    alignItems: 'flex-end',
  },
  requestPriceLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  requestPriceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
  commissionSub: {
    fontSize: 9,
    color: '#94A3B8',
  },
  requestItemsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    gap: 4,
  },
  requestItemText: {
    fontSize: 12,
    color: '#334155',
  },
  reqLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  reqLocText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  acceptJobBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.partnerPrimary,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  acceptJobText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
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
    maxWidth: 440,
    width: '100%',
    ...THEME.shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    gap: 14,
  },
  modalDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  testHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  testHintText: {
    fontSize: 12,
    color: '#1E40AF',
  },
  otpInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 12,
    height: 56,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 10,
    textAlign: 'center',
    color: '#0F172A',
  },
  otpErrorMsg: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
