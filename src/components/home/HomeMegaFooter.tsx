import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';

export default function HomeMegaFooter() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const router = useRouter();

  return (
    <View style={styles.footerWrapper}>
      <View style={styles.footerInner}>
        {/* Top Trust Ribbon Bar */}
        <View style={[styles.footerRibbon, isDesktop ? styles.footerRibbonDesktop : styles.footerRibbonMobile]}>
          {[
            { icon: 'shield-checkmark', title: '100% Verified Techs', desc: 'UIDAI & Police Cleared' },
            { icon: 'ribbon-outline', title: '30-Day Guarantee', desc: 'Free Re-visit Protection' },
            { icon: 'cash-outline', title: 'Fixed Transparent Rates', desc: 'Zero Hidden Charges' },
            { icon: 'headset-outline', title: '24/7 Priority Support', desc: 'Instant Helpline & Chat' },
          ].map((rib, idx) => (
            <View key={idx} style={styles.footerRibbonItem}>
              <View style={styles.footerRibbonIconWrap}>
                <Ionicons name={rib.icon as any} size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.footerRibbonTitle}>{rib.title}</Text>
                <Text style={styles.footerRibbonDesc}>{rib.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Main Footer Multi-Column Grid */}
        <View style={[styles.footerGrid, isDesktop ? styles.footerGridDesktop : styles.footerGridMobile]}>
          {/* Column 1: Brand Logo, Mission & Contact */}
          <View style={[styles.footerCol, styles.footerColBrand]}>
            <View style={styles.footerLogoRow}>
              <View style={styles.footerLogoBadge}>
                <Ionicons name="construct" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.footerLogoText}>Servicewala</Text>
            </View>
            <Text style={styles.footerBrandDesc}>
              India’s leading on-demand home & gadget maintenance platform. Connecting households with background-verified professionals for hassle-free doorstep care.
            </Text>

            <View style={styles.footerContactList}>
              <View style={styles.footerContactItem}>
                <Ionicons name="call-outline" size={15} color="#10B981" />
                <Text style={styles.footerContactText}>1800 200 4567 (Toll-Free, 8 AM - 10 PM)</Text>
              </View>
              <View style={styles.footerContactItem}>
                <Ionicons name="mail-outline" size={15} color="#38BDF8" />
                <Text style={styles.footerContactText}>support@servicewala.com</Text>
              </View>
              <View style={styles.footerContactItem}>
                <Ionicons name="location-outline" size={15} color="#FBBF24" />
                <Text style={styles.footerContactText}>Serving 50+ Cities Across India</Text>
              </View>
            </View>
          </View>

          {/* Column 2: Popular Services Links */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Popular Services</Text>
            {[
              { label: 'Power Jet AC Servicing', catId: 'ac-repair' },
              { label: 'Laptop & MacBook Repair', catId: 'gadgets-repair' },
              { label: 'Desktop PC & Motherboard Fix', catId: 'gadgets-repair' },
              { label: 'Laser Printer & Toner Refill', catId: 'gadgets-repair' },
              { label: 'Kitchen Chimney Deep Clean', catId: 'appliances-repair' },
              { label: 'Water Purifier RO Filter Fix', catId: 'appliances-repair' },
              { label: 'Home Deep Cleaning & Scrub', catId: 'cleaning' },
            ].map((link, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => router.push(`/(customer)/category/${link.catId}` as any)}
                style={styles.footerLinkItem}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={12} color="#64748B" />
                <Text style={styles.footerLinkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Column 3: Trust & Company Links */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Company & Trust</Text>
            {[
              'About Servicewala',
              'How It Works',
              '30-Day Guarantee Policy',
              'Safety & Police Screening',
              'Customer Reviews & Testimonials',
              'Privacy Policy & Terms of Service',
              'Customer Grievance Redressal',
            ].map((item, idx) => (
              <View key={idx} style={styles.footerLinkItem}>
                <Ionicons name="chevron-forward" size={12} color="#64748B" />
                <Text style={styles.footerLinkText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Column 4: Ecosystem Portals & Partners */}
          <View style={styles.footerCol}>
            <Text style={styles.footerColHeading}>Ecosystem & Portals</Text>

            <TouchableOpacity
              onPress={() => router.push('/(partner)')}
              style={styles.footerPortalCard}
              activeOpacity={0.85}
            >
              <View style={styles.footerPortalCardIconWrap}>
                <Ionicons name="briefcase-outline" size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.footerPortalCardTitle}>Technician Partner Portal</Text>
                <Text style={styles.footerPortalCardSub}>Login & Manage Live Job Feed</Text>
              </View>
              <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(admin)')}
              style={styles.footerPortalCard}
              activeOpacity={0.85}
            >
              <View style={[styles.footerPortalCardIconWrap, { backgroundColor: 'rgba(153, 27, 27, 0.15)' }]}>
                <Ionicons name="stats-chart-outline" size={18} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.footerPortalCardTitle}>Admin Operations Control</Text>
                <Text style={styles.footerPortalCardSub}>Dispatch, Fleet & Revenue KPIs</Text>
              </View>
              <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.footerAppBadgeRow}>
              <Ionicons name="shield-checkmark" size={13} color="#10B981" />
              <Text style={styles.footerAppBadgeText}>
                ISO 9001:2015 Certified Service Standards
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Copyright & Legal Strip */}
        <View style={[styles.footerBottomBar, isDesktop ? styles.footerBottomBarDesktop : styles.footerBottomBarMobile]}>
          <Text style={styles.footerCopyrightText}>
            © 2026 Servicewala Technologies Pvt. Ltd. All rights reserved.
          </Text>
          <View style={styles.footerBottomRight}>
            <Text style={styles.footerCraftedText}>
              Proudly Built with <Ionicons name="heart" size={12} color="#EF4444" /> for Homes Across India
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#0A0F1D',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 48,
    paddingBottom: 32,
    marginTop: 48,
  },
  footerInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
  },
  footerRibbon: {
    gap: 16,
    paddingBottom: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 40,
  },
  footerRibbonDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRibbonMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  footerRibbonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerRibbonIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRibbonTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  footerRibbonDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  footerGrid: {
    gap: 32,
  },
  footerGridDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerGridMobile: {
    flexDirection: 'column',
  },
  footerCol: {
    flex: 1,
    minWidth: 200,
  },
  footerColBrand: {
    flex: 1.3,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  footerLogoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  footerBrandDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  footerContactList: {
    gap: 10,
  },
  footerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerContactText: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '500',
  },
  footerColHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  footerLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
  },
  footerLinkText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  footerPortalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
    marginBottom: 10,
  },
  footerPortalCardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPortalCardTitle: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  footerPortalCardSub: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 1,
  },
  footerAppBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
  },
  footerAppBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  footerBottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 24,
    marginTop: 48,
    gap: 12,
  },
  footerBottomBarDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBottomBarMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerCopyrightText: {
    color: '#64748B',
    fontSize: 12,
  },
  footerBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerCraftedText: {
    color: '#64748B',
    fontSize: 12,
  },
});

