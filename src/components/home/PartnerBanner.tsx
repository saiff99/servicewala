import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';

export default function PartnerBanner() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const router = useRouter();

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.partnerBannerCard}>
        {/* Subtle Ambient Radial Glow on Web */}
        {Platform.OS === 'web' && <View style={styles.partnerBannerGlow} pointerEvents="none" />}

        <View
          style={[
            styles.partnerBannerContent,
            isDesktop ? styles.partnerBannerContentDesktop : styles.partnerBannerContentMobile,
          ]}
        >
          {/* Left Column: Headline, Details & Key Perks */}
          <View style={styles.partnerBannerLeft}>
            <View style={styles.partnerBannerBadge}>
              <Ionicons name="briefcase" size={13} color="#10B981" />
              <Text style={styles.partnerBannerBadgeText}>EXPAND YOUR BUSINESS WITH SERVICEWALA</Text>
            </View>

            <Text style={styles.partnerBannerTitle}>
              Earn Up to ₹45,000+ Every Month as a Verified Technician
            </Text>

            <Text style={styles.partnerBannerDesc}>
              Join thousands of certified AC technicians, electricians, plumbers, and laptop repair specialists. Get daily guaranteed doorstep orders, instant weekly bank payouts, and ₹2 Lakh tooling insurance.
            </Text>

            {/* Perks Pills Grid */}
            <View style={styles.partnerPerksGrid}>
              {[
                { icon: 'shield-checkmark', text: 'Zero Onboarding Fee', color: '#10B981' },
                { icon: 'cash-outline', text: 'Instant Weekly Payouts', color: '#38BDF8' },
                { icon: 'trending-up-outline', text: 'Daily Guaranteed Leads', color: '#FBBF24' },
                { icon: 'umbrella-outline', text: '₹2 Lakh Tooling Cover', color: '#A78BFA' },
              ].map((perk, idx) => (
                <View key={idx} style={styles.partnerPerkPill}>
                  <Ionicons name={perk.icon as any} size={14} color={perk.color} />
                  <Text style={styles.partnerPerkText}>{perk.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right Column: Earnings Highlight Card & Action Button */}
          <View
            style={[
              styles.partnerBannerRight,
              isDesktop ? styles.partnerBannerRightDesktop : styles.partnerBannerRightMobile,
            ]}
          >
            <View style={styles.partnerEarningCard}>
              <View style={styles.partnerEarningTop}>
                <Text style={styles.partnerEarningLabel}>AVERAGE MONTHLY INCOME</Text>
                <Text style={styles.partnerEarningAmount}>
                  ₹42,800<Text style={styles.partnerEarningMonth}>/mo</Text>
                </Text>
                <View style={styles.partnerRatingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.partnerRatingScore}>4.9/5</Text>
                  <Text style={styles.partnerRatingCount}>(8,400+ Active Partners)</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(partner)')}
                style={styles.partnerCtaBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.partnerCtaBtnText}>Join as a Partner</Text>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" />
              </TouchableOpacity>

              <Text style={styles.partnerInstantApproval}>
                ⚡ Instant Digital KYC • Start Earning in 24 Hours
              </Text>
            </View>
          </View>
        </View>
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
    marginTop: 48,
  },
  partnerBannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 36,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  partnerBannerGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
  } as any,
  partnerBannerContent: {
    gap: 36,
  },
  partnerBannerContentDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerBannerContentMobile: {
    flexDirection: 'column',
  },
  partnerBannerLeft: {
    flex: 1,
  },
  partnerBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  partnerBannerBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  partnerBannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 12,
  },
  partnerBannerDesc: {
    fontSize: 14.5,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 620,
  },
  partnerPerksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  partnerPerkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  partnerPerkText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  partnerBannerRight: {
    alignItems: 'center',
  },
  partnerBannerRightDesktop: {
    width: 340,
  },
  partnerBannerRightMobile: {
    width: '100%',
  },
  partnerEarningCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
  },
  partnerEarningTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  partnerEarningLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  partnerEarningAmount: {
    color: '#10B981',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  partnerEarningMonth: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  partnerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  partnerRatingScore: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  partnerRatingCount: {
    color: '#94A3B8',
    fontSize: 12,
  },
  partnerCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  partnerCtaBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  partnerInstantApproval: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});

