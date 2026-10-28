import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { SPOTLIGHT_OFFERS, TESTIMONIALS } from '../../src/data/mockEcosystemData';
import { THEME, currencyFormatter } from '../../src/constants/theme';

/* ─── Specialized Service Categories Strip (AC, Gadgets & Appliances) ─── */
const QUICK_SERVICES_STRIP = [
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


export default function CustomerHomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { categories, services, cart, addToCart, removeFromCart, applyPromo } =
    useEcosystemStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [hoveredStripId, setHoveredStripId] = useState<string | null>(null);
  const mainScrollRef = useRef<any>(null);

  /* Hero fade-in animation */
  const heroFade = useMemo(() => new Animated.Value(0), []);
  const heroSlide = useMemo(() => new Animated.Value(24), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(heroSlide, {
        toValue: 0,
        duration: 700,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [heroFade, heroSlide]);

  // Filter services if search query is entered or quick category selected
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

  const handleSearchSubmit = () => {
    if (activeQuickFilter) setActiveQuickFilter(null);
    mainScrollRef.current?.scrollTo({
      y: isDesktop ? 450 : 390,
      animated: true,
    });
  };

  const getCategoryIcon = (iconName: string) => {
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
  };

  return (
    <ScrollView
      ref={mainScrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentWrap}
    >
      {/* ══════════════ HERO SECTION (HomeAdvisor Style) ══════════════ */}
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={require('../../assets/hero-service-banner.jpg')}
          style={[styles.heroBackground, isDesktop ? styles.heroBackgroundDesktop : styles.heroBackgroundMobile]}
          imageStyle={styles.heroBackgroundImage}
          resizeMode="cover"
        >
          {/* Subtle warm overlay to let background breathe while making text readable */}
          <View style={styles.heroOverlay} />

          <View style={styles.heroContentContainer}>
            <Animated.View
              style={[
                styles.heroGlassCard,
                isDesktop ? styles.heroGlassCardDesktop : styles.heroGlassCardMobile,
                { opacity: heroFade, transform: [{ translateY: heroSlide }] },
              ]}
            >
              {/* Top tag badge pill */}
              <View style={styles.heroPillBadge}>
                <Text style={styles.heroPillText}>EXPERT LAPTOP, COMPUTER & APPLIANCES</Text>
              </View>

              {/* Big bold crisp headline */}
              <Text style={[styles.heroHeadline, isDesktop ? styles.heroHeadlineDesktop : styles.heroHeadlineMobile]}>
                Expert Doorstep Repair for{'\n'}Laptops, Computers & AC
              </Text>

              {/* HomeAdvisor / Urban Company-style pill search capsule */}
              <View
                style={[
                  styles.searchCapsule,
                  isSearchFocused && styles.searchCapsuleFocused,
                ]}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color={isSearchFocused ? '#991B1B' : '#94A3B8'}
                  style={styles.searchLeadIcon}
                />
                <TextInput
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (activeQuickFilter) setActiveQuickFilter(null);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Search 'Laptop Repair', 'Desktop PC', 'Printer', 'AC'..."
                  placeholderTextColor="#94A3B8"
                  style={styles.searchMainInput}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.searchClearBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.7}
                    accessibilityLabel="Clear search"
                  >
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleSearchSubmit}
                  style={styles.searchSubmitButton}
                  activeOpacity={0.85}
                  accessibilityLabel="Search services"
                >
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ImageBackground>
      </View>

      {/* ══════════════ HORIZONTAL CATEGORY ICON STRIP (HomeAdvisor Style) ══════════════ */}
      <View style={styles.iconStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.iconStripScroll,
            isDesktop && styles.iconStripScrollDesktop,
          ]}
        >
          {QUICK_SERVICES_STRIP.map((item) => {
            const isSelected = activeQuickFilter === item.id;
            const isHovered = hoveredStripId === item.id && !isSelected;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (isSelected) {
                    setActiveQuickFilter(null);
                  } else {
                    setActiveQuickFilter(item.id);
                  }
                }}
                onHoverIn={() => setHoveredStripId(item.id)}
                onHoverOut={() => setHoveredStripId(null)}
                style={[
                  styles.iconStripItem,
                  isSelected && styles.iconStripItemActive,
                  isHovered && styles.iconStripItemHovered,
                ]}
              >
                <View
                  style={[
                    styles.iconStripIconWrap,
                    isSelected && styles.iconStripIconWrapActive,
                    isHovered && styles.iconStripIconWrapHovered,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={
                      isSelected
                        ? '#FFFFFF'
                        : isHovered
                        ? '#991B1B'
                        : '#475569'
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.iconStripLabel,
                    isSelected && styles.iconStripLabelActive,
                    isHovered && styles.iconStripLabelHovered,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <View style={styles.iconIndicatorWrap}>
                  {isSelected ? (
                    <View style={styles.iconActiveDot} />
                  ) : isHovered ? (
                    <View style={styles.iconHoverBar} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ══════════════ SUBTLE TRUST STRIP ══════════════ */}
      <View style={styles.trustStripBar}>
        <View style={styles.trustStripInner}>
          <View style={styles.trustStripItem}>
            <Ionicons name="star" size={14} color="#D97706" />
            <Text style={styles.trustStripText}>4.85 Avg Rating</Text>
          </View>
          <View style={styles.trustStripDivider} />
          <View style={styles.trustStripItem}>
            <Ionicons name="shield-checkmark" size={14} color="#059669" />
            <Text style={styles.trustStripText}>100% Background-Verified Pros</Text>
          </View>
          <View style={styles.trustStripDivider} />
          <View style={styles.trustStripItem}>
            <Ionicons name="time" size={14} color="#991B1B" />
            <Text style={styles.trustStripText}>60-Min Doorstep Guarantee</Text>
          </View>
          <View style={styles.trustStripDivider} />
          <View style={styles.trustStripItem}>
            <Ionicons name="card" size={14} color="#2563EB" />
            <Text style={styles.trustStripText}>Pay After Service</Text>
          </View>
        </View>
      </View>

      {/* CATEGORIES SECTION */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Explore All Categories</Text>
            <Text style={styles.sectionSub}>Select a category to view specialized services</Text>
          </View>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.88}
              onPress={() => router.push(`/(customer)/category/${category.id}`)}
              style={[
                styles.categoryCard,
                isDesktop ? styles.categoryCardDesktop : styles.categoryCardMobile,
              ]}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: `${category.tagColor}15` }]}>
                <Ionicons
                  name={getCategoryIcon(category.icon) as any}
                  size={26}
                  color={category.tagColor}
                />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>
                {category.name}
              </Text>
              <Text style={styles.categoryDesc} numberOfLines={1}>
                {category.shortDesc}
              </Text>
              <View style={styles.categoryFooter}>
                <Text style={[styles.categoryCount, { color: category.tagColor }]}>
                  {category.serviceCount} Services
                </Text>
                <Ionicons name="arrow-forward" size={14} color={category.tagColor} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SPOTLIGHT OFFERS & DEALS */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Exclusive Seasonal Deals</Text>
            <Text style={styles.sectionSub}>Apply discount coupons right at checkout</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersRow}>
          {SPOTLIGHT_OFFERS.map((offer) => (
            <View
              key={offer.id}
              style={[
                styles.offerCard,
                { backgroundColor: offer.bgGradient[0] },
                isDesktop ? styles.offerCardDesktop : styles.offerCardMobile,
              ]}
            >
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>{offer.badge}</Text>
              </View>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSub}>{offer.subtitle}</Text>
              <View style={styles.offerBottomRow}>
                <View style={styles.offerCodePill}>
                  <Text style={styles.offerCodeText}>{offer.code}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    applyPromo(offer.code);
                    router.push('/(customer)/checkout');
                  }}
                  style={styles.offerApplyBtn}
                >
                  <Text style={styles.offerApplyBtnText}>Use Deal</Text>
                  <Ionicons name="arrow-forward" size={14} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* POPULAR & SEARCHED SERVICES */}
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
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearFilterChip}
              activeOpacity={0.8}
            >
              <Text style={styles.clearFilterChipText}>Clear Search ✕</Text>
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
              onPress={() => setSearchQuery('')}
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
                          <Text style={styles.originalPrice}>{currencyFormatter(service.originalPrice)}</Text>
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

      {/* CUSTOMER TESTIMONIALS */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>What Bengaluru Customers Say</Text>
            <Text style={styles.sectionSub}>Real reviews from verified completed orders</Text>
          </View>
        </View>

        <View style={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t) => (
            <View
              key={t.id}
              style={[
                styles.testimonialCard,
                isDesktop ? styles.testimonialCardDesktop : styles.testimonialCardMobile,
              ]}
            >
              <View style={styles.testimonialStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={15} color="#F59E0B" />
                ))}
              </View>
              <Text style={styles.testimonialComment}>{"\"" + t.comment + "\""}</Text>
              <View style={styles.testimonialUserRow}>
                <Image source={{ uri: t.avatar }} style={styles.testimonialAvatar} />
                <View>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <Text style={styles.testimonialRole}>{t.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrap: {
    paddingBottom: 40,
  },
  /* ══════════════ HERO SECTION (HomeAdvisor Style) ══════════════ */
  heroWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  heroBackground: {
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackgroundImage: {
    resizeMode: 'cover',
  },
  heroBackgroundDesktop: {
    height: 440,
  },
  heroBackgroundMobile: {
    minHeight: 320,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  heroContentContainer: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 24,
    zIndex: 2,
  },
  heroGlassCard: {
    backgroundColor: 'rgba(24, 28, 38, 0.72)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  heroGlassCardDesktop: {
    padding: 26,
    maxWidth: 580,
  },
  heroGlassCardMobile: {
    padding: 18,
    width: '100%',
  },
  heroPillBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroHeadline: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: 18,
  },
  heroHeadlineDesktop: {
    fontSize: 34,
    lineHeight: 42,
  },
  heroHeadlineMobile: {
    fontSize: 24,
    lineHeight: 30,
  },
  searchCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    height: 54,
    paddingLeft: 16,
    paddingRight: 5,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  searchCapsuleFocused: {
    borderColor: '#991B1B',
    shadowColor: '#991B1B',
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  searchLeadIcon: {
    marginRight: 8,
  },
  searchMainInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
    outlineStyle: 'none' as any,
  },
  searchClearBtn: {
    padding: 6,
    marginRight: 4,
  },
  searchSubmitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#991B1B', // Dark red / maroon accent
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  clearFilterChip: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    cursor: 'pointer',
  },
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
  },
  emptySearchResetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ══════════════ HORIZONTAL CATEGORY ICON STRIP ══════════════ */
  iconStripWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 14,
    height: 112,
    justifyContent: 'center',
  },
  iconStripScroll: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },
  iconStripScrollDesktop: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 0,
  },
  iconStripItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    minWidth: 72,
    height: 84,
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
  } as any,
  iconStripItemActive: {
    backgroundColor: 'transparent',
  },
  iconStripItemHovered: {
    backgroundColor: 'transparent',
  },
  iconStripIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
  } as any,
  iconStripIconWrapActive: {
    backgroundColor: '#991B1B',
    borderColor: '#991B1B',
    transform: [{ translateY: -2 }],
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  iconStripIconWrapHovered: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    transform: [{ translateY: -3 }, { scale: 1.05 }],
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  iconStripLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    transition: 'color 0.2s ease',
  } as any,
  iconStripLabelActive: {
    color: '#991B1B',
    fontWeight: '700',
  },
  iconStripLabelHovered: {
    color: '#0F172A',
    fontWeight: '600',
  },
  iconIndicatorWrap: {
    height: 4,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActiveDot: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#991B1B',
    transition: 'all 0.2s ease',
  } as any,
  iconHoverBar: {
    width: 12,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#F87171',
    transition: 'all 0.2s ease',
  } as any,

  /* ══════════════ SUBTLE TRUST STRIP ══════════════ */
  trustStripBar: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  trustStripInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  trustStripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustStripText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  trustStripDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
  },
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryCardDesktop: {
    width: '31.5%',
  },
  categoryCardMobile: {
    width: '47.5%',
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  offersRow: {
    gap: 16,
    paddingBottom: 8,
  },
  offerCard: {
    borderRadius: 18,
    padding: 20,
    justifyContent: 'space-between',
  },
  offerCardDesktop: {
    width: 360,
  },
  offerCardMobile: {
    width: 290,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  offerSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  offerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerCodePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  offerCodeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  offerApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  offerApplyBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 12,
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
  testimonialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  testimonialCardDesktop: {
    width: '31.5%',
  },
  testimonialCardMobile: {
    width: '100%',
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 12,
  },
  testimonialComment: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testimonialAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  testimonialName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  testimonialRole: {
    fontSize: 11,
    color: '#64748B',
  },
});
