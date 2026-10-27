import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { BookingOrder } from '../../src/data/mockEcosystemData';
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function AdminBookingsBoard() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { orders, technicians, assignTechnician, updateOrderStatus } = useEcosystemStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Assign Modal
  const [assignModalOrder, setAssignModalOrder] = useState<BookingOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.customerAddress.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAssignSubmit = (technicianId: string) => {
    if (!assignModalOrder) return;
    assignTechnician(assignModalOrder.id, technicianId);
    setAssignModalOrder(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Live Order Dispatch Board</Text>
          <Text style={styles.headerSub}>
            Real-time fulfillment monitor • Assign technicians and inspect Start/End OTP codes
          </Text>
        </View>

        <View style={styles.headerStatsRow}>
          <View style={styles.statChipRed}>
            <Text style={styles.statChipRedText}>
              {orders.filter((o) => o.status === 'requested').length} Need Dispatch
            </Text>
          </View>
          <View style={styles.statChipBlue}>
            <Text style={styles.statChipBlueText}>
              {orders.filter((o) => o.status === 'in_progress').length} In Progress
            </Text>
          </View>
        </View>
      </View>

      {/* FILTER & SEARCH */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search booking #, customer, phone, location..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusPillsRow}>
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'requested', label: 'Unassigned', count: orders.filter((o) => o.status === 'requested').length },
            { id: 'assigned', label: 'Assigned', count: orders.filter((o) => o.status === 'assigned').length },
            { id: 'in_progress', label: 'In Progress', count: orders.filter((o) => o.status === 'in_progress').length },
            { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setStatusFilter(tab.id)}
              style={[
                styles.statusFilterPill,
                statusFilter === tab.id && styles.statusFilterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.statusFilterPillText,
                  statusFilter === tab.id && styles.statusFilterPillTextActive,
                ]}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ORDERS LIST */}
      <View style={styles.ordersList}>
        {filteredOrders.map((order) => {
          const assignedTech = technicians.find((t) => t.id === order.assignedTechnicianId);
          return (
            <View key={order.id} style={styles.dispatchCard}>
              <View style={styles.dispatchCardTop}>
                <View style={styles.idAndSlotWrap}>
                  <View style={styles.idRow}>
                    <Text style={styles.bookingNumber}>{order.bookingNumber}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        order.status === 'requested' && { backgroundColor: '#FEE2E2' },
                        order.status === 'assigned' && { backgroundColor: '#DBEAFE' },
                        order.status === 'in_progress' && { backgroundColor: '#FEF3C7' },
                        order.status === 'completed' && { backgroundColor: '#D1FAE5' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          order.status === 'requested' && { color: '#B91C1C' },
                          order.status === 'assigned' && { color: '#1E40AF' },
                          order.status === 'in_progress' && { color: '#B45309' },
                          order.status === 'completed' && { color: '#065F46' },
                        ]}
                      >
                        {order.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.slotTimeText}>
                    Slot: {order.scheduledDate} ({order.scheduledSlot})
                  </Text>
                </View>

                {/* OTP AUDITING BADGES */}
                <View style={styles.otpAuditingRow}>
                  <View style={styles.otpAuditingBox}>
                    <Text style={styles.otpAuditingLabel}>Start OTP</Text>
                    <Text style={styles.otpAuditingVal}>{order.startOtp}</Text>
                  </View>
                  <View style={styles.otpAuditingBox}>
                    <Text style={styles.otpAuditingLabel}>End OTP</Text>
                    <Text style={styles.otpAuditingVal}>{order.endOtp}</Text>
                  </View>
                </View>
              </View>

              {/* Customer & Location */}
              <View style={styles.customerRow}>
                <View style={styles.customerCol}>
                  <Text style={styles.customerName}>{order.customerName}</Text>
                  <Text style={styles.customerPhone}>{order.customerPhone}</Text>
                  <Text style={styles.customerAddr} numberOfLines={2}>
                    {order.customerAddress.street}, {order.customerAddress.city} -{' '}
                    {order.customerAddress.pincode}
                  </Text>
                </View>

                {/* Items & Billing */}
                <View style={styles.itemsCol}>
                  <Text style={styles.itemsLabel}>Order Items ({order.items.length}):</Text>
                  {order.items.map((it, idx) => (
                    <Text key={idx} style={styles.itemLine}>
                      • {it.quantity}x {it.name}
                    </Text>
                  ))}
                  <Text style={styles.orderTotalLine}>
                    Total: <Text style={{ fontWeight: '900' }}>{currencyFormatter(order.finalAmount)}</Text>{' '}
                    ({order.paymentMethod === 'online' ? 'Paid' : 'COD'})
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Technician Assignment Bar */}
              <View style={styles.dispatchActionFooter}>
                <View style={styles.techAssignedCol}>
                  {assignedTech ? (
                    <View style={styles.assignedTechWrap}>
                      <Image source={{ uri: assignedTech.avatar }} style={styles.assignedTechAvatar} />
                      <View>
                        <Text style={styles.assignedTechName}>{assignedTech.name}</Text>
                        <Text style={styles.assignedTechSkill}>{assignedTech.primarySkill}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.unassignedNotice}>
                      <Ionicons name="alert-circle" size={16} color="#DC2626" />
                      <Text style={styles.unassignedNoticeText}>No technician assigned yet</Text>
                    </View>
                  )}
                </View>

                {/* Dispatch Buttons */}
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    onPress={() => setAssignModalOrder(order)}
                    style={styles.reassignBtn}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="person-add" size={14} color="#FFFFFF" />
                    <Text style={styles.reassignBtnText}>
                      {assignedTech ? 'Reassign Pro' : 'Dispatch Pro'}
                    </Text>
                  </TouchableOpacity>

                  {/* Quick Status Override */}
                  <TouchableOpacity
                    onPress={() => {
                      const next =
                        order.status === 'requested'
                          ? 'assigned'
                          : order.status === 'assigned'
                          ? 'in_progress'
                          : order.status === 'in_progress'
                          ? 'completed'
                          : 'requested';
                      updateOrderStatus(order.id, next);
                    }}
                    style={styles.cycleStatusBtn}
                  >
                    <Text style={styles.cycleStatusText}>Change Status</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 120 }} />

      {/* DISPATCH / ASSIGN MODAL */}
      <Modal
        visible={!!assignModalOrder}
        transparent
        animationType="fade"
        onRequestClose={() => setAssignModalOrder(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDesktop ? styles.modalDesktop : styles.modalMobile]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Dispatch Technician</Text>
                <Text style={styles.modalSub}>
                  Booking: {assignModalOrder?.bookingNumber} • {assignModalOrder?.customerAddress.city}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAssignModalOrder(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.selectProHeading}>Available Technicians in Fleet:</Text>
              <View style={styles.techChoiceList}>
                {technicians.map((t) => {
                  const isCurrent = assignModalOrder?.assignedTechnicianId === t.id;
                  const isOnline = t.status === 'online';
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => handleAssignSubmit(t.id)}
                      style={[
                        styles.techChoiceCard,
                        isCurrent && styles.techChoiceCardCurrent,
                      ]}
                    >
                      <Image source={{ uri: t.avatar }} style={styles.techChoiceAvatar} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.techChoiceNameRow}>
                          <Text style={styles.techChoiceName}>{t.name}</Text>
                          <View
                            style={[
                              styles.dutyDotSmall,
                              { backgroundColor: isOnline ? '#10B981' : '#CBD5E1' },
                            ]}
                          />
                          <Text style={styles.dutyTextSmall}>{t.status}</Text>
                        </View>
                        <Text style={styles.techChoiceSkill}>{t.primarySkill}</Text>
                        <View style={styles.techChoiceMetaRow}>
                          <Ionicons name="star" size={11} color="#F59E0B" />
                          <Text style={styles.techChoiceRating}>{t.rating}</Text>
                          <Text style={styles.metaDivider}>•</Text>
                          <Text style={styles.techChoiceJobs}>{t.completedJobs} completed</Text>
                          <Text style={styles.metaDivider}>•</Text>
                          <Text style={styles.techChoiceComm}>{t.commissionRate}% comm.</Text>
                        </View>
                      </View>

                      <View style={styles.assignActionPill}>
                        <Text style={styles.assignActionPillText}>
                          {isCurrent ? 'Current' : 'Assign'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  contentWrap: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  headerStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statChipRed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statChipRedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B91C1C',
  },
  statChipBlue: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statChipBlueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
  filterSection: {
    gap: 12,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: 440,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  statusPillsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  statusFilterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusFilterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  statusFilterPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  statusFilterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  ordersList: {
    gap: 16,
  },
  dispatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  dispatchCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  idAndSlotWrap: {},
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  bookingNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  slotTimeText: {
    fontSize: 12,
    color: '#64748B',
  },
  otpAuditingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  otpAuditingBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  otpAuditingLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  otpAuditingVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 2,
  },
  customerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 14,
  },
  customerCol: {
    flex: 1,
    minWidth: 240,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerPhone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  customerAddr: {
    fontSize: 12,
    color: '#334155',
    marginTop: 4,
    lineHeight: 16,
  },
  itemsCol: {
    flex: 1,
    minWidth: 240,
  },
  itemsLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemLine: {
    fontSize: 12,
    color: '#1E293B',
    marginBottom: 2,
  },
  orderTotalLine: {
    fontSize: 13,
    color: '#0F172A',
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 14,
  },
  dispatchActionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  techAssignedCol: {
    flex: 1,
    minWidth: 200,
  },
  assignedTechWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assignedTechAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  assignedTechName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  assignedTechSkill: {
    fontSize: 11,
    color: '#64748B',
  },
  unassignedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unassignedNoticeText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reassignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  reassignBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cycleStatusBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cycleStatusText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '85%',
    ...THEME.shadows.modal,
  },
  modalDesktop: {
    width: 580,
  },
  modalMobile: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  selectProHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  techChoiceList: {
    gap: 10,
  },
  techChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  techChoiceCardCurrent: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#EEF2FF',
  },
  techChoiceAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  techChoiceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  techChoiceName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  dutyDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dutyTextSmall: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  techChoiceSkill: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  techChoiceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  techChoiceRating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaDivider: {
    color: '#CBD5E1',
    marginHorizontal: 2,
  },
  techChoiceJobs: {
    fontSize: 10,
    color: '#64748B',
  },
  techChoiceComm: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  assignActionPill: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  assignActionPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
