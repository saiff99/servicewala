import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { BookingOrder } from '../../src/data/mockEcosystemData';
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function BookingsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { orders, technicians, setActivePortal, setCurrentPartnerId } = useEcosystemStore();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter(
    (o) => o.status === 'requested' || o.status === 'assigned' || o.status === 'in_progress'
  );
  const completedOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

  const getStatusBadge = (status: BookingOrder['status']) => {
    switch (status) {
      case 'requested':
        return { label: 'Finding Partner', bg: '#FEF3C7', color: '#B45309', icon: 'search' };
      case 'assigned':
        return { label: 'Partner Assigned', bg: '#DBEAFE', color: '#1E40AF', icon: 'person' };
      case 'in_progress':
        return { label: 'Work In Progress', bg: '#D1FAE5', color: '#065F46', icon: 'construct' };
      case 'completed':
        return { label: 'Service Completed', bg: '#ECFDF5', color: '#047857', icon: 'checkmark-circle' };
      case 'cancelled':
        return { label: 'Cancelled', bg: '#FEE2E2', color: '#B91C1C', icon: 'close-circle' };
    }
  };

  const getStepState = (currentStatus: BookingOrder['status'], stepIdx: number) => {
    // 0 = Requested, 1 = Assigned, 2 = In Progress, 3 = Completed
    const statusMap: Record<BookingOrder['status'], number> = {
      requested: 0,
      assigned: 1,
      in_progress: 2,
      completed: 3,
      cancelled: -1,
    };
    const currentIdx = statusMap[currentStatus];
    if (currentIdx === stepIdx) return 'active';
    if (currentIdx > stepIdx) return 'done';
    return 'pending';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* HEADER BANNER */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>My Bookings & Live Tracker</Text>
            <Text style={styles.headerSub}>
              Track technician arrival and secure verification OTP codes in real time
            </Text>
          </View>

          {/* TABS */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              onPress={() => setActiveTab('active')}
              style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, activeTab === 'active' && styles.tabBtnTextActive]}>
                Active ({activeOrders.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('history')}
              style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, activeTab === 'history' && styles.tabBtnTextActive]}>
                Past Completed ({completedOrders.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ORDERS LIST */}
      <View style={styles.ordersContainer}>
        {displayedOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>
              No {activeTab === 'active' ? 'active' : 'completed'} bookings
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === 'active'
                ? 'Your requested and ongoing home service bookings will appear here.'
                : 'You have not completed any bookings yet.'}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity
                onPress={() => router.push('/(customer)')}
                style={styles.bookNowBtn}
              >
                <Text style={styles.bookNowText}>Book a Service Now</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayedOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const technician = technicians.find((t) => t.id === order.assignedTechnicianId);

            return (
              <View
                key={order.id}
                style={[
                  styles.orderCard,
                  isDesktop && styles.orderCardDesktop,
                ]}
              >
                {/* Top Bar: Booking ID & Status */}
                <View style={styles.orderTopBar}>
                  <View style={styles.bookingIdWrap}>
                    <Text style={styles.bookingIdLabel}>Booking ID</Text>
                    <Text style={styles.bookingIdValue}>{order.bookingNumber}</Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={14} color={badge.color} />
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                  </View>
                </View>

                {/* TRACKER STEPPER */}
                <View style={styles.stepperContainer}>
                  {[
                    { label: 'Booking Placed', sub: 'Confirmed' },
                    { label: 'Pro Assigned', sub: technician ? technician.name : 'Finding Pro' },
                    { label: 'In Progress', sub: 'On-site execution' },
                    { label: 'Completed', sub: 'Inspected' },
                  ].map((step, idx) => {
                    const state = getStepState(order.status, idx);
                    return (
                      <View key={idx} style={styles.stepItem}>
                        <View style={styles.stepLineRow}>
                          <View
                            style={[
                              styles.stepDot,
                              state === 'active' && styles.stepDotActive,
                              state === 'done' && styles.stepDotDone,
                            ]}
                          >
                            {state === 'done' ? (
                              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                            ) : (
                              <Text
                                style={[
                                  styles.stepDotText,
                                  state === 'active' && styles.stepDotTextActive,
                                ]}
                              >
                                {idx + 1}
                              </Text>
                            )}
                          </View>
                          {idx < 3 && (
                            <View
                              style={[
                                styles.stepConnectingLine,
                                state === 'done' && styles.stepConnectingLineDone,
                              ]}
                            />
                          )}
                        </View>
                        <Text style={[styles.stepItemTitle, state !== 'pending' && styles.stepItemTitleActive]}>
                          {step.label}
                        </Text>
                        <Text style={styles.stepItemSub} numberOfLines={1}>
                          {step.sub}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* CONFIDENTIAL OTP CODES BOX (CRITICAL FOR USER REQUIREMENT) */}
                {(order.status === 'assigned' || order.status === 'in_progress') && (
                  <View style={styles.otpVaultBox}>
                    <View style={styles.vaultHeader}>
                      <Ionicons name="shield-checkmark" size={18} color="#4F46E5" />
                      <Text style={styles.vaultTitle}>CONFIDENTIAL VERIFICATION CODES</Text>
                    </View>

                    <View style={styles.otpCardsRow}>
                      {/* Start OTP */}
                      <View
                        style={[
                          styles.otpCard,
                          order.status === 'assigned' && styles.otpCardHighlight,
                        ]}
                      >
                        <View style={styles.otpLabelRow}>
                          <Text style={styles.otpTypeLabel}>START JOB OTP</Text>
                          {order.status === 'assigned' && (
                            <View style={styles.shareBadge}>
                              <Text style={styles.shareBadgeText}>Share Now</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.otpCodeValue}>{order.startOtp}</Text>
                        <Text style={styles.otpInstruction}>
                          Give to partner upon arrival at your door to start work.
                        </Text>
                      </View>

                      {/* End OTP */}
                      <View
                        style={[
                          styles.otpCard,
                          order.status === 'in_progress' && styles.otpCardHighlight,
                        ]}
                      >
                        <View style={styles.otpLabelRow}>
                          <Text style={styles.otpTypeLabel}>END JOB OTP</Text>
                          {order.status === 'in_progress' && (
                            <View style={styles.shareBadge}>
                              <Text style={styles.shareBadgeText}>Share When Done</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.otpCodeValue}>{order.endOtp}</Text>
                        <Text style={styles.otpInstruction}>
                          Give to partner ONLY after you are 100% satisfied with service.
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* ASSIGNED TECHNICIAN CARD */}
                {technician && (
                  <View style={styles.partnerInfoCard}>
                    <Image source={{ uri: technician.avatar }} style={styles.partnerAvatar} />
                    <View style={styles.partnerDetails}>
                      <View style={styles.partnerTitleRow}>
                        <Text style={styles.partnerName}>{technician.name}</Text>
                        <View style={styles.verifiedKycBadge}>
                          <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                          <Text style={styles.verifiedKycText}>KYC Verified</Text>
                        </View>
                      </View>
                      <Text style={styles.partnerSkill}>{technician.primarySkill}</Text>
                      <View style={styles.partnerMetaRow}>
                        <Ionicons name="star" size={13} color="#F59E0B" />
                        <Text style={styles.partnerRating}>{technician.rating} ★</Text>
                        <Text style={styles.partnerJobs}>({technician.completedJobs} jobs)</Text>
                        <Text style={styles.metaDivider}>•</Text>
                        <Text style={styles.partnerPhone}>{technician.phone}</Text>
                      </View>
                    </View>

                    {/* Quick Partner Switch CTA for demo */}
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentPartnerId(technician.id);
                        setActivePortal('partner');
                        router.push('/(partner)');
                      }}
                      style={styles.simulatePartnerBtn}
                    >
                      <Ionicons name="hammer" size={14} color="#059669" />
                      <Text style={styles.simulatePartnerText}>Open in Partner App</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* SCHEDULE & ADDRESS */}
                <View style={styles.slotAddressRow}>
                  <View style={styles.slotCol}>
                    <View style={styles.iconTextPair}>
                      <Ionicons name="time-outline" size={16} color="#64748B" />
                      <Text style={styles.slotText}>
                        {order.scheduledDate} ({order.scheduledSlot})
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addressCol}>
                    <View style={styles.iconTextPair}>
                      <Ionicons name="location-outline" size={16} color="#64748B" />
                      <Text style={styles.addressText} numberOfLines={2}>
                        {order.customerAddress.street}, {order.customerAddress.city} -{' '}
                        {order.customerAddress.pincode}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ORDER ITEMS & TOTAL */}
                <View style={styles.orderItemsSection}>
                  <Text style={styles.itemsHeading}>Booked Services:</Text>
                  {order.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.itemName}>
                        {item.quantity}x {item.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {currencyFormatter(item.price * item.quantity)}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.orderFooterRow}>
                    <View>
                      <Text style={styles.paymentMethodLabel}>
                        Payment: {order.paymentMethod === 'online' ? 'Online (Paid)' : 'Pay on Delivery'}
                      </Text>
                    </View>
                    <View style={styles.amountWrap}>
                      <Text style={styles.totalAmountLabel}>Total Paid:</Text>
                      <Text style={styles.totalAmountValue}>
                        {currencyFormatter(order.finalAmount)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrap: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerInner: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...THEME.shadows.subtle,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  ordersContainer: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 20,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: 20,
  },
  bookNowBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  orderCardDesktop: {
    padding: 24,
  },
  orderTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bookingIdWrap: {},
  bookingIdLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bookingIdValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  stepItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  stepLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: THEME.colors.primary,
  },
  stepDotDone: {
    backgroundColor: '#10B981',
  },
  stepDotText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  stepConnectingLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
  },
  stepConnectingLineDone: {
    backgroundColor: '#10B981',
  },
  stepItemTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  stepItemTitleActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  stepItemSub: {
    fontSize: 10,
    color: '#64748B',
    maxWidth: 90,
  },
  otpVaultBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    marginBottom: 20,
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  vaultTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  otpCardsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  otpCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  otpCardHighlight: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#EEF2FF',
  },
  otpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  otpTypeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  shareBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  shareBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  otpCodeValue: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#0F172A',
    marginVertical: 4,
  },
  otpInstruction: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  partnerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  partnerDetails: {
    flex: 1,
  },
  partnerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedKycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  verifiedKycText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  partnerSkill: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  partnerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partnerRating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  partnerJobs: {
    fontSize: 11,
    color: '#64748B',
  },
  metaDivider: {
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  partnerPhone: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  simulatePartnerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  simulatePartnerText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '800',
  },
  slotAddressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  slotCol: {
    flex: 1,
    minWidth: 200,
  },
  addressCol: {
    flex: 2,
    minWidth: 260,
  },
  iconTextPair: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  addressText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  orderItemsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
  },
  itemsHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  paymentMethodLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  totalAmountLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  totalAmountValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
});
