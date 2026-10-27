import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Slot, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME } from '../../src/constants/theme';

export default function PartnerLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const {
    currentPartnerId,
    technicians,
    orders,
    toggleTechnicianDuty,
  } = useEcosystemStore();

  const partner = technicians.find((t) => t.id === currentPartnerId) || technicians[0];
  const isOnline = partner?.status === 'online';

  // Count incoming requested jobs
  const newJobsCount = orders.filter((o) => o.status === 'requested').length;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.mainWrapper, isDesktop && styles.mainWrapperDesktop]}>
        {/* PARTNER HEADER */}
        <View style={[styles.partnerHeader, { paddingTop: Math.max(insets.top, 14) }]}>
          <View style={styles.partnerHeaderInner}>
            {/* Left: Avatar, Name & Tech Switcher */}
            <View style={styles.partnerInfoRow}>
              <Image source={{ uri: partner.avatar }} style={styles.partnerAvatar} />
              <View>
                <View style={styles.nameRow}>
                  <Text style={styles.partnerName}>{partner.name}</Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                  </View>
                </View>
                <Text style={styles.partnerSkill} numberOfLines={1}>
                  {partner.primarySkill}
                </Text>
              </View>
            </View>

            {/* Right: Duty Toggle (Online / Offline) */}
            <TouchableOpacity
              onPress={() => toggleTechnicianDuty(partner.id)}
              activeOpacity={0.8}
              style={[
                styles.dutyToggleBtn,
                isOnline ? styles.dutyToggleOnline : styles.dutyToggleOffline,
              ]}
            >
              <View
                style={[
                  styles.dutyDot,
                  { backgroundColor: isOnline ? '#10B981' : '#EF4444' },
                ]}
              />
              <Text
                style={[
                  styles.dutyToggleText,
                  { color: isOnline ? '#065F46' : '#991B1B' },
                ]}
              >
                {isOnline ? 'ON DUTY' : 'OFFLINE'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <Slot />
        </View>

        {/* BOTTOM NAVIGATION TABS (MOBILE-FIRST) */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TouchableOpacity
            onPress={() => router.push('/(partner)')}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <View>
              <Ionicons
                name={
                  pathname === '/(partner)' || pathname === '/(partner)/'
                    ? 'briefcase'
                    : 'briefcase-outline'
                }
                size={22}
                color={
                  pathname === '/(partner)' || pathname === '/(partner)/'
                    ? THEME.colors.partnerPrimary
                    : '#64748B'
                }
              />
              {newJobsCount > 0 && (
                <View style={styles.newJobBadge}>
                  <Text style={styles.newJobBadgeText}>{newJobsCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                (pathname === '/(partner)' || pathname === '/(partner)/') &&
                  styles.tabLabelActive,
              ]}
            >
              Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(partner)/earnings')}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name={pathname.includes('earnings') ? 'wallet' : 'wallet-outline'}
              size={22}
              color={
                pathname.includes('earnings') ? THEME.colors.partnerPrimary : '#64748B'
              }
            />
            <Text
              style={[
                styles.tabLabel,
                pathname.includes('earnings') && styles.tabLabelActive,
              ]}
            >
              Wallet (₹{partner.walletBalance})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(partner)/profile')}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name={pathname.includes('profile') ? 'person' : 'person-outline'}
              size={22}
              color={
                pathname.includes('profile') ? THEME.colors.partnerPrimary : '#64748B'
              }
            />
            <Text
              style={[
                styles.tabLabel,
                pathname.includes('profile') && styles.tabLabelActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Sleek dark backing for partner mobile simulation
    alignItems: 'center',
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8FAFC',
  },
  mainWrapperDesktop: {
    maxWidth: 520, // Mobile-first handheld layout simulation on desktop
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#334155',
    ...THEME.shadows.modal,
  },
  partnerHeader: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  partnerHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  partnerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 2,
    borderRadius: 4,
  },
  partnerSkill: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
    maxWidth: 180,
  },
  dutyToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  dutyToggleOnline: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  dutyToggleOffline: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  dutyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dutyToggleText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  contentArea: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    ...THEME.shadows.subtle,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: THEME.colors.partnerPrimary,
    fontWeight: '800',
  },
  newJobBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  newJobBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
});
