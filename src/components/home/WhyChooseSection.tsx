import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import HomeProtectionCard from './HomeProtectionCard';

const WHY_CHOOSE_ITEMS = [
  {
    id: 'verified',
    title: '100% Verified Experts',
    badge: 'BACKGROUND CHECKED',
    desc: 'Every technician undergoes strict biometric UIDAI verification, local police clearance, and in-person practical skill tests before doorstep dispatch.',
    bullet: 'UIDAI & Police Cleared',
    icon: 'shield-checkmark',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669',
  },
  {
    id: 'pricing',
    title: 'Upfront Fixed Pricing',
    badge: 'NO HIDDEN FEES',
    desc: 'Standardized upfront rate cards with zero surprise charges. You know the exact cost before work begins and pay conveniently after completion.',
    bullet: 'Pay After Service Done',
    icon: 'receipt-outline',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    badgeBg: '#EFF6FF',
    badgeColor: '#2563EB',
  },
  {
    id: 'warranty',
    title: '30-Day Service Guarantee',
    badge: 'FREE RE-VISIT',
    desc: 'Complete peace of mind. If any serviced appliance faces an issue within 30 days, our senior expert revisits and resolves it at zero additional cost.',
    bullet: '100% Free Re-work Cover',
    icon: 'ribbon-outline',
    iconColor: '#991B1B',
    iconBg: '#FEF2F2',
    badgeBg: '#FEF2F2',
    badgeColor: '#991B1B',
  },
  {
    id: 'parts',
    title: 'Genuine OEM Spare Parts',
    badge: '100% AUTHENTIC',
    desc: 'Direct manufacturer partnerships ensure authentic replacement parts with official brand warranty for all 22+ leading appliance and gadget brands.',
    bullet: 'Brand Warranty Included',
    icon: 'cube-outline',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    badgeBg: '#FFFBEB',
    badgeColor: '#D97706',
  },
];

export default function WhyChooseSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [hoveredTrustId, setHoveredTrustId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.trustHeaderPill}>
            <Ionicons name="sparkles" size={12} color="#991B1B" />
            <Text style={styles.trustHeaderPillText}>THE SERVICEWALA PROMISE</Text>
          </View>
          <Text style={styles.sectionTitle}>Why Choose Servicewala?</Text>
          <Text style={styles.sectionSub}>
            India’s trusted doorstep maintenance network built on safety, upfront pricing, and guaranteed craftsmanship
          </Text>
        </View>
      </View>

      <View style={styles.whyChooseGrid}>
        {WHY_CHOOSE_ITEMS.map((item) => {
          const isHovered = hoveredTrustId === item.id;
          return (
            <Pressable
              key={item.id}
              onHoverIn={() => setHoveredTrustId(item.id)}
              onHoverOut={() => setHoveredTrustId(null)}
              style={[
                styles.whyChooseCard,
                isDesktop
                  ? styles.whyChooseCardDesktop
                  : width < 640
                  ? styles.whyChooseCardMobile
                  : styles.whyChooseCardTablet,
                isHovered && styles.whyChooseCardHovered,
              ]}
            >
              {/* Top Row: Icon Container & Micro Badge */}
              <View style={styles.whyChooseTopRow}>
                <View style={[styles.whyChooseIconWrap, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                </View>
                <View style={[styles.whyChooseBadge, { backgroundColor: item.badgeBg }]}>
                  <Text style={[styles.whyChooseBadgeText, { color: item.badgeColor }]}>
                    {item.badge}
                  </Text>
                </View>
              </View>

              {/* Title & Description */}
              <Text style={styles.whyChooseTitle}>{item.title}</Text>
              <Text style={styles.whyChooseDesc}>{item.desc}</Text>

              {/* Bottom Assurance Micro-Bullet */}
              <View style={styles.whyChooseBottomWrap}>
                <Ionicons name="checkmark-circle" size={14} color={item.iconColor} />
                <Text style={[styles.whyChooseBulletText, { color: item.iconColor }]}>
                  {item.bullet}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ─── Servicewala Home Protection Promise Shield Card (₹10,000 Cover) ─── */}
      <HomeProtectionCard />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    marginTop: 36,
  },
  sectionHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  trustHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  trustHeaderPillText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  whyChooseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  whyChooseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  whyChooseCardDesktop: {
    flex: 1,
    minWidth: 240,
  },
  whyChooseCardTablet: {
    width: '48.5%',
  },
  whyChooseCardMobile: {
    width: '100%',
  },
  whyChooseCardHovered: {
    borderColor: '#CBD5E1',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
    transform: [{ translateY: -4 }],
  } as any,
  whyChooseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  whyChooseIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyChooseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  whyChooseBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  whyChooseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  whyChooseDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 16,
    flex: 1,
  },
  whyChooseBottomWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  whyChooseBulletText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

