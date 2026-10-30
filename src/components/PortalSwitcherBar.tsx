import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore, PortalType } from '../store/useEcosystemStore';
import { THEME } from '../constants/theme';

export const PortalSwitcherBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    setIsMenuOpen(false);
    if (portal === 'customer') {
      router.push('/(customer)');
    } else if (portal === 'partner') {
      router.push('/(partner)');
    } else if (portal === 'admin') {
      router.push('/(admin)');
    }
  };

  // Determine current portal based on path
  const currentActivePortal: PortalType = pathname.includes('(partner)')
    ? 'partner'
    : pathname.includes('(admin)')
    ? 'admin'
    : 'customer';

  return (
    <>
      {/* Outside Click Backdrop (Dismisses Menu) */}
      {isMenuOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsMenuOpen(false)}
          accessibilityLabel="Close portal menu"
        />
      )}

      {/* Floating Bottom-Left Container */}
      <View
        style={[
          styles.container,
          !isDesktop && styles.containerMobile,
        ]}
        pointerEvents="box-none"
      >
        {/* Flyout Menu Card (When Open) */}
        {isMenuOpen && (
          <View style={styles.flyoutCard}>
            {/* Header */}
            <View style={styles.flyoutHeader}>
              <View style={styles.flyoutHeaderLeft}>
                <View style={styles.brandIconWrap}>
                  <Ionicons name="flash" size={14} color="#FBBF24" />
                </View>
                <View>
                  <View style={styles.rowCenter}>
                    <Text style={styles.flyoutTitle}>Servicewala</Text>
                    <View style={styles.liveTag}>
                      <Text style={styles.liveTagText}>LIVE SYNC</Text>
                    </View>
                  </View>
                  <Text style={styles.flyoutSub}>Switch Portal Environment</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setIsMenuOpen(false)}
                style={styles.closeBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Portal Options List */}
            <View style={styles.portalList}>
              {/* Option 1: Customer Web/App */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePortalSwitch('customer')}
                style={[
                  styles.portalItem,
                  currentActivePortal === 'customer' && styles.portalItemActiveCustomer,
                ]}
              >
                <View style={[styles.portalIconWrap, { backgroundColor: 'rgba(79, 70, 229, 0.15)' }]}>
                  <Ionicons
                    name="globe-outline"
                    size={18}
                    color={currentActivePortal === 'customer' ? '#4F46E5' : '#818CF8'}
                  />
                </View>
                <View style={styles.portalInfo}>
                  <Text style={styles.portalName}>1. Customer Web/App</Text>
                  <Text style={styles.portalDesc}>Storefront, services catalog & cart</Text>
                </View>
                {totalCartCount > 0 && (
                  <View style={styles.badgeOrange}>
                    <Text style={styles.badgeText}>{totalCartCount}</Text>
                  </View>
                )}
                {currentActivePortal === 'customer' && (
                  <Ionicons name="checkmark-circle" size={18} color="#4F46E5" />
                )}
              </TouchableOpacity>

              {/* Option 2: Technician Partner App */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePortalSwitch('partner')}
                style={[
                  styles.portalItem,
                  currentActivePortal === 'partner' && styles.portalItemActivePartner,
                ]}
              >
                <View style={[styles.portalIconWrap, { backgroundColor: 'rgba(5, 150, 105, 0.15)' }]}>
                  <Ionicons
                    name="hammer-outline"
                    size={18}
                    color={currentActivePortal === 'partner' ? '#059669' : '#34D399'}
                  />
                </View>
                <View style={styles.portalInfo}>
                  <View style={styles.rowCenter}>
                    <Text style={styles.portalName}>2. Technician App</Text>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: currentPartner?.status === 'online' ? '#10B981' : '#EF4444' },
                      ]}
                    />
                  </View>
                  <Text style={styles.portalDesc}>Live job radar, earnings & OTP verify</Text>
                </View>
                {currentActivePortal === 'partner' && (
                  <Ionicons name="checkmark-circle" size={18} color="#059669" />
                )}
              </TouchableOpacity>

              {/* Option 3: Super Admin Operations */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePortalSwitch('admin')}
                style={[
                  styles.portalItem,
                  currentActivePortal === 'admin' && styles.portalItemActiveAdmin,
                ]}
              >
                <View style={[styles.portalIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={currentActivePortal === 'admin' ? '#EF4444' : '#F87171'}
                  />
                </View>
                <View style={styles.portalInfo}>
                  <Text style={styles.portalName}>3. Super Admin</Text>
                  <Text style={styles.portalDesc}>Live dispatch, GMV revenue & fleet</Text>
                </View>
                {pendingOrdersCount > 0 && (
                  <View style={styles.badgeRed}>
                    <Text style={styles.badgeText}>{pendingOrdersCount}</Text>
                  </View>
                )}
                {currentActivePortal === 'admin' && (
                  <Ionicons name="checkmark-circle" size={18} color="#EF4444" />
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Reset Action */}
            <View style={styles.flyoutFooter}>
              <TouchableOpacity
                onPress={() => {
                  resetEcosystem();
                  setIsMenuOpen(false);
                }}
                activeOpacity={0.8}
                style={styles.resetBtn}
              >
                <Ionicons name="refresh" size={13} color="#94A3B8" />
                <Text style={styles.resetBtnText}>Reset Ecosystem Demo Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Circular Floating Trigger Button (Bottom-Left) */}
        <TouchableOpacity
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          onPressIn={() => setIsHovered(true)}
          onPressOut={() => setIsHovered(false)}
          activeOpacity={0.85}
          style={[
            styles.circleTriggerBtn,
            isMenuOpen && styles.circleTriggerBtnActive,
            isHovered && styles.circleTriggerBtnHovered,
          ]}
          accessibilityLabel="Switch Portal Menu"
        >
          {isMenuOpen ? (
            <Ionicons name="close" size={20} color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="layers" size={20} color="#FFFFFF" />
              {/* Pulsing Green Status Beacon */}
              <View style={styles.beaconDot} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 99990,
  },
  container: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    bottom: 20,
    left: 20,
    zIndex: 99999,
    alignItems: 'flex-start',
  },
  containerMobile: {
    bottom: 80, // Sits above mobile bottom tab bar
    left: 16,
  },

  /* Circular FAB Button */
  circleTriggerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  circleTriggerBtnActive: {
    backgroundColor: '#1E293B',
    borderColor: '#64748B',
  },
  circleTriggerBtnHovered: {
    transform: [{ scale: 1.05 }],
    borderColor: '#10B981',
    shadowOpacity: 0.45,
  } as any,
  beaconDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },

  /* Flyout Menu Card */
  flyoutCard: {
    width: 310,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 12,
  },
  flyoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  flyoutHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flyoutTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  flyoutSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },
  liveTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#10B981',
  },
  liveTagText: {
    color: '#34D399',
    fontSize: 8.5,
    fontWeight: '800',
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Portal Options */
  portalList: {
    padding: 10,
    gap: 8,
  },
  portalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  portalItemActiveCustomer: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  portalItemActivePartner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  portalItemActiveAdmin: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  portalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalInfo: {
    flex: 1,
  },
  portalName: {
    color: '#0F172A',
    fontSize: 12.5,
    fontWeight: '700',
  },
  portalDesc: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 4,
  },
  badgeOrange: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeRed: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* Footer */
  flyoutFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 5,
  },
  resetBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
});
