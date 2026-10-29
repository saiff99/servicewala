import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

const HOME_PROTECTION_PILLARS = [
  {
    id: 'damage-cover',
    title: '₹10,000 Property Damage Cover',
    subtitle: 'Zero Liability Guarantee',
    desc: 'In the rare event of accidental damage to your home appliance, wiring, or property during service, we cover repair or replacement up to ₹10,000.',
    tag: 'Instant Damage Cover',
    icon: 'shield-half-outline',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    id: 'verified-pros',
    title: '100% Background-Checked Pros',
    subtitle: 'UIDAI Biometric & Police Cleared',
    desc: 'Every technician undergoes government Aadhaar biometric verification and criminal background checks before being dispatched to your home.',
    tag: 'Govt ID Verified',
    icon: 'finger-print-outline',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    id: 'rapid-claim',
    title: '48-Hour Claim Settlement',
    subtitle: 'Hassle-Free Digital Resolution',
    desc: 'Simple in-app digital claim filing with direct photo upload. Dedicated resolution desk processes bank transfer reimbursement within 48 hours.',
    tag: 'Direct Bank Settlement',
    icon: 'flash-outline',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

export default function HomeProtectionCard() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [hoveredProtectionId, setHoveredProtectionId] = useState<string | null>(null);

  return (
    <View style={styles.protectionCard}>
      {/* Subtle Emerald Accent Top Line */}
      <View style={styles.protectionTopAccentBar} />

      {/* Header Row: Title, Badge & Shield Value Capsule */}
      <View
        style={[
          styles.protectionHeaderRow,
          isDesktop ? styles.protectionHeaderRowDesktop : styles.protectionHeaderRowMobile,
        ]}
      >
        <View style={styles.protectionHeaderLeft}>
          <View style={styles.protectionPill}>
            <Ionicons name="shield-checkmark" size={13} color="#059669" />
            <Text style={styles.protectionPillText}>ZERO LIABILITY • ₹10,000 PROTECTION COVER</Text>
          </View>
          <Text style={styles.protectionTitle}>Servicewala Home Protection Promise</Text>
          <Text style={styles.protectionSub}>
            Every doorstep booking automatically includes complimentary ₹10,000 property damage coverage and technician accountability at ₹0 extra cost to you.
          </Text>
        </View>

        {/* Protection Guarantee Emblem Capsule */}
        <View
          style={[
            styles.protectionEmblemBadge,
            isDesktop ? styles.protectionEmblemBadgeDesktop : styles.protectionEmblemBadgeMobile,
          ]}
        >
          <View style={styles.protectionEmblemIconWrap}>
            <Ionicons name="shield-checkmark" size={26} color="#059669" />
          </View>
          <View style={styles.protectionEmblemTexts}>
            <View style={styles.protectionEmblemAmountRow}>
              <Text style={styles.protectionEmblemAmount}>₹10,000</Text>
              <Text style={styles.protectionEmblemFreeTag}>FREE</Text>
            </View>
            <Text style={styles.protectionEmblemLabel}>DAMAGE & SAFETY COVER</Text>
          </View>
        </View>
      </View>

      {/* 3 Protection Pillars Grid */}
      <View style={styles.protectionPillarsGrid}>
        {HOME_PROTECTION_PILLARS.map((pillar) => {
          const isHovered = hoveredProtectionId === pillar.id;
          return (
            <Pressable
              key={pillar.id}
              onHoverIn={() => setHoveredProtectionId(pillar.id)}
              onHoverOut={() => setHoveredProtectionId(null)}
              style={[
                styles.protectionPillarCard,
                isDesktop
                  ? styles.protectionPillarCardDesktop
                  : width < 680
                  ? styles.protectionPillarCardMobile
                  : styles.protectionPillarCardTablet,
                isHovered && styles.protectionPillarCardHovered,
              ]}
            >
              <View style={styles.protectionPillarTopRow}>
                <View style={[styles.protectionPillarIconWrap, { backgroundColor: pillar.bg }]}>
                  <Ionicons name={pillar.icon as any} size={22} color={pillar.color} />
                </View>
                <View style={[styles.protectionPillarTag, { backgroundColor: pillar.bg }]}>
                  <Text style={[styles.protectionPillarTagText, { color: pillar.color }]}>
                    {pillar.tag}
                  </Text>
                </View>
              </View>

              <Text style={styles.protectionPillarTitle}>{pillar.title}</Text>
              <Text style={styles.protectionPillarSubtitle}>{pillar.subtitle}</Text>
              <Text style={styles.protectionPillarDesc}>{pillar.desc}</Text>

              <View style={styles.protectionPillarFooter}>
                <Ionicons name="checkmark-circle" size={14} color={pillar.color} />
                <Text style={[styles.protectionPillarFooterText, { color: pillar.color }]}>
                  Included in every booking
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Assurance Ribbon */}
      <View
        style={[
          styles.protectionBottomRibbon,
          isDesktop ? styles.protectionBottomRibbonDesktop : styles.protectionBottomRibbonMobile,
        ]}
      >
        <View style={styles.protectionBottomLeft}>
          <Ionicons name="checkmark-done-circle" size={18} color="#059669" />
          <Text style={styles.protectionBottomText}>
            Activated automatically with every confirmed booking • Valid across all 50+ service cities in India • Zero deductible
          </Text>
        </View>
        <View style={styles.protectionBottomRight}>
          <View style={styles.protectionPolicyBadge}>
            <Ionicons name="lock-closed" size={12} color="#047857" />
            <Text style={styles.protectionPolicyText}>100% FINANCIAL PEACE OF MIND</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  protectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    padding: 26,
    marginTop: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  protectionTopAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#10B981',
  },
  protectionHeaderRow: {
    gap: 16,
    marginBottom: 20,
  },
  protectionHeaderRowDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protectionHeaderRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  protectionHeaderLeft: {
    flex: 1,
    maxWidth: 720,
  },
  protectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  protectionPillText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  protectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  protectionSub: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },
  protectionEmblemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  protectionEmblemBadgeDesktop: {
    alignSelf: 'center',
  },
  protectionEmblemBadgeMobile: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  protectionEmblemIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  protectionEmblemTexts: {
    justifyContent: 'center',
  },
  protectionEmblemAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  protectionEmblemAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#047857',
    letterSpacing: -0.5,
  },
  protectionEmblemFreeTag: {
    backgroundColor: '#059669',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    letterSpacing: 0.4,
    overflow: 'hidden',
  },
  protectionEmblemLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.6,
    marginTop: 1,
  },
  protectionPillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  protectionPillarCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 20,
    justifyContent: 'space-between',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  protectionPillarCardDesktop: {
    flex: 1,
    minWidth: 260,
  },
  protectionPillarCardTablet: {
    width: '100%',
  },
  protectionPillarCardMobile: {
    width: '100%',
  },
  protectionPillarCardHovered: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
    transform: [{ translateY: -3 }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  } as any,
  protectionPillarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  protectionPillarIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protectionPillarTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  protectionPillarTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  protectionPillarTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  protectionPillarSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  protectionPillarDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19.5,
    marginBottom: 16,
    flex: 1,
  },
  protectionPillarFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  protectionPillarFooterText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  protectionBottomRibbon: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  protectionBottomRibbonDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protectionBottomRibbonMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  protectionBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  protectionBottomText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 17,
  },
  protectionBottomRight: {
    flexShrink: 0,
  },
  protectionPolicyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  protectionPolicyText: {
    color: '#047857',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

