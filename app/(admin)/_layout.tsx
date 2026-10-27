import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Slot, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME } from '../../src/constants/theme';

export default function AdminLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { orders, technicians, services, resetEcosystem } = useEcosystemStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingBookingsCount = orders.filter((o) => o.status === 'requested').length;
  const onlineTechsCount = technicians.filter((t) => t.status === 'online').length;

  const navItems = [
    {
      label: 'Analytics & Overview',
      route: '/(admin)',
      icon: 'pie-chart-outline',
      activeIcon: 'pie-chart',
      badge: null,
    },
    {
      label: 'Services & Catalog',
      route: '/(admin)/services',
      icon: 'cube-outline',
      activeIcon: 'cube',
      badge: `${services.length}`,
    },
    {
      label: 'Live Order Dispatch',
      route: '/(admin)/bookings',
      icon: 'clipboard-outline',
      activeIcon: 'clipboard',
      badge: pendingBookingsCount > 0 ? `${pendingBookingsCount} New` : null,
      badgeColor: '#EF4444',
    },
    {
      label: 'Technician Fleet',
      route: '/(admin)/technicians',
      icon: 'people-outline',
      activeIcon: 'people',
      badge: `${onlineTechsCount} online`,
      badgeColor: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      {/* DESKTOP SIDEBAR */}
      {isDesktop ? (
        <View style={styles.sidebar}>
          {/* Admin Header */}
          <View style={styles.sidebarHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.sidebarBrand}>Servicewala</Text>
              <Text style={styles.sidebarRole}>SUPER ADMIN CONSOLE</Text>
            </View>
          </View>

          {/* Navigation Links */}
          <View style={styles.navMenu}>
            {navItems.map((item) => {
              const isActive =
                item.route === '/(admin)'
                  ? pathname === '/(admin)' || pathname === '/(admin)/'
                  : pathname.includes(item.route.replace('/(admin)/', ''));
              return (
                <TouchableOpacity
                  key={item.route}
                  onPress={() => router.push(item.route as any)}
                  style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={(isActive ? item.activeIcon : item.icon) as any}
                    size={18}
                    color={isActive ? '#FFFFFF' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.sidebarNavText,
                      isActive && styles.sidebarNavTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View
                      style={[
                        styles.navBadge,
                        { backgroundColor: item.badgeColor || 'rgba(255, 255, 255, 0.15)' },
                      ]}
                    >
                      <Text style={styles.navBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sidebar Footer Stats */}
          <View style={styles.sidebarFooter}>
            <View style={styles.pulseLiveRow}>
              <View style={styles.greenPulse} />
              <Text style={styles.liveSystemText}>Ecosystem Live Sync</Text>
            </View>
            <Text style={styles.sidebarStatsText}>
              {services.length} services • {technicians.length} partners • {orders.length} orders
            </Text>
            <TouchableOpacity onPress={resetEcosystem} style={styles.quickResetBtn}>
              <Ionicons name="refresh" size={13} color="#94A3B8" />
              <Text style={styles.quickResetText}>Restore Mock Defaults</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* MAIN CONTENT AREA */}
      <View style={styles.mainContent}>
        {/* TOP ADMIN BAR */}
        <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 12) }]}>
          <View style={styles.topHeaderInner}>
            {!isDesktop && (
              <TouchableOpacity
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={styles.mobileMenuToggle}
              >
                <Ionicons name={mobileMenuOpen ? 'close' : 'menu'} size={24} color="#0F172A" />
              </TouchableOpacity>
            )}

            <View style={styles.breadcrumbWrap}>
              <Text style={styles.adminTitle}>Super Admin Dashboard</Text>
              <Text style={styles.adminSubtitle}>
                Control services, assign technicians & track real-time marketplace revenue
              </Text>
            </View>

            <View style={styles.topHeaderRight}>
              <View style={styles.adminUserBadge}>
                <View style={styles.adminAvatar}>
                  <Text style={styles.adminAvatarText}>SA</Text>
                </View>
                {isDesktop && (
                  <View>
                    <Text style={styles.adminUserName}>Saif (Principal Admin)</Text>
                    <Text style={styles.adminUserEmail}>admin@servicewala.in</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* MOBILE EXPANDED MENU */}
          {!isDesktop && mobileMenuOpen && (
            <View style={styles.mobileNavDropdown}>
              {navItems.map((item) => {
                const isActive =
                  item.route === '/(admin)'
                    ? pathname === '/(admin)' || pathname === '/(admin)/'
                    : pathname.includes(item.route.replace('/(admin)/', ''));
                return (
                  <TouchableOpacity
                    key={item.route}
                    onPress={() => {
                      setMobileMenuOpen(false);
                      router.push(item.route as any);
                    }}
                    style={[
                      styles.mobileNavItem,
                      isActive && styles.mobileNavItemActive,
                    ]}
                  >
                    <Ionicons
                      name={(isActive ? item.activeIcon : item.icon) as any}
                      size={18}
                      color={isActive ? THEME.colors.primary : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.mobileNavText,
                        isActive && styles.mobileNavTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.badge && (
                      <View
                        style={[
                          styles.navBadge,
                          { backgroundColor: item.badgeColor || THEME.colors.primary },
                        ]}
                      >
                        <Text style={styles.navBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* PAGE BODY */}
        <View style={styles.bodyWrap}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#0F172A',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.colors.adminAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarBrand: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  sidebarRole: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A5B4FC',
    letterSpacing: 0.8,
  },
  navMenu: {
    flex: 1,
    marginTop: 20,
    gap: 6,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  sidebarNavItemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.adminAccent,
  },
  sidebarNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    flex: 1,
  },
  sidebarNavTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  navBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  sidebarFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  pulseLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  greenPulse: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  liveSystemText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
  },
  sidebarStatsText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 10,
  },
  quickResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  quickResetText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 24,
    paddingBottom: 14,
    ...THEME.shadows.subtle,
  },
  topHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mobileMenuToggle: {
    marginRight: 12,
  },
  breadcrumbWrap: {
    flex: 1,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  adminSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  adminUserBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adminAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.adminAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  adminUserName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  adminUserEmail: {
    fontSize: 10,
    color: '#64748B',
  },
  mobileNavDropdown: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 6,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
  },
  mobileNavItemActive: {
    backgroundColor: '#EEF2FF',
  },
  mobileNavText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  mobileNavTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  bodyWrap: {
    flex: 1,
  },
});
