import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Select Service & Slot',
    subtitle: 'Transparent Pricing & Instant Booking',
    desc: 'Browse our specialized catalog, pick your gadget or appliance repair, and select your preferred doorstep time slot with transparent upfront pricing.',
    tag: 'Instant Confirmation',
    icon: 'calendar-outline',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    step: '02',
    title: 'Doorstep Expert Arrival',
    subtitle: 'OTP Verified & Equipped Pro',
    desc: 'A background-checked, certified technician arrives punctually at your address in uniform with modern diagnostic tools and authentic OEM spare parts.',
    tag: 'Track & Secure OTP',
    icon: 'construct-outline',
    color: '#991B1B',
    bg: '#FEF2F2',
  },
  {
    step: '03',
    title: 'Inspect, Pay & Relax',
    subtitle: 'Post-Service Payment & Warranty',
    desc: 'Inspect the completed work, pay effortlessly via UPI, Card, or Cash, and enjoy our 30-day hassle-free doorstep re-visit service warranty.',
    tag: '30-Day Guarantee',
    icon: 'shield-checkmark-outline',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

export default function HowItWorksSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.howItWorksHeaderPill}>
            <Ionicons name="flash-outline" size={12} color="#059669" />
            <Text style={styles.howItWorksHeaderPillText}>EFFORTLESS 3-STEP PROCESS</Text>
          </View>
          <Text style={styles.sectionTitle}>How Servicewala Works</Text>
          <Text style={styles.sectionSub}>
            Book certified appliance and home repairs at your doorstep in 3 effortless steps
          </Text>
        </View>
      </View>

      <View style={styles.howItWorksGrid}>
        {HOW_IT_WORKS_STEPS.map((stepItem) => {
          const isHovered = hoveredStepId === stepItem.step;
          return (
            <Pressable
              key={stepItem.step}
              onHoverIn={() => setHoveredStepId(stepItem.step)}
              onHoverOut={() => setHoveredStepId(null)}
              style={[
                styles.howItWorksCard,
                isDesktop
                  ? styles.howItWorksCardDesktop
                  : width < 768
                  ? styles.howItWorksCardMobile
                  : styles.howItWorksCardTablet,
                isHovered && styles.howItWorksCardHovered,
              ]}
            >
              {/* Top Row: Number Badge & Service Icon */}
              <View style={styles.howItWorksTopRow}>
                <View style={styles.howItWorksNumberBadge}>
                  <Text style={styles.howItWorksNumberText}>{stepItem.step}</Text>
                </View>
                <View style={[styles.howItWorksIconWrap, { backgroundColor: stepItem.bg }]}>
                  <Ionicons name={stepItem.icon as any} size={22} color={stepItem.color} />
                </View>
              </View>

              {/* Subtitle / Step label */}
              <Text style={styles.howItWorksSubtitle}>{stepItem.subtitle}</Text>

              {/* Main Step Title */}
              <Text style={styles.howItWorksTitle}>{stepItem.title}</Text>

              {/* Step Description */}
              <Text style={styles.howItWorksDesc}>{stepItem.desc}</Text>

              {/* Bottom Assurance Tag */}
              <View style={styles.howItWorksBottomTag}>
                <Ionicons name="checkmark-circle" size={14} color={stepItem.color} />
                <Text style={[styles.howItWorksTagText, { color: stepItem.color }]}>
                  {stepItem.tag}
                </Text>
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
  howItWorksHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  howItWorksHeaderPillText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  howItWorksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
  } as any,
  howItWorksCardDesktop: {
    flex: 1,
    minWidth: 260,
  },
  howItWorksCardTablet: {
    width: '100%',
  },
  howItWorksCardMobile: {
    width: '100%',
  },
  howItWorksCardHovered: {
    borderColor: '#CBD5E1',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    transform: [{ translateY: -4 }],
  } as any,
  howItWorksTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  howItWorksNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  howItWorksNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  howItWorksIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howItWorksSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  howItWorksDesc: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 18,
    flex: 1,
  },
  howItWorksBottomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  howItWorksTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

