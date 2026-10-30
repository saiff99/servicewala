import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, currencyFormatter } from '../../constants/theme';
import { useEcosystemStore } from '../../store/useEcosystemStore';

export const QUICK_SERVICES_STRIP = [
  { id: 'laptop', label: 'Laptop & Mac', icon: 'laptop-outline', categoryId: 'gadgets-repair', query: 'laptop' },
  { id: 'desktop', label: 'Desktop PC', icon: 'desktop-outline', categoryId: 'gadgets-repair', query: 'desktop' },
  { id: 'printer', label: 'Printer Repair', icon: 'print-outline', categoryId: 'printer-repair', query: 'printer' },
  { id: 'ac', label: 'AC Service', icon: 'snow-outline', categoryId: 'ac-appliances', query: 'AC' },
  { id: 'refrigerator', label: 'Refrigerator', icon: 'cube-outline', categoryId: 'ac-appliances', query: 'refrigerator' },
  { id: 'washing', label: 'Washing Machine', icon: 'disc-outline', categoryId: 'ac-appliances', query: 'washing' },
  { id: 'geyser', label: 'Geyser', icon: 'flame-outline', categoryId: 'ac-appliances', query: 'geyser' },
  { id: 'chimney', label: 'Chimney', icon: 'funnel-outline', categoryId: 'ac-appliances', query: 'chimney' },
  { id: 'cooler', label: 'Air Cooler', icon: 'refresh-outline', categoryId: 'ac-appliances', query: 'cooler' },
  { id: 'cleaning', label: 'Home Cleaning', icon: 'sparkles-outline', categoryId: 'cleaning', query: 'clean' },
];

interface PopularServicesSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeQuickFilter: string | null;
  onClearFilter?: () => void;
}

export default function PopularServicesSection({
  searchQuery,
  setSearchQuery,
  activeQuickFilter,
  onClearFilter,
}: PopularServicesSectionProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const router = useRouter();
  const { categories, services, cart, addToCart, removeFromCart } = useEcosystemStore();
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    let result = services;
    if (activeQuickFilter) {
      const match = QUICK_SERVICES_STRIP.find((q) => q.id === activeQuickFilter);
      if (match?.categoryId) {
        result = result.filter((s) => s.categoryId === match.categoryId);
      } else if (match?.query) {
        const q = match.query.toLowerCase();
        result = result.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.tagline.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        );
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        const category = categories.find((c) => c.id === s.categoryId);
        return (
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.categoryId.toLowerCase().includes(q) ||
          (category && category.name.toLowerCase().includes(q))
        );
      });
    }
    return searchQuery.trim() || activeQuickFilter ? result : services.slice(0, 6);
  }, [services, categories, activeQuickFilter, searchQuery]);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim()
              ? `Search Results for "${searchQuery}" (${filteredServices.length})`
              : 'Most Booked Services'}
          </Text>
          <Text style={styles.sectionSub}>Transparent pricing with 30-day service warranty</Text>
        </View>
        {(searchQuery.trim().length > 0 || activeQuickFilter) && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              if (onClearFilter) onClearFilter();
            }}
            style={styles.clearFilterChip}
            activeOpacity={0.8}
          >
            <Text style={styles.clearFilterChipText}>Clear Filter ✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredServices.length === 0 ? (
        <View style={styles.emptySearchWrap}>
          <Ionicons name="search-outline" size={44} color="#CBD5E1" />
          <Text style={styles.emptySearchTitle}>
            {'No services found for "' + searchQuery + '"'}
          </Text>
          <Text style={styles.emptySearchSub}>
            {'Try searching for "Laptop Repair", "Desktop PC", "Printer", or "AC Service"'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              if (onClearFilter) onClearFilter();
            }}
            style={styles.emptySearchResetBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.emptySearchResetBtnText}>View All Services</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => {
            const qty = cart[service.id] || 0;
            const isHovered = hoveredServiceId === service.id;
            return (
              <Pressable
                key={service.id}
                onPress={() => router.push(`/(customer)/service/${service.id}`)}
                onHoverIn={() => setHoveredServiceId(service.id)}
                onHoverOut={() => setHoveredServiceId(null)}
                style={[
                  styles.serviceCard,
                  isDesktop ? styles.serviceCardDesktop : styles.serviceCardMobile,
                  isHovered && styles.serviceCardHovered,
                ]}
              >
                {/* ── IMAGE WRAPPER WITH FROSTED LUXURY BADGES ── */}
                <View style={styles.serviceImageContainer}>
                  <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />

                  {/* Gradient Vignette Scrim at Bottom of Image */}
                  <View style={styles.imageBottomGradient} />

                  {/* Top Floating Badges */}
                  <View style={styles.imageTopRow}>
                    {service.popularBadge ? (
                      <View style={styles.popularBadge}>
                        <Ionicons name="sparkles" size={10} color="#F59E0B" />
                        <Text style={styles.popularBadgeText}>
                          {service.popularBadge.toUpperCase()}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.verifiedProBadge}>
                        <Ionicons name="shield-checkmark" size={10} color="#10B981" />
                        <Text style={styles.verifiedProText}>VERIFIED PRO</Text>
                      </View>
                    )}

                    <View style={styles.durationPill}>
                      <Ionicons name="time-outline" size={11} color="#1E293B" />
                      <Text style={styles.durationPillText}>{service.duration}</Text>
                    </View>
                  </View>

                  {/* Bottom "View Details →" Quick Action Pill */}
                  <View
                    style={[
                      styles.viewDetailsBadge,
                      isHovered && styles.viewDetailsBadgeHovered,
                    ]}
                  >
                    <Text style={styles.viewDetailsBadgeText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={11} color="#FFFFFF" />
                  </View>
                </View>

                {/* ── CARD BODY ── */}
                <View style={styles.serviceBody}>
                  {/* Rating & Warranty Guarantee Row */}
                  <View style={styles.metaRow}>
                    <View style={styles.starWrap}>
                      <Ionicons name="star" size={11} color="#D97706" />
                      <Text style={styles.starText}>{service.rating.toFixed(2)}</Text>
                      <Text style={styles.reviewsCount}>({service.reviewCount})</Text>
                    </View>

                    <View style={styles.warrantyTag}>
                      <Ionicons name="shield-checkmark" size={11} color="#059669" />
                      <Text style={styles.warrantyTagText}>30-Day Warranty</Text>
                    </View>
                  </View>

                  {/* Service Title & Tagline */}
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {service.name}
                  </Text>
                  <Text style={styles.serviceTagline} numberOfLines={2}>
                    {service.tagline}
                  </Text>

                  {/* Included Highlights (2 key feature bullets) */}
                  <View style={styles.highlightsWrap}>
                    {service.includes &&
                      service.includes.slice(0, 2).map((inc, idx) => (
                        <View key={idx} style={styles.highlightItem}>
                          <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                          <Text style={styles.highlightText} numberOfLines={1}>
                            {inc}
                          </Text>
                        </View>
                      ))}
                  </View>

                  {/* Pricing and Cart Action Button */}
                  <View style={styles.serviceActionRow}>
                    <View style={styles.priceContainer}>
                      <View style={styles.priceRow}>
                        <Text style={styles.servicePrice}>{currencyFormatter(service.price)}</Text>
                        <Text style={styles.originalPrice}>
                          {currencyFormatter(service.originalPrice)}
                        </Text>
                      </View>
                      <View style={styles.savingsPill}>
                        <Text style={styles.savingsPillText}>
                          SAVE {currencyFormatter(service.originalPrice - service.price)}
                        </Text>
                      </View>
                    </View>

                    {qty > 0 ? (
                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            removeFromCart(service.id);
                          }}
                          style={styles.qtyBtn}
                          activeOpacity={0.8}
                          accessibilityLabel="Decrease quantity"
                        >
                          <Ionicons name="remove" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.qtyNumber}>{qty}</Text>
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            addToCart(service.id);
                          }}
                          style={styles.qtyBtn}
                          activeOpacity={0.8}
                          accessibilityLabel="Increase quantity"
                        >
                          <Ionicons name="add" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          addToCart(service.id);
                        }}
                        style={[
                          styles.addCartBtn,
                          isHovered && styles.addCartBtnHovered,
                        ]}
                        activeOpacity={0.88}
                        accessibilityLabel={`Add ${service.name} to cart`}
                      >
                        <Text
                          style={[
                            styles.addCartText,
                            isHovered && styles.addCartTextHovered,
                          ]}
                        >
                          Add
                        </Text>
                        <Ionicons
                          name="add"
                          size={15}
                          color={isHovered ? '#FFFFFF' : THEME.colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
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
  clearFilterChip: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    cursor: 'pointer',
  } as any,
  clearFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  emptySearchWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 44,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  emptySearchTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySearchSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
    maxWidth: 420,
  },
  emptySearchResetBtn: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    cursor: 'pointer',
  } as any,
  emptySearchResetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  serviceCardHovered: {
    borderColor: '#C7D2FE',
    transform: [{ translateY: -5 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 7,
  },
  serviceCardDesktop: {
    width: '31.8%',
  },
  serviceCardMobile: {
    width: '100%',
  },

  /* ── Image Presentation ── */
  serviceImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageBottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundImage:
      'linear-gradient(to top, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0) 100%)',
  } as any,
  imageTopRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.90)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
  } as any,
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  verifiedProBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
  } as any,
  verifiedProText: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  } as any,
  durationPillText: {
    color: '#0F172A',
    fontSize: 10.5,
    fontWeight: '700',
  },
  viewDetailsBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 3,
    transition: 'all 0.2s ease',
  } as any,
  viewDetailsBadgeHovered: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
    transform: [{ translateX: 2 }],
  } as any,
  viewDetailsBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* ── Card Body & Typography ── */
  serviceBody: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  starWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3.5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  reviewsCount: {
    fontSize: 10.5,
    color: '#78350F',
    fontWeight: '600',
  },
  warrantyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  warrantyTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  serviceTagline: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
    fontWeight: '500',
  },

  /* ── Key Highlights Checklist ── */
  highlightsWrap: {
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightText: {
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },

  /* ── Action & Pricing Row ── */
  serviceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceContainer: {
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  originalPrice: {
    fontSize: 12.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  savingsPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  savingsPillText: {
    fontSize: 9.5,
    color: '#15803D',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    transition: 'all 0.2s ease',
  } as any,
  addCartBtnHovered: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
    transform: [{ scale: 1.03 }],
  } as any,
  addCartText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  addCartTextHovered: {
    color: '#FFFFFF',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    padding: 3,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  qtyNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    paddingHorizontal: 6,
  },
});

