import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore, PortalType } from '../store/useEcosystemStore';
import { THEME } from '../constants/theme';

export const PortalSwitcherBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const pathname = usePathname();

  const {
    setActivePortal,
    cart,
    orders,
    technicians,
    currentPartnerId,
    resetEcosystem,
  } = useEcosystemStore();

  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'requested').length;
  const currentPartner = technicians.find((t) => t.id === currentPartnerId) || technicians[0];

  const handlePortalSwitch = (portal: PortalType) => {
    setActivePortal(portal);
    if (portal === 'customer') {
      router.push('/(customer)');
    } else if (portal === 'partner') {
      router.push('/(partner)');
    } else if (portal === 'admin') {
      router.push('/(admin)');
    }
  };

  // Determine current portal based on path or state
  const currentActivePortal: PortalType = pathname.includes('(partner)')
    ? 'partner'
    : pathname.includes('(admin)')
    ? 'admin'
    : 'customer';

  if (isCollapsed) {
    return (
      <View style={styles.collapsedContainer}>
        <TouchableOpacity
          onPress={() => setIsCollapsed(false)}
          activeOpacity={0.8}
          style={styles.collapsedBadge}
        >
          <View style={styles.pulsingDot} />
          <Ionicons name="layers-outline" size={16} color="#FFFFFF" />
          <Text style={styles.collapsedBadgeText}>
            {currentActivePortal === 'customer'
              ? 'Customer View'
              : currentActivePortal === 'partner'
              ? 'Partner View'
              : 'Admin View'}
          </Text>
          <Ionicons name="chevron-up" size={14} color="#CBD5E1" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.barContainer, isDesktop ? styles.barDesktop : styles.barMobile]}>
        {/* Left Brand Indicator */}
        <View style={styles.leftBrand}>
          <View style={styles.brandIconWrap}>
            <Ionicons name="flash" size={16} color="#FBBF24" />
          </View>
          <View>
            <View style={styles.rowCenter}>
              <Text style={styles.brandName}>Servicewala</Text>
              <View style={styles.liveTag}>
                <Text style={styles.liveTagText}>LIVE SYNC</Text>
              </View>
            </View>
            <Text style={styles.brandSub}>Unified Multi-Portal Switcher</Text>
          </View>
        </View>

        {/* Portal Switch Tabs */}
        <View style={styles.tabsWrap}>
          {/* Portal 1: Customer */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePortalSwitch('customer')}
            style={[
              styles.portalTab,
              currentActivePortal === 'customer' && styles.portalTabActiveCustomer,
            ]}
          >
            <Ionicons
              name="globe-outline"
              size={16}
              color={currentActivePortal === 'customer' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.portalTabText,
                currentActivePortal === 'customer' && styles.portalTabTextActive,
              ]}
            >
              1. Customer Web/App
            </Text>
            {totalCartCount > 0 && (
              <View style={styles.badgeOrange}>
                <Text style={styles.badgeText}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Portal 2: Partner / Technician */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePortalSwitch('partner')}
            style={[
              styles.portalTab,
              currentActivePortal === 'partner' && styles.portalTabActivePartner,
            ]}
          >
            <Ionicons
              name="hammer-outline"
              size={16}
              color={currentActivePortal === 'partner' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.portalTabText,
                currentActivePortal === 'partner' && styles.portalTabTextActive,
              ]}
            >
              2. Technician App
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: currentPartner?.status === 'online' ? '#10B981' : '#EF4444' },
              ]}
            />
          </TouchableOpacity>

          {/* Portal 3: Super Admin */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePortalSwitch('admin')}
            style={[
              styles.portalTab,
              currentActivePortal === 'admin' && styles.portalTabActiveAdmin,
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={currentActivePortal === 'admin' ? '#FFFFFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.portalTabText,
                currentActivePortal === 'admin' && styles.portalTabTextActive,
              ]}
            >
              3. Super Admin
            </Text>
            {pendingOrdersCount > 0 && (
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>{pendingOrdersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Right Controls */}
        <View style={styles.rightControls}>
          {/* Quick Reset State */}
          <TouchableOpacity
            onPress={resetEcosystem}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <Ionicons name="refresh" size={14} color="#94A3B8" />
            {isDesktop && <Text style={styles.resetText}>Reset Data</Text>}
          </TouchableOpacity>

          {/* Collapse */}
          <TouchableOpacity
            onPress={() => setIsCollapsed(true)}
            activeOpacity={0.7}
            style={styles.collapseButton}
          >
            <Ionicons name="chevron-down" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    zIndex: 99999,
    alignItems: 'center',
    paddingHorizontal: 12,
    pointerEvents: 'box-none',
  },
  collapsedContainer: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    zIndex: 99999,
  },
  collapsedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...THEME.shadows.floating,
  },
  collapsedBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    ...THEME.shadows.floating,
  },
  barDesktop: {
    maxWidth: 1080,
    width: '94%',
  },
  barMobile: {
    width: '100%',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  leftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  brandSub: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
  },
  liveTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#10B981',
  },
  liveTagText: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '800',
  },
  tabsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  portalTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  portalTabActiveCustomer: {
    backgroundColor: THEME.colors.primary,
  },
  portalTabActivePartner: {
    backgroundColor: THEME.colors.partnerPrimary,
  },
  portalTabActiveAdmin: {
    backgroundColor: THEME.colors.adminAccent,
  },
  portalTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  portalTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badgeOrange: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeRed: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  resetText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  collapseButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
