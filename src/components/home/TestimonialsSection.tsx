import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TESTIMONIALS } from '../../data/mockEcosystemData';
import { THEME } from '../../constants/theme';

const TESTIMONIAL_EXTRA: Record<string, { timeAgo: string }> = {
  'test-1': { timeAgo: '2 days ago' },
  'test-2': { timeAgo: '4 days ago' },
  'test-3': { timeAgo: '1 week ago' },
};

export default function TestimonialsSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [hoveredTestimonialId, setHoveredTestimonialId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.testimonialHeaderPill}>
            <Ionicons name="shield-checkmark" size={12} color="#059669" />
            <Text style={styles.testimonialHeaderPillText}>VERIFIED REVIEWS</Text>
          </View>
          <Text style={styles.sectionTitle}>What Our Customers Say</Text>
          <Text style={styles.sectionSub}>Real reviews from verified completed orders</Text>
        </View>

        <View style={styles.ratingSummaryBadge}>
          <View style={styles.ratingSummaryScoreRow}>
            <Ionicons name="star" size={17} color="#F59E0B" />
            <Text style={styles.ratingSummaryScore}>4.9</Text>
            <Text style={styles.ratingSummaryOutOf}>/ 5</Text>
          </View>
          <View style={styles.ratingSummaryDivider} />
          <View>
            <Text style={styles.ratingSummaryTotal}>14,800+ Ratings</Text>
            <Text style={styles.ratingSummarySub}>98.4% 5-Star Experience</Text>
          </View>
        </View>
      </View>

      <View style={styles.testimonialsGrid}>
        {TESTIMONIALS.map((t) => {
          const extra = TESTIMONIAL_EXTRA[t.id] || { timeAgo: 'Recently' };
          const isHovered = hoveredTestimonialId === t.id;
          return (
            <Pressable
              key={t.id}
              onHoverIn={() => setHoveredTestimonialId(t.id)}
              onHoverOut={() => setHoveredTestimonialId(null)}
              style={[
                styles.testimonialCard,
                isDesktop
                  ? styles.testimonialCardDesktop
                  : width < 640
                  ? styles.testimonialCardMobile
                  : styles.testimonialCardTablet,
                isHovered && styles.testimonialCardHovered,
              ]}
            >
              {/* Top Row: Stars, Score & Verified Badge */}
              <View style={styles.testimonialTopRow}>
                <View style={styles.testimonialRatingWrap}>
                  <View style={styles.testimonialStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons key={s} name="star" size={15} color="#F59E0B" />
                    ))}
                  </View>
                  <Text style={styles.testimonialScoreText}>5.0</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={11} color="#059669" />
                  <Text style={styles.verifiedBadgeText}>Verified Booking</Text>
                </View>
              </View>

              {/* Testimonial Quote */}
              <View style={styles.testimonialBody}>
                <Text style={styles.testimonialQuoteMark}>“</Text>
                <Text style={styles.testimonialComment}>{t.comment}</Text>
              </View>

              {/* Booked Service Pill */}
              {t.service ? (
                <View style={styles.testimonialServiceTag}>
                  <Ionicons name="checkmark-circle-outline" size={13} color="#059669" />
                  <Text style={styles.testimonialServiceText} numberOfLines={1}>
                    Booked: {t.service}
                  </Text>
                </View>
              ) : null}

              {/* Divider Line */}
              <View style={styles.testimonialDivider} />

              {/* Customer Profile & Recency */}
              <View style={styles.testimonialUserRow}>
                <View style={styles.testimonialUserLeft}>
                  <View style={styles.testimonialAvatarWrap}>
                    <Image source={{ uri: t.avatar }} style={styles.testimonialAvatar} />
                    <View style={styles.testimonialAvatarBadge}>
                      <Ionicons name="checkmark" size={8} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.testimonialUserInfo}>
                    <Text style={styles.testimonialName}>{t.name}</Text>
                    <Text style={styles.testimonialRole} numberOfLines={1}>
                      {t.role}
                    </Text>
                  </View>
                </View>
                <Text style={styles.testimonialTimeAgo}>{extra.timeAgo}</Text>
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
  testimonialHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  testimonialHeaderPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  ratingSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingSummaryScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingSummaryScore: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 2,
  },
  ratingSummaryOutOf: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  ratingSummaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  ratingSummaryTotal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  ratingSummarySub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  testimonialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    cursor: 'default',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    justifyContent: 'space-between',
  } as any,
  testimonialCardHovered: {
    borderColor: '#CBD5E1',
    transform: [{ translateY: -4 }],
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 4,
  },
  testimonialCardDesktop: {
    width: '31.8%',
  },
  testimonialCardTablet: {
    width: '48.5%',
  },
  testimonialCardMobile: {
    width: '100%',
  },
  testimonialTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  testimonialRatingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialScoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  testimonialBody: {
    position: 'relative',
    marginBottom: 12,
  },
  testimonialQuoteMark: {
    fontSize: 32,
    lineHeight: 28,
    fontWeight: '800',
    color: '#CBD5E1',
    marginBottom: 2,
  },
  testimonialComment: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '400',
  },
  testimonialServiceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  testimonialServiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flexShrink: 1,
  },
  testimonialDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 14,
  },
  testimonialUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testimonialUserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  testimonialAvatarWrap: {
    position: 'relative',
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#E2E8F0',
  },
  testimonialAvatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#059669',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialUserInfo: {
    flex: 1,
    minWidth: 0,
  },
  testimonialName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  testimonialRole: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  testimonialTimeAgo: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginLeft: 8,
    flexShrink: 0,
  },
});

