import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SPOTLIGHT_OFFERS } from '../../data/mockEcosystemData';
import { THEME } from '../../constants/theme';
import { useEcosystemStore } from '../../store/useEcosystemStore';

export default function SpotlightOffersStrip() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const router = useRouter();
  const { applyPromo } = useEcosystemStore();
  const [hoveredOfferId, setHoveredOfferId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Exclusive Seasonal Deals</Text>
          <Text style={styles.sectionSub}>Apply discount coupons right at checkout</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offersRow}
        style={styles.offersScroll}
      >
        {SPOTLIGHT_OFFERS.map((offer) => {
          const isHovered = hoveredOfferId === offer.id;
          return (
            <Pressable
              key={offer.id}
              onHoverIn={() => setHoveredOfferId(offer.id)}
              onHoverOut={() => setHoveredOfferId(null)}
              style={[
                styles.offerCard,
                isDesktop ? styles.offerCardDesktop : styles.offerCardMobile,
                isHovered && styles.offerCardHovered,
              ]}
            >
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>{offer.badge}</Text>
              </View>

              <Text style={styles.offerTitle} numberOfLines={1}>
                {offer.title}
              </Text>
              <Text style={styles.offerSub} numberOfLines={1}>
                {offer.subtitle}
              </Text>

              <View style={styles.offerBottomRow}>
                <View style={[styles.offerCodePill, isHovered && styles.offerCodePillHovered]}>
                  <Ionicons name="pricetag-outline" size={11} color="#0F172A" />
                  <Text style={styles.offerCodeText}>{offer.code}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    applyPromo(offer.code);
                    router.push('/(customer)/checkout');
                  }}
                  style={[styles.offerApplyBtn, isHovered && styles.offerApplyBtnHovered]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.offerApplyBtnText}>Use Deal</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color="#FFFFFF"
                    style={isHovered ? styles.offerArrowHovered : undefined}
                  />
                </TouchableOpacity>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
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
  offersScroll: {
    overflow: 'visible',
  },
  offersRow: {
    gap: 16,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 2,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  offerCardHovered: {
    transform: [{ translateY: -3 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 5,
  },
  offerCardDesktop: {
    width: 360,
  },
  offerCardMobile: {
    width: 290,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  offerBadgeText: {
    color: '#334155',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  offerSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  offerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    transition: 'all 0.2s ease',
  } as any,
  offerCodePillHovered: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  offerCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  offerApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    transition: 'all 0.2s ease',
  } as any,
  offerApplyBtnHovered: {
    backgroundColor: '#000000',
  },
  offerApplyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11.5,
  },
  offerArrowHovered: {
    transform: [{ translateX: 2 }],
  },
});

