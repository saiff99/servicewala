import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../../src/store/useEcosystemStore';
import { ServiceItem } from '../../../src/data/mockEcosystemData';
import { THEME, currencyFormatter } from '../../../src/constants/theme';

function getCategoryIcon(iconName: string): any {
  switch (iconName) {
    case 'Snowflake':
      return 'snow-outline';
    case 'Sparkles':
      return 'sparkles-outline';
    case 'Wrench':
      return 'construct-outline';
    case 'Flower2':
      return 'flower-outline';
    case 'Scissors':
      return 'cut-outline';
    case 'Paintbrush':
      return 'color-palette-outline';
    case 'Laptop':
      return 'laptop-outline';
    case 'Print':
      return 'print-outline';
    default:
      return 'apps-outline';
  }
}

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { categories, services, cart, addToCart, removeFromCart } = useEcosystemStore();

  const currentCategory =
    categories.find((c) => c.id === id) || categories[0] || {
      id: 'ac-appliances',
      name: 'AC & Appliance Repair',
      shortDesc: 'Deep jet cleaning, servicing & gas refill',
      tagColor: '#3B82F6',
    };

  const categoryServices = services.filter((s) => s.categoryId === currentCategory.id);

  // Selected Service for Details Modal
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);

  // Cart totals
  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart).reduce((acc, [sId, qty]) => {
    const s = services.find((srv) => srv.id === sId);
    return acc + (s ? s.price * qty : 0);
  }, 0);

  return (
    <View style={styles.container}>
      {/* CATEGORY HEADER BANNER */}
      <View style={[styles.headerBanner, { borderLeftColor: currentCategory.tagColor }]}>
        <View style={styles.headerBannerInner}>
          <TouchableOpacity
            onPress={() => router.push('/(customer)')}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={15} color="#475569" />
            <Text style={styles.backBtnText}>All Categories</Text>
          </TouchableOpacity>
          <View style={styles.bannerTextWrap}>
            <Text style={styles.categoryTitle}>{currentCategory.name}</Text>
            <Text style={styles.categorySubtitle}>{currentCategory.shortDesc}</Text>
          </View>
        </View>
      </View>

      {/* MOBILE CATEGORY PILLS */}
      {!isDesktop && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mobileCategoryScrollWrap}
          contentContainerStyle={styles.mobileCategoryScroll}
        >
          {categories.map((cat) => {
            const isActive = cat.id === currentCategory.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push(`/(customer)/category/${cat.id}`)}
                style={[
                  styles.mobileCatPill,
                  isActive && styles.mobileCatPillActive,
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={getCategoryIcon(cat.icon)}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#0F172A'}
                />
                <Text style={[styles.mobileCatPillText, isActive && styles.mobileCatPillTextActive]}>
                  {cat.name}
                </Text>
                <View
                  style={[
                    styles.mobileCatBadge,
                    isActive && styles.mobileCatBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.mobileCatBadgeText,
                      isActive && styles.mobileCatBadgeTextActive,
                    ]}
                  >
                    {cat.serviceCount}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* SPLIT PANE CONTENT (DESKTOP) OR SINGLE SCROLL (MOBILE) */}
      <View style={styles.splitPaneContainer}>
        {/* LEFT SIDEBAR: CATEGORIES LIST (DESKTOP ONLY) */}
        {isDesktop && (
          <View style={styles.desktopSidebar}>
            <Text style={styles.sidebarHeading}>CATEGORIES</Text>
            {categories.map((cat) => {
              const isActive = cat.id === currentCategory.id;
              const isHovered = hoveredCatId === cat.id && !isActive;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => router.push(`/(customer)/category/${cat.id}`)}
                  onHoverIn={() => setHoveredCatId(cat.id)}
                  onHoverOut={() => setHoveredCatId(null)}
                  style={[
                    styles.sidebarItem,
                    isActive && styles.sidebarItemActive,
                    isHovered && [
                      styles.sidebarItemHovered,
                      { borderColor: `${cat.tagColor}55` },
                    ],
                  ]}
                >
                  <View style={styles.sidebarItemRow}>
                    <View
                      style={[
                        styles.sidebarIndicator,
                        { backgroundColor: isActive ? cat.tagColor : 'transparent' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.sidebarItemText,
                        isActive && styles.sidebarItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.sidebarBadge,
                      isActive && { backgroundColor: `${cat.tagColor}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sidebarBadgeText,
                        isActive && { color: cat.tagColor },
                      ]}
                    >
                      {cat.serviceCount}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* RIGHT CONTENT: SERVICES LISTING */}
        <ScrollView style={styles.servicesScroll} contentContainerStyle={styles.servicesScrollContent}>
          <View style={styles.servicesHeaderRow}>
            <Text style={styles.servicesFoundCount}>
              Showing {categoryServices.length} specialized services
            </Text>
            <View style={styles.warrantyBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#10B981" />
              <Text style={styles.warrantyText}>30-Day Servicewala Guarantee</Text>
            </View>
          </View>

          <View style={styles.servicesListWrap}>
            {categoryServices.map((service) => {
              const qty = cart[service.id] || 0;
              return (
                <View key={service.id} style={styles.catalogCard}>
                  <View style={styles.cardMain}>
                    <View style={styles.cardDetails}>
                      {service.popularBadge && (
                        <View style={styles.serviceBadgeWrap}>
                          <Text style={styles.serviceBadgeLabel}>{service.popularBadge}</Text>
                        </View>
                      )}

                      <Text style={styles.catalogServiceName}>{service.name}</Text>
                      <Text style={styles.catalogTagline}>{service.tagline}</Text>

                      <View style={styles.catalogMetaRow}>
                        <View style={styles.ratingPill}>
                          <Ionicons name="star" size={12} color="#F59E0B" />
                          <Text style={styles.ratingScore}>{service.rating}</Text>
                          <Text style={styles.ratingCount}>({service.reviewCount})</Text>
                        </View>
                        <Text style={styles.metaDivider}>•</Text>
                        <View style={styles.durationRow}>
                          <Ionicons name="time-outline" size={13} color="#64748B" />
                          <Text style={styles.durationVal}>{service.duration}</Text>
                        </View>
                        {service.warranty && (
                          <>
                            <Text style={styles.metaDivider}>•</Text>
                            <Text style={styles.warrantyTag}>{service.warranty}</Text>
                          </>
                        )}
                      </View>

                      {/* Includes bullet points */}
                      <View style={styles.includesBox}>
                        {service.includes.slice(0, 3).map((item, idx) => (
                          <View key={idx} style={styles.bulletRow}>
                            <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        onPress={() => setSelectedService(service)}
                        style={styles.viewDetailsBtn}
                      >
                        <Text style={styles.viewDetailsText}>View Service Details & Protocol</Text>
                        <Ionicons name="chevron-forward" size={14} color={THEME.colors.primary} />
                      </TouchableOpacity>
                    </View>

                    {/* Right side: Image & Add button */}
                    <View style={styles.imageAndActionCol}>
                      <Image source={{ uri: service.imageUrl }} style={styles.catalogImage} />
                      <View style={styles.priceContainer}>
                        <Text style={styles.catalogPrice}>{currencyFormatter(service.price)}</Text>
                        <Text style={styles.catalogOriginalPrice}>
                          {currencyFormatter(service.originalPrice)}
                        </Text>
                      </View>

                      {qty > 0 ? (
                        <View style={styles.catalogQtyControl}>
                          <TouchableOpacity
                            onPress={() => removeFromCart(service.id)}
                            style={styles.catalogQtyBtn}
                          >
                            <Ionicons name="remove" size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                          <Text style={styles.catalogQtyVal}>{qty}</Text>
                          <TouchableOpacity
                            onPress={() => addToCart(service.id)}
                            style={styles.catalogQtyBtn}
                          >
                            <Ionicons name="add" size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => addToCart(service.id)}
                          style={styles.catalogAddBtn}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.catalogAddBtnText}>ADD</Text>
                          <Ionicons name="add" size={14} color={THEME.colors.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* STICKY BOTTOM CHECKOUT PILL (FLOATING ISLAND) */}
      {totalCartCount > 0 && (
        <View
          style={[
            styles.stickyCartBarWrapper,
            !isDesktop && styles.stickyCartBarWrapperMobile,
          ]}
          pointerEvents="box-none"
        >
          <View style={[styles.stickyCartCapsule, !isDesktop && styles.stickyCartCapsuleMobile]}>
            <View style={styles.stickyCartInfo}>
              <View style={styles.stickyCountWrap}>
                <View style={styles.stickyCartIconBadge}>
                  <Ionicons name="bag-check" size={14} color="#10B981" />
                </View>
                <Text style={styles.stickyTotalAmount}>{currencyFormatter(cartSubtotal)}</Text>
                <Text style={styles.stickyDotSep}>•</Text>
                <Text style={styles.stickyCountText}>
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
                </Text>
              </View>
              <Text style={styles.stickySubText} numberOfLines={1}>
                {isDesktop ? 'Extra ₹50 off applies on online checkout' : 'Extra ₹50 off applied'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(customer)/checkout')}
              style={[styles.stickyProceedBtn, !isDesktop && styles.stickyProceedBtnMobile]}
              activeOpacity={0.88}
            >
              <Text style={styles.stickyProceedText}>
                {isDesktop ? 'View Cart & Checkout' : 'View Cart'}
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SERVICE DETAILS MODAL */}
      <Modal
        visible={!!selectedService}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedService(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDesktop ? styles.modalDesktop : styles.modalMobile]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Service Overview</Text>
              <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedService && (
              <ScrollView style={styles.modalBody}>
                <Image source={{ uri: selectedService.imageUrl }} style={styles.modalHeroImage} />
                <View style={styles.modalContentPad}>
                  <Text style={styles.modalServiceName}>{selectedService.name}</Text>
                  <Text style={styles.modalServiceTagline}>{selectedService.tagline}</Text>

                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPrice}>{currencyFormatter(selectedService.price)}</Text>
                    <Text style={styles.modalOriginalPrice}>
                      {currencyFormatter(selectedService.originalPrice)}
                    </Text>
                    <View style={styles.modalDurationPill}>
                      <Ionicons name="time" size={13} color="#4F46E5" />
                      <Text style={styles.modalDurationText}>{selectedService.duration}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalDescription}>{selectedService.description}</Text>

                  <Text style={styles.modalSectionHeading}>What is included in this service:</Text>
                  <View style={styles.modalBulletList}>
                    {selectedService.includes.map((inc, i) => (
                      <View key={i} style={styles.modalBulletRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.modalBulletText}>{inc}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.modalSectionHeading}>Servicewala Quality & Safety Standard:</Text>
                  <View style={styles.safetyBox}>
                    <View style={styles.safetyItem}>
                      <Ionicons name="shield" size={18} color="#4F46E5" />
                      <Text style={styles.safetyText}>Verified Background Checked Professional</Text>
                    </View>
                    <View style={styles.safetyItem}>
                      <Ionicons name="medkit" size={18} color="#10B981" />
                      <Text style={styles.safetyText}>Sanitized Tools & Single-Use Hygiene Materials</Text>
                    </View>
                    <View style={styles.safetyItem}>
                      <Ionicons name="receipt" size={18} color="#F59E0B" />
                      <Text style={styles.safetyText}>Zero hidden costs & upfront transparent billing</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            {selectedService && (
              <View style={styles.modalFooter}>
                <View>
                  <Text style={styles.modalFooterLabel}>Total Amount</Text>
                  <Text style={styles.modalFooterPrice}>{currencyFormatter(selectedService.price)}</Text>
                </View>

                <View style={styles.modalFooterActions}>
                  <TouchableOpacity
                    onPress={() => {
                      const sId = selectedService.id;
                      setSelectedService(null);
                      router.push(`/(customer)/service/${sId}`);
                    }}
                    style={styles.modalFullPageBtn}
                  >
                    <Text style={styles.modalFullPageBtnText}>Full Page ↗</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      addToCart(selectedService.id);
                      setSelectedService(null);
                    }}
                    style={styles.modalAddToCartBtn}
                  >
                    <Ionicons name="cart" size={16} color="#FFFFFF" />
                    <Text style={styles.modalAddToCartText}>Add to Booking</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBanner: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderLeftWidth: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerBannerInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
    alignSelf: 'flex-start',
    cursor: 'pointer',
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  bannerTextWrap: {},
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  categorySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  mobileCategoryScrollWrap: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mobileCategoryScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  mobileCatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
  },
  mobileCatPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  mobileCatPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  mobileCatPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  mobileCatBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  mobileCatBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  mobileCatBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  mobileCatBadgeTextActive: {
    color: '#FFFFFF',
  },
  splitPaneContainer: {
    flex: 1,
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
  },
  desktopSidebar: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sidebarHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    cursor: 'pointer',
  },
  sidebarItemActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  sidebarItemHovered: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sidebarItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sidebarIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  sidebarItemText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    flexShrink: 1,
  },
  sidebarItemTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  sidebarBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sidebarBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  servicesScroll: {
    flex: 1,
  },
  servicesScrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  servicesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  servicesFoundCount: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  warrantyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  warrantyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  servicesListWrap: {
    gap: 16,
  },
  catalogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  cardMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  cardDetails: {
    flex: 1,
  },
  serviceBadgeWrap: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  serviceBadgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  catalogServiceName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  catalogTagline: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  catalogMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  ratingCount: {
    fontSize: 11,
    color: '#64748B',
  },
  metaDivider: {
    color: '#CBD5E1',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationVal: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  warrantyTag: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  includesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletText: {
    fontSize: 12,
    color: '#334155',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  imageAndActionCol: {
    width: 130,
    alignItems: 'center',
  },
  catalogImage: {
    width: 120,
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  catalogPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  catalogOriginalPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  catalogAddBtn: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    borderRadius: 8,
    paddingVertical: 7,
    gap: 4,
    ...THEME.shadows.subtle,
  },
  catalogAddBtnText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  catalogQtyControl: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  catalogQtyBtn: {
    padding: 2,
  },
  catalogQtyVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stickyCartBarWrapper: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
    pointerEvents: 'box-none' as any,
  },
  stickyCartBarWrapperMobile: {
    bottom: 68, // Sits comfortably above the mobile bottom tab bar (58px)
    paddingHorizontal: 12,
  },
  stickyCartCapsule: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    maxWidth: 640,
    width: '100%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.45)',
        }
      : {}),
    pointerEvents: 'auto' as any,
  },
  stickyCartCapsuleMobile: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 10,
  },
  stickyCartInfo: {
    flex: 1,
  },
  stickyCountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stickyCartIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyDotSep: {
    color: '#64748B',
    fontSize: 12,
  },
  stickyCountText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  stickyTotalAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  stickySubText: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  stickyProceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    gap: 8,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    cursor: 'pointer',
  },
  stickyProceedBtnMobile: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  stickyProceedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
    ...THEME.shadows.modal,
  },
  modalDesktop: {
    width: 600,
  },
  modalMobile: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    flex: 1,
  },
  modalHeroImage: {
    width: '100%',
    height: 180,
  },
  modalContentPad: {
    padding: 20,
  },
  modalServiceName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalServiceTagline: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalOriginalPrice: {
    fontSize: 15,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  modalDurationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  modalDurationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 20,
  },
  modalSectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  modalBulletList: {
    gap: 8,
    marginBottom: 20,
  },
  modalBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalBulletText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  safetyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 10,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  safetyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  modalFooterLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  modalFooterPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalFullPageBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalFullPageBtnText: {
    color: '#0F172A',
    fontSize: 12.5,
    fontWeight: '700',
  },
  modalAddToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  modalAddToCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
