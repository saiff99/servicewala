import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

const WHY_CHOOSE_ITEMS = [
  {
    id: 'verified',
    number: '01',
    title: '100% Verified Experts',
    badge: 'BACKGROUND CHECKED',
    desc: 'Every technician undergoes strict biometric UIDAI verification, local police clearance, and in-person practical skill tests before doorstep dispatch.',
    bullet: 'UIDAI & Police Cleared',
    icon: 'shield-checkmark',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.22)',
  },
  {
    id: 'pricing',
    number: '02',
    title: 'Upfront Fixed Pricing',
    badge: 'NO HIDDEN FEES',
    desc: 'Standardized upfront rate cards with zero surprise charges. You know the exact cost before work begins and pay conveniently after completion.',
    bullet: 'Pay After Service Done',
    icon: 'receipt-outline',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    badgeBg: '#EFF6FF',
    badgeColor: '#2563EB',
    glowColor: 'rgba(37, 99, 235, 0.22)',
  },
  {
    id: 'warranty',
    number: '03',
    title: '30-Day Service Guarantee',
    badge: 'FREE RE-VISIT',
    desc: 'Complete peace of mind. If any serviced appliance faces an issue within 30 days, our senior expert revisits and resolves it at zero additional cost.',
    bullet: '100% Free Re-work Cover',
    icon: 'ribbon-outline',
    iconColor: '#991B1B',
    iconBg: '#FEF2F2',
    badgeBg: '#FEF2F2',
    badgeColor: '#991B1B',
    glowColor: 'rgba(153, 27, 27, 0.22)',
  },
  {
    id: 'parts',
    number: '04',
    title: 'Genuine OEM Spare Parts',
    badge: '100% AUTHENTIC',
    desc: 'Direct manufacturer partnerships ensure authentic replacement parts with official brand warranty for all 22+ leading appliance and gadget brands.',
    bullet: 'Brand Warranty Included',
    icon: 'cube-outline',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    badgeBg: '#FFFBEB',
    badgeColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.22)',
  },
];

export default function WhyChooseSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [hoveredTrustId, setHoveredTrustId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeftBlock}>
          <View style={styles.trustHeaderPill}>
            <Ionicons name="sparkles" size={12} color="#991B1B" />
            <Text style={styles.trustHeaderPillText}>THE SERVICEWALA PROMISE</Text>
          </View>
          <Text style={styles.sectionTitle}>Why Choose Servicewala?</Text>
          <Text style={styles.sectionSub}>
            India’s trusted doorstep maintenance network built on safety, upfront pricing, and guaranteed craftsmanship
          </Text>
        </View>

        {isDesktop && (
          <View style={styles.headerTrustBadge}>
            <View style={styles.headerStarsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={13} color="#F59E0B" />
              ))}
            </View>
            <Text style={styles.headerTrustScore}>4.8 / 5 Rating</Text>
            <Text style={styles.headerTrustCount}>• 50,000+ Happy Homes</Text>
          </View>
        )}
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
                isHovered && [
                  styles.whyChooseCardHovered,
                  {
                    borderColor: item.iconColor,
                    ...(Platform.OS === 'web'
                      ? {
                          boxShadow: `0 20px 34px -8px ${item.glowColor}, 0 4px 12px rgba(15, 23, 42, 0.05)`,
                        }
                      : {}),
                  },
                ],
              ]}
            >
              {/* Top Dynamic Colored Accent Line */}
              <View
                style={[
                  styles.cardTopAccent,
                  {
                    backgroundColor: isHovered ? item.iconColor : `${item.iconColor}33`,
                  },
                ]}
              />

              <View style={styles.cardInnerPadding}>
                {/* Top Row: Icon Container & Micro Badge + Step Number */}
                <View style={styles.whyChooseTopRow}>
                  <View
                    style={[
                      styles.whyChooseIconWrap,
                      {
                        backgroundColor: item.iconBg,
                        borderColor: `${item.iconColor}30`,
                      },
                      isHovered && {
                        transform: [{ scale: 1.08 }],
                        backgroundColor: `${item.iconColor}18`,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                  </View>

                  <View style={styles.topRightWrap}>
                    <View style={[styles.whyChooseBadge, { backgroundColor: item.badgeBg }]}>
                      <Text style={[styles.whyChooseBadgeText, { color: item.badgeColor }]}>
                        {item.badge}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.cardNumberWatermark,
                        isHovered && { color: item.iconColor, opacity: 0.35 },
                      ]}
                    >
                      {item.number}
                    </Text>
                  </View>
                </View>

                {/* Title & Description */}
                <Text
                  style={[
                    styles.whyChooseTitle,
                    isHovered && { color: item.iconColor },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.whyChooseDesc}>{item.desc}</Text>

                {/* Bottom Assurance Micro-Bullet Seal */}
                <View
                  style={[
                    styles.whyChooseBottomWrap,
                    isHovered && {
                      backgroundColor: `${item.iconColor}10`,
                      borderColor: `${item.iconColor}35`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkCircle,
                      { backgroundColor: `${item.iconColor}20` },
                    ]}
                  >
                    <Ionicons name="checkmark" size={11} color={item.iconColor} />
                  </View>
                  <Text style={[styles.whyChooseBulletText, { color: item.iconColor }]}>
                    {item.bullet}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
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
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  headerLeftBlock: {
    flex: 1,
    minWidth: 280,
  },
  headerTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerTrustScore: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerTrustCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 20,
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
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
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
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
    transform: [{ translateY: -6 }],
  } as any,
  cardTopAccent: {
    height: 3.5,
    width: '100%',
    transition: 'background-color 0.25s ease',
  } as any,
  cardInnerPadding: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  whyChooseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  whyChooseIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  topRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whyChooseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  whyChooseBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardNumberWatermark: {
    fontSize: 18,
    fontWeight: '900',
    color: '#E2E8F0',
    letterSpacing: -0.5,
    transition: 'all 0.25s ease',
  } as any,
  whyChooseTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.2,
    transition: 'color 0.2s ease',
  } as any,
  whyChooseDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 18,
    flex: 1,
  },
  whyChooseBottomWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignSelf: 'flex-start',
    transition: 'all 0.22s ease',
  } as any,
  checkCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyChooseBulletText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});

