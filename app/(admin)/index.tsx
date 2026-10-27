import React from 'react';
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
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function AdminAnalyticsOverview() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { orders, technicians, categories } = useEcosystemStore();

  // Metrics computation
  const totalGMV = orders.reduce((acc, o) => acc + o.finalAmount, 0);
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const activeOrders = orders.filter(
    (o) => o.status === 'requested' || o.status === 'assigned' || o.status === 'in_progress'
  );
  const pendingOrders = orders.filter((o) => o.status === 'requested');

  // Platform commission (15% avg)
  const totalCommission = Math.round(
    completedOrders.reduce((acc, o) => acc + o.finalAmount * 0.15, 0)
  );

  const onlineTechs = technicians.filter((t) => t.status === 'online' || t.status === 'busy');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* 4 KEY KPI CARDS */}
      <View style={styles.kpiGrid}>
        {/* Metric 1: Total Platform GMV */}
        <View style={[styles.kpiCard, isDesktop ? styles.kpiCardDesktop : styles.kpiCardMobile]}>
          <View style={styles.kpiTopRow}>
            <Text style={styles.kpiTitle}>TOTAL GMV REVENUE</Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="cash" size={20} color={THEME.colors.primary} />
            </View>
          </View>
          <Text style={styles.kpiValue}>{currencyFormatter(totalGMV)}</Text>
          <View style={styles.kpiTrendRow}>
            <Ionicons name="trending-up" size={14} color="#10B981" />
            <Text style={styles.kpiTrendText}>+24.6% vs last week</Text>
          </View>
        </View>

        {/* Metric 2: Active Bookings */}
        <View style={[styles.kpiCard, isDesktop ? styles.kpiCardDesktop : styles.kpiCardMobile]}>
          <View style={styles.kpiTopRow}>
            <Text style={styles.kpiTitle}>ACTIVE BOOKINGS</Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color="#D97706" />
            </View>
          </View>
          <Text style={styles.kpiValue}>{activeOrders.length}</Text>
          <View style={styles.kpiTrendRow}>
            <View
              style={[
                styles.kpiBadge,
                { backgroundColor: pendingOrders.length > 0 ? '#FEE2E2' : '#ECFDF5' },
              ]}
            >
              <Text
                style={[
                  styles.kpiBadgeText,
                  { color: pendingOrders.length > 0 ? '#B91C1C' : '#065F46' },
                ]}
              >
                {pendingOrders.length} Need Dispatch
              </Text>
            </View>
          </View>
        </View>

        {/* Metric 3: Platform Commission */}
        <View style={[styles.kpiCard, isDesktop ? styles.kpiCardDesktop : styles.kpiCardMobile]}>
          <View style={styles.kpiTopRow}>
            <Text style={styles.kpiTitle}>PLATFORM NET EARNED</Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="wallet" size={20} color="#059669" />
            </View>
          </View>
          <Text style={[styles.kpiValue, { color: '#059669' }]}>
            {currencyFormatter(totalCommission)}
          </Text>
          <View style={styles.kpiTrendRow}>
            <Text style={styles.kpiSubText}>Avg 15% platform take-rate</Text>
          </View>
        </View>

        {/* Metric 4: Active Technicians */}
        <View style={[styles.kpiCard, isDesktop ? styles.kpiCardDesktop : styles.kpiCardMobile]}>
          <View style={styles.kpiTopRow}>
            <Text style={styles.kpiTitle}>ONLINE PARTNERS</Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="people" size={20} color="#7C3AED" />
            </View>
          </View>
          <Text style={styles.kpiValue}>
            {onlineTechs.length} / {technicians.length}
          </Text>
          <View style={styles.kpiTrendRow}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.kpiSubText}>All 100% KYC verified</Text>
          </View>
        </View>
      </View>

      {/* QUICK ACTIONS BANNER */}
      <View style={styles.quickActionsCard}>
        <View style={styles.quickActionHeader}>
          <Ionicons name="flash" size={18} color="#F59E0B" />
          <Text style={styles.quickActionTitle}>Quick Dispatch & Ecosystem Actions</Text>
        </View>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            onPress={() => router.push('/(admin)/bookings')}
            style={styles.actionPillBtn}
          >
            <Ionicons name="clipboard" size={16} color="#FFFFFF" />
            <Text style={styles.actionPillBtnText}>Dispatch Board ({pendingOrders.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(admin)/services')}
            style={[styles.actionPillBtn, { backgroundColor: '#4F46E5' }]}
          >
            <Ionicons name="add-circle" size={16} color="#FFFFFF" />
            <Text style={styles.actionPillBtnText}>Add New Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(admin)/technicians')}
            style={[styles.actionPillBtn, { backgroundColor: '#059669' }]}
          >
            <Ionicons name="person-add" size={16} color="#FFFFFF" />
            <Text style={styles.actionPillBtnText}>Onboard Technician</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2-COLUMN SPLIT: RECENT ORDERS & LEADERBOARD */}
      <View style={[styles.splitGrid, isDesktop && styles.splitGridDesktop]}>
        {/* LEFT: LIVE ORDERS MONITOR */}
        <View style={styles.leftCol}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Live Orders Activity</Text>
              <Text style={styles.sectionSub}>Orders update instantly when customers book</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(admin)/bookings')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>Full Dispatch Board</Text>
              <Ionicons name="arrow-forward" size={14} color={THEME.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.ordersListWrap}>
            {orders.slice(0, 5).map((order) => {
              const tech = technicians.find((t) => t.id === order.assignedTechnicianId);
              return (
                <View key={order.id} style={styles.orderItemCard}>
                  <View style={styles.orderCardLeft}>
                    <View style={styles.orderRow1}>
                      <Text style={styles.orderNumberText}>{order.bookingNumber}</Text>
                      <View
                        style={[
                          styles.statusPill,
                          order.status === 'requested' && { backgroundColor: '#FEE2E2' },
                          order.status === 'assigned' && { backgroundColor: '#DBEAFE' },
                          order.status === 'in_progress' && { backgroundColor: '#FEF3C7' },
                          order.status === 'completed' && { backgroundColor: '#D1FAE5' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
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

                    <Text style={styles.customerLine}>
                      {order.customerName} • {order.items[0]?.name}{' '}
                      {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                    </Text>

                    <View style={styles.orderFooterInfo}>
                      <Ionicons name="location-outline" size={12} color="#64748B" />
                      <Text style={styles.orderLocText} numberOfLines={1}>
                        {order.customerAddress.city} ({order.customerAddress.pincode})
                      </Text>
                      <Text style={styles.dotDivider}>•</Text>
                      <Text style={styles.orderTechText}>
                        Pro: {tech ? tech.name : 'Unassigned'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderCardRight}>
                    <Text style={styles.orderAmountText}>
                      {currencyFormatter(order.finalAmount)}
                    </Text>
                    <Text style={styles.orderPayMethod}>
                      {order.paymentMethod === 'online' ? 'Paid Online' : 'COD'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* RIGHT: TOP TECHNICIANS & CATEGORY PERFORMANCE */}
        <View style={styles.rightCol}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Partner Fleet Leaders</Text>
              <Text style={styles.sectionSub}>Highest customer satisfaction</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(admin)/technicians')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>Manage All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.leadersList}>
            {technicians.slice(0, 4).map((tech, idx) => (
              <View key={tech.id} style={styles.leaderCard}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{idx + 1}</Text>
                </View>
                <Image source={{ uri: tech.avatar }} style={styles.leaderAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.leaderName}>{tech.name}</Text>
                  <Text style={styles.leaderSkill} numberOfLines={1}>
                    {tech.primarySkill}
                  </Text>
                </View>
                <View style={styles.leaderMetrics}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.leaderRating}>{tech.rating}</Text>
                  </View>
                  <Text style={styles.leaderJobs}>{tech.completedJobs} jobs</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Category Catalog Share */}
          <View style={styles.categoryShareBox}>
            <Text style={styles.catShareHeading}>Active Catalog Distribution</Text>
            {categories.map((c) => (
              <View key={c.id} style={styles.catShareRow}>
                <View style={styles.catShareLeft}>
                  <View style={[styles.catColorDot, { backgroundColor: c.tagColor }]} />
                  <Text style={styles.catShareName}>{c.name}</Text>
                </View>
                <Text style={styles.catShareCount}>{c.serviceCount} services</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ height: 120 }} />
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  kpiCardDesktop: {
    width: '23.8%',
  },
  kpiCardMobile: {
    width: '47.5%',
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  kpiTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kpiTrendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  kpiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  kpiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  kpiSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  quickActionsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    ...THEME.shadows.card,
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.adminAccent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  actionPillBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  splitGrid: {
    gap: 20,
  },
  splitGridDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 3,
  },
  rightCol: {
    flex: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  ordersListWrap: {
    gap: 10,
  },
  orderItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  orderCardLeft: {
    flex: 1,
  },
  orderRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  customerLine: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 6,
  },
  orderFooterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderLocText: {
    fontSize: 11,
    color: '#64748B',
    maxWidth: 160,
  },
  dotDivider: {
    color: '#CBD5E1',
  },
  orderTechText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
  },
  orderCardRight: {
    alignItems: 'flex-end',
    marginLeft: 14,
  },
  orderAmountText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  orderPayMethod: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  leadersList: {
    gap: 10,
    marginBottom: 20,
  },
  leaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...THEME.shadows.subtle,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  leaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  leaderName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  leaderSkill: {
    fontSize: 11,
    color: '#64748B',
  },
  leaderMetrics: {
    alignItems: 'flex-end',
  },
  leaderRating: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  leaderJobs: {
    fontSize: 10,
    color: '#64748B',
  },
  categoryShareBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...THEME.shadows.subtle,
  },
  catShareHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  catShareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catShareLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catShareName: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  catShareCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
});
