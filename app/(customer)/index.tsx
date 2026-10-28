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
import { SUPPORTED_BRANDS, BrandLogo } from '../../src/components';

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


const CATEGORY_STATS: Record<string, { rating: string; reviews: string }> = {
  'gadgets-repair': { rating: '4.8', reviews: '12k+' },
  'printer-repair': { rating: '4.9', reviews: '4.5k+' },
  'ac-appliances': { rating: '4.8', reviews: '28k+' },
  'cleaning': { rating: '4.8', reviews: '15k+' },
  'home-repairs': { rating: '4.7', reviews: '32k+' },
  'salon-women': { rating: '4.8', reviews: '18k+' },
  'salon-men': { rating: '4.7', reviews: '9k+' },
  'painting': { rating: '4.8', reviews: '6k+' },
};

const TESTIMONIAL_EXTRA: Record<string, { timeAgo: string }> = {
  'test-1': { timeAgo: '2 days ago' },
  'test-2': { timeAgo: '4 days ago' },
  'test-3': { timeAgo: '1 week ago' },
};

export default function CustomerHomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const isMobileSmall = width < 540;

  const { categories, services, cart, addToCart, removeFromCart, applyPromo } =
    useEcosystemStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [hoveredStripId, setHoveredStripId] = useState<string | null>(null);
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const [hoveredTestimonialId, setHoveredTestimonialId] = useState<string | null>(null);
  const [hoveredOfferId, setHoveredOfferId] = useState<string | null>(null);
  const [hoveredBrandKey, setHoveredBrandKey] = useState<string | null>(null);
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

  /* Marquee animation styles for web (left-to-right infinite drift, pauses on hover) */
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'servicewala-brand-marquee-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes servicewalaMarqueeLtoR {
            0% {
              transform: translate3d(-50%, 0, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          }
          .servicewala-marquee-track {
            display: flex !important;
            flex-direction: row !important;
            width: max-content !important;
            animation: servicewalaMarqueeLtoR 45s linear infinite !important;
          }
          .servicewala-marquee-track:hover {
            animation-play-state: paused !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

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
                  isDesktop ? styles.iconStripItemDesktop : styles.iconStripItemMobile,
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
                        ? '#0F172A'
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
                  <View
                    style={[
                      styles.iconIndicatorBar,
                      isSelected
                        ? styles.iconIndicatorActive
                        : isHovered
                        ? styles.iconIndicatorHovered
                        : styles.iconIndicatorHidden,
                    ]}
                  />
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
            <Ionicons name="star" size={14} color="#0F172A" />
            <Text style={styles.trustStripText}>4.85 Avg Rating</Text>
          </View>
          <View style={styles.trustStripDivider} />
          <View style={styles.trustStripItem}>
            <Ionicons name="shield-checkmark" size={14} color="#0F172A" />
            <Text style={styles.trustStripText}>100% Background-Verified Pros</Text>
          </View>
          <View style={styles.trustStripDivider} />
          <View style={styles.trustStripItem}>
            <Ionicons name="time" size={14} color="#0F172A" />
            <Text style={styles.trustStripText}>60-Min Doorstep Guarantee</Text>
          </View>
          <View style={styles.trustStripDivider} />
          <View style={styles.trustStripItem}>
            <Ionicons name="card" size={14} color="#0F172A" />
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
          {categories.map((category) => {
            const stats = CATEGORY_STATS[category.id] || { rating: '4.8', reviews: '10k+' };
            const isHovered = hoveredCatId === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => router.push(`/(customer)/category/${category.id}`)}
                onHoverIn={() => setHoveredCatId(category.id)}
                onHoverOut={() => setHoveredCatId(null)}
                style={[
                  styles.categoryCard,
                  isDesktop
                    ? styles.categoryCardDesktop
                    : isMobileSmall
                    ? styles.categoryCardMobileSmall
                    : styles.categoryCardMobile,
                  isHovered && styles.categoryCardHovered,
                ]}
              >
                <View
                  style={[
                    styles.categoryIconBox,
                    isHovered && styles.categoryIconBoxHovered,
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(category.icon) as any}
                    size={22}
                    color={isHovered ? '#000000' : '#1E293B'}
                  />
                </View>
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {category.name}
                  </Text>
                  <View style={styles.categoryMetaRow}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.categoryRatingText}>
                      {stats.rating} ({stats.reviews})
                    </Text>
                    <Text style={styles.categoryMetaDivider}>|</Text>
                    <Text style={styles.categoryServiceCountText}>
                      {category.serviceCount} Services
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
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
            <View style={styles.testimonialHeaderPill}>
              <Ionicons name="shield-checkmark" size={12} color="#059669" />
              <Text style={styles.testimonialHeaderPillText}>VERIFIED REVIEWS</Text>
            </View>
            <Text style={styles.sectionTitle}>What Bengaluru Customers Say</Text>
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
                      <Text style={styles.testimonialRole} numberOfLines={1}>{t.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.testimonialTimeAgo}>{extra.timeAgo}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ══════════════ TRUSTED BRAND NETWORK SECTION (Full Width) ══════════════ */}
      <View style={styles.brandSectionContainer}>
        <View style={styles.brandSectionHeader}>
          <View style={styles.brandHeaderBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#0F172A" />
            <Text style={styles.brandHeaderBadgeText}>AUTHORIZED SERVICE & MULTI-BRAND REPAIR</Text>
          </View>
          <Text style={styles.brandSectionTitle}>Top Brands We Service & Support</Text>
          <Text style={styles.brandSectionSub}>
            Doorstep repairs using 100% genuine OEM parts for 22+ leading home appliance and computing brands
          </Text>
        </View>

        {/* Full-Width Automated Infinite Marquee Strip */}
        <View style={styles.brandMarqueeOuter}>
          {/* Subtle Side Fade Gradients */}
          {Platform.OS === 'web' && <View style={styles.marqueeFadeLeft} pointerEvents="none" />}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandMarqueeTrackContainer}
            style={styles.brandMarqueeScroll}
          >
            <View
              style={styles.brandMarqueeTrack as any}
              {...({ className: 'servicewala-marquee-track' } as any)}
            >
              {[...SUPPORTED_BRANDS, ...SUPPORTED_BRANDS].map((brand, idx) => {
                const itemKey = `${brand.id}-${idx}`;
                const isHovered = hoveredBrandKey === itemKey;
                return (
                  <Pressable
                    key={itemKey}
                    onHoverIn={() => setHoveredBrandKey(itemKey)}
                    onHoverOut={() => setHoveredBrandKey(null)}
                    style={[
                      styles.brandCard,
                      isHovered && {
                        borderColor: brand.originalColor,
                        shadowColor: brand.originalColor,
                        shadowOpacity: 0.22,
                        shadowRadius: 14,
                        elevation: 5,
                        transform: [{ translateY: -3 }, { scale: 1.04 }],
                      },
                    ]}
                  >
                    <BrandLogo brand={brand} isHovered={isHovered} />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {Platform.OS === 'web' && <View style={styles.marqueeFadeRight} pointerEvents="none" />}
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
    height: 84,
    cursor: 'pointer',
    position: 'relative',
  } as any,
  iconStripItemDesktop: {
    width: 104,
    flexShrink: 0,
  },
  iconStripItemMobile: {
    width: 84,
    flexShrink: 0,
  },
  iconStripIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  iconStripIconWrapActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    transform: [{ translateY: -2 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 4,
  },
  iconStripIconWrapHovered: {
    backgroundColor: '#F8FAFC',
    borderColor: '#0F172A',
    transform: [{ translateY: -3 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  iconStripLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    transition: 'color 0.2s ease',
  } as any,
  iconStripLabelActive: {
    color: '#0F172A',
  },
  iconStripLabelHovered: {
    color: '#0F172A',
  },
  iconIndicatorWrap: {
    height: 4,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconIndicatorBar: {
    height: 3,
    borderRadius: 2,
    transition: 'all 0.2s ease',
  } as any,
  iconIndicatorActive: {
    width: 18,
    backgroundColor: '#0F172A',
    opacity: 1,
  },
  iconIndicatorHovered: {
    width: 12,
    backgroundColor: '#94A3B8',
    opacity: 1,
  },
  iconIndicatorHidden: {
    width: 0,
    backgroundColor: 'transparent',
    opacity: 0,
  },

  /* ══════════════ SUBTLE TRUST STRIP ══════════════ */
  trustStripBar: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#0F172A',
  },
  trustStripDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E2E8F0',
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
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  } as any,
  categoryCardDesktop: {
    width: '23.9%',
  },
  categoryCardMobile: {
    width: '48.5%',
  },
  categoryCardMobileSmall: {
    width: '100%',
  },
  categoryCardHovered: {
    borderColor: '#CBD5E1',
    transform: [{ translateY: -2 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    transition: 'all 0.2s ease',
  } as any,
  categoryIconBoxHovered: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  categoryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 3,
  },
  categoryMetaDivider: {
    fontSize: 11,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },
  categoryServiceCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
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
  /* ══════════════ TESTIMONIALS SECTION ══════════════ */
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
  /* ══════════════ BRAND NETWORK MARQUEE STRIP ══════════════ */
  brandSectionContainer: {
    width: '100%',
    marginTop: 48,
    marginBottom: 8,
  },
  brandSectionHeader: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  brandHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  brandHeaderBadgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  brandSectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 6,
  },
  brandSectionSub: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 640,
    lineHeight: 20,
  },
  brandMarqueeOuter: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  marqueeFadeLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 80,
    zIndex: 10,
    backgroundImage: 'linear-gradient(to right, #FFFFFF, rgba(255,255,255,0))',
  } as any,
  marqueeFadeRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 80,
    zIndex: 10,
    backgroundImage: 'linear-gradient(to left, #FFFFFF, rgba(255,255,255,0))',
  } as any,
  brandMarqueeScroll: {
    overflow: 'visible',
  },
  brandMarqueeTrackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMarqueeTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  brandCard: {
    width: 172,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
});
