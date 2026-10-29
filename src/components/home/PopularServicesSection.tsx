import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
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
  const { categories, services, cart, addToCart, removeFromCart } = useEcosystemStore();

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
            return (
              <View
                key={service.id}
                style={[
                  styles.serviceCard,
                  isDesktop ? styles.serviceCardDesktop : styles.serviceCardMobile,
                ]}
              >
                <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
                {service.popularBadge && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>{service.popularBadge}</Text>
                  </View>
                )}

                <View style={styles.serviceBody}>
                  <View style={styles.ratingRow}>
                    <View style={styles.starWrap}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.starText}>{service.rating}</Text>
                    </View>
                    <Text style={styles.reviewsCount}>({service.reviewCount} reviews)</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.durationText}>{service.duration}</Text>
                  </View>

                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceTagline} numberOfLines={2}>
                    {service.tagline}
                  </Text>

                  {/* Pricing and Cart Button */}
                  <View style={styles.serviceActionRow}>
                    <View>
                      <View style={styles.priceRow}>
                        <Text style={styles.servicePrice}>{currencyFormatter(service.price)}</Text>
                        <Text style={styles.originalPrice}>
                          {currencyFormatter(service.originalPrice)}
                        </Text>
                      </View>
                      <Text style={styles.savingsText}>
                        Save {currencyFormatter(service.originalPrice - service.price)}
                      </Text>
                    </View>

                    {qty > 0 ? (
                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          onPress={() => removeFromCart(service.id)}
                          style={styles.qtyBtn}
                        >
                          <Ionicons name="remove" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.qtyNumber}>{qty}</Text>
                        <TouchableOpacity
                          onPress={() => addToCart(service.id)}
                          style={styles.qtyBtn}
                        >
                          <Ionicons name="add" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => addToCart(service.id)}
                        style={styles.addCartBtn}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.addCartText}>Add</Text>
                        <Ionicons name="add" size={16} color={THEME.colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
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
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceCardDesktop: {
    width: '31.5%',
  },
  serviceCardMobile: {
    width: '100%',
  },
  serviceImage: {
    width: '100%',
    height: 160,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  serviceBody: {
    padding: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  starWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  starText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  reviewsCount: {
    fontSize: 11,
    color: '#64748B',
  },
  dotSeparator: {
    color: '#94A3B8',
  },
  durationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  serviceTagline: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  serviceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  servicePrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  originalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  savingsText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addCartText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    padding: 3,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    paddingHorizontal: 6,
  },
});

