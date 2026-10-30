import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Animated,
  Easing,
  LayoutAnimation,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, currencyFormatter } from '../../../src/constants/theme';
import { useEcosystemStore } from '../../../src/store/useEcosystemStore';

interface ServiceFaqItemProps {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}

const ServiceFaqItem: React.FC<ServiceFaqItemProps> = ({ faq, isOpen, onToggle }) => {
  const [anim] = useState(() => new Animated.Value(isOpen ? 1 : 0));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOpen ? 1 : 0,
      duration: 280,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isOpen, anim]);

  const chevronRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
      <Pressable onPress={onToggle} style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, isOpen && styles.faqQuestionOpen]}>{faq.q}</Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Ionicons
            name="chevron-down"
            size={16}
            color={isOpen ? '#2563EB' : '#64748B'}
          />
        </Animated.View>
      </Pressable>
      {(Platform.OS === 'web' || isOpen) && (
        <View
          style={[
            styles.faqBody,
            Platform.OS === 'web' && ({
              maxHeight: isOpen ? 220 : 0,
              opacity: isOpen ? 1 : 0,
              paddingTop: isOpen ? 8 : 0,
              paddingBottom: isOpen ? 14 : 0,
              borderTopWidth: isOpen ? 1 : 0,
              overflow: 'hidden',
              pointerEvents: isOpen ? 'auto' : 'none',
              transition:
                'max-height 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, padding 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-top-width 0.25s ease',
            } as any),
          ]}
        >
          <Text style={styles.faqAnswer}>{faq.a}</Text>
        </View>
      )}
    </View>
  );
};

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const router = useRouter();

  const { services, categories, cart, addToCart, removeFromCart } =
    useEcosystemStore();

  // Find the requested service
  const service = services.find((s) => s.id === id) || services[0];
  const category = categories.find((c) => c.id === service?.categoryId) || categories[0];

  // Related services in the same category
  const relatedServices = services
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);

  const serviceQty = cart[service.id] || 0;
  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // Local state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const SERVICE_FAQS = [
    {
      q: 'How long will it take for the technician to arrive?',
      a: 'Standard doorstep arrival is within 45 to 60 minutes for immediate slots, or you can pick any specific date and 2-hour window during checkout.',
    },
    {
      q: 'What is covered under the 30-Day Guarantee?',
      a: 'If any issue related to this specific service resurfaces within 30 days, a senior specialist will revisit and fix it with zero inspection or labour fees.',
    },
    {
      q: 'Do I need to provide any tools or materials?',
      a: 'No. Our verified technician arrives in uniform with all required professional diagnostic kits, cleaning compounds, and safety gear.',
    },
  ];

  const handleAddToCart = () => {
    addToCart(service.id);
  };

  return (
    <View style={styles.screenRoot}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentWrap}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainInner}>
          {/* ── BREADCRUMB & BACK BUTTON ── */}
          <View style={styles.breadcrumbBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={16} color="#0F172A" />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.breadcrumbLinks}>
              <TouchableOpacity onPress={() => router.push('/(customer)')}>
                <Text style={styles.breadcrumbLink}>Home</Text>
              </TouchableOpacity>
              <Text style={styles.breadcrumbSep}>/</Text>
              <TouchableOpacity
                onPress={() => router.push(`/(customer)/category/${category.id}`)}
              >
                <Text style={styles.breadcrumbLink}>{category.name}</Text>
              </TouchableOpacity>
              <Text style={styles.breadcrumbSep}>/</Text>
              <Text style={styles.breadcrumbActive} numberOfLines={1}>
                {service.name}
              </Text>
            </View>
          </View>

          {/* ── 2-COLUMN MAIN CONTENT (Desktop) / STACKED (Mobile) ── */}
          <View
            style={[
              styles.productLayout,
              isDesktop ? styles.productLayoutDesktop : styles.productLayoutMobile,
            ]}
          >
            {/* ════════ LEFT COLUMN: MAIN SERVICE CONTENT ════════ */}
            <View
              style={[
                styles.productLeftCol,
                isDesktop ? styles.productLeftColDesktop : styles.productLeftColMobile,
              ]}
            >
              {/* Product Hero Image Card */}
              <View style={styles.productHeroImageCard}>
                <Image source={{ uri: service.imageUrl }} style={styles.productHeroImage} />

                {service.popularBadge && (
                  <View style={styles.productPopularBadge}>
                    <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                    <Text style={styles.productPopularBadgeText}>{service.popularBadge}</Text>
                  </View>
                )}

                <View style={styles.productCategoryPill}>
                  <Text style={styles.productCategoryPillText}>{category.name}</Text>
                </View>
              </View>

              {/* Title & Tagline */}
              <Text style={styles.productTitle}>{service.name}</Text>
              <Text style={styles.productTagline}>{service.tagline}</Text>

              {/* Rating & Trust Meta Strip */}
              <View style={styles.productMetaStrip}>
                <View style={styles.ratingScorePill}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingScoreText}>{service.rating}</Text>
                  <Text style={styles.ratingCountText}>({service.reviewCount} ratings)</Text>
                </View>

                <View style={styles.metaDivider} />

                <View style={styles.metaTimePill}>
                  <Ionicons name="time-outline" size={14} color="#64748B" />
                  <Text style={styles.metaTimeText}>{service.duration}</Text>
                </View>

                <View style={styles.metaDivider} />

                <View style={styles.warrantyPill}>
                  <Ionicons name="shield-checkmark" size={13} color="#059669" />
                  <Text style={styles.warrantyPillText}>30-Day Guarantee</Text>
                </View>
              </View>

              {/* Mobile Price Snapshot Card (Hidden on Desktop, shown on Mobile under header) */}
              {!isDesktop && (
                <View style={styles.mobilePriceCard}>
                  <View>
                    <View style={styles.priceRow}>
                      <Text style={styles.mainPrice}>{currencyFormatter(service.price)}</Text>
                      <Text style={styles.mainOriginalPrice}>
                        {currencyFormatter(service.originalPrice)}
                      </Text>
                    </View>
                    <Text style={styles.savingsTag}>
                      Save {currencyFormatter(service.originalPrice - service.price)} (
                      {Math.round(
                        ((service.originalPrice - service.price) / service.originalPrice) * 100
                      )}
                      % OFF)
                    </Text>
                  </View>

                  {serviceQty > 0 ? (
                    <View style={styles.qtyControlRow}>
                      <TouchableOpacity
                        onPress={() => removeFromCart(service.id)}
                        style={styles.qtyBtn}
                      >
                        <Ionicons name="remove" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.qtyNumber}>{serviceQty}</Text>
                      <TouchableOpacity
                        onPress={() => addToCart(service.id)}
                        style={styles.qtyBtn}
                      >
                        <Ionicons name="add" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleAddToCart}
                      style={styles.primaryAddBtn}
                      activeOpacity={0.88}
                    >
                      <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.primaryAddBtnText}>Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Detailed Description */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionHeading}>Service Overview</Text>
                <Text style={styles.sectionDescText}>{service.description}</Text>
              </View>

              {/* What is Included in this Service */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeadingRow}>
                  <Ionicons name="checkmark-done-circle" size={20} color="#059669" />
                  <Text style={styles.sectionHeading}>What is Included in This Service</Text>
                </View>
                <Text style={styles.sectionSubText}>
                  Complete end-to-end doorstep procedure executed by our certified professional:
                </Text>

                <View style={styles.includesList}>
                  {service.includes.map((item, idx) => (
                    <View key={idx} style={styles.includeItem}>
                      <View style={styles.includeIconWrap}>
                        <Ionicons name="checkmark" size={14} color="#059669" />
                      </View>
                      <Text style={styles.includeText}>{item}</Text>
                    </View>
                  ))}
                  <View style={styles.includeItem}>
                    <View style={styles.includeIconWrap}>
                      <Ionicons name="checkmark" size={14} color="#059669" />
                    </View>
                    <Text style={styles.includeText}>
                      Post-service operational test run & customer sign-off verification
                    </Text>
                  </View>
                  <View style={styles.includeItem}>
                    <View style={styles.includeIconWrap}>
                      <Ionicons name="checkmark" size={14} color="#059669" />
                    </View>
                    <Text style={styles.includeText}>
                      Work area cleanup & disposal of packing/waste materials
                    </Text>
                  </View>
                </View>
              </View>

              {/* What is NOT Included (Transparent Exclusions) */}
              <View style={styles.exclusionsCard}>
                <View style={styles.sectionHeadingRow}>
                  <Ionicons name="alert-circle" size={18} color="#D97706" />
                  <Text style={styles.exclusionsHeading}>Important Notes & Exclusions</Text>
                </View>
                <View style={styles.exclusionsList}>
                  <View style={styles.exclusionItem}>
                    <Ionicons name="close-circle-outline" size={14} color="#94A3B8" />
                    <Text style={styles.exclusionText}>
                      Major OEM hardware or spare part replacement costs are extra (quoted upfront with prior customer approval).
                    </Text>
                  </View>
                  <View style={styles.exclusionItem}>
                    <Ionicons name="close-circle-outline" size={14} color="#94A3B8" />
                    <Text style={styles.exclusionText}>
                      Civil work, wall cutting, or extensive concealed plumbing/masonry alterations are not covered.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Servicewala Quality & Safety Standard Shield Card */}
              <View style={styles.safetyGuaranteeCard}>
                <View style={styles.safetyTopBar}>
                  <View style={styles.safetyEmblem}>
                    <Ionicons name="shield-checkmark" size={20} color="#059669" />
                  </View>
                  <View style={styles.safetyTopTexts}>
                    <Text style={styles.safetyTopTitle}>Servicewala Doorstep Trust Promise</Text>
                    <Text style={styles.safetyTopSub}>
                      Complimentary safety & property protection included with this booking
                    </Text>
                  </View>
                </View>

                <View style={styles.safetyPillarsGrid}>
                  {[
                    {
                      icon: 'finger-print-outline',
                      title: '100% Verified Techs',
                      desc: 'Aadhaar biometric & police cleared',
                    },
                    {
                      icon: 'shield-half-outline',
                      title: '₹10,000 Damage Cover',
                      desc: 'Zero liability property insurance',
                    },
                    {
                      icon: 'receipt-outline',
                      title: 'Fixed Transparent Rates',
                      desc: 'Pay safely after work is completed',
                    },
                    {
                      icon: 'ribbon-outline',
                      title: '30-Day Re-visit Guarantee',
                      desc: 'Free resolution for recurring issues',
                    },
                  ].map((pillar, pIdx) => (
                    <View key={pIdx} style={styles.safetyPillarItem}>
                      <Ionicons name={pillar.icon as any} size={18} color="#047857" />
                      <View style={styles.safetyPillarTexts}>
                        <Text style={styles.safetyPillarTitle}>{pillar.title}</Text>
                        <Text style={styles.safetyPillarDesc}>{pillar.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Frequently Asked Questions */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                  {SERVICE_FAQS.map((faq, fIdx) => (
                    <ServiceFaqItem
                      key={fIdx}
                      faq={faq}
                      isOpen={openFaqIndex === fIdx}
                      onToggle={() => {
                        if (Platform.OS !== 'web') {
                          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        }
                        setOpenFaqIndex((prev) => (prev === fIdx ? null : fIdx));
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Related Services in Same Category */}
              {relatedServices.length > 0 && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionHeading}>Other {category.name} Services</Text>
                  <Text style={styles.sectionSubText}>
                    Customers also frequently book these related services together:
                  </Text>

                  <View style={styles.relatedGrid}>
                    {relatedServices.map((rel) => {
                      const relQty = cart[rel.id] || 0;
                      return (
                        <Pressable
                          key={rel.id}
                          onPress={() => router.push(`/(customer)/service/${rel.id}`)}
                          style={styles.relatedCard}
                        >
                          <Image source={{ uri: rel.imageUrl }} style={styles.relatedImage} />
                          <View style={styles.relatedBody}>
                            <Text style={styles.relatedTitle} numberOfLines={1}>
                              {rel.name}
                            </Text>
                            <View style={styles.relatedPriceRow}>
                              <Text style={styles.relatedPrice}>
                                {currencyFormatter(rel.price)}
                              </Text>
                              <Text style={styles.relatedDuration}>{rel.duration}</Text>
                            </View>

                            {relQty > 0 ? (
                              <View style={styles.relatedQtyBadge}>
                                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                                <Text style={styles.relatedQtyText}>{relQty} in Cart</Text>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={(e) => {
                                  e.stopPropagation();
                                  addToCart(rel.id);
                                }}
                                style={styles.relatedAddBtn}
                              >
                                <Ionicons name="add" size={14} color={THEME.colors.primary} />
                                <Text style={styles.relatedAddText}>Add</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* ════════ RIGHT COLUMN: DESKTOP STICKY BOOKING CARD ════════ */}
            {isDesktop && (
              <View style={styles.productRightCol}>
                <View style={styles.stickyBookingCard}>
                  <View style={styles.stickyPriceHeader}>
                    <View>
                      <View style={styles.priceRow}>
                        <Text style={styles.desktopPrice}>{currencyFormatter(service.price)}</Text>
                        <Text style={styles.desktopOriginalPrice}>
                          {currencyFormatter(service.originalPrice)}
                        </Text>
                      </View>
                      <Text style={styles.desktopSavingsText}>
                        Save {currencyFormatter(service.originalPrice - service.price)} (
                        {Math.round(
                          ((service.originalPrice - service.price) / service.originalPrice) * 100
                        )}
                        % OFF)
                      </Text>
                    </View>

                    <View style={styles.durationBadge}>
                      <Ionicons name="time" size={13} color="#2563EB" />
                      <Text style={styles.durationBadgeText}>{service.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.bookingCardDivider} />

                  {/* Trust Highlights List */}
                  <View style={styles.bookingPerksList}>
                    <View style={styles.bookingPerkItem}>
                      <Ionicons name="flash" size={15} color="#D97706" />
                      <Text style={styles.bookingPerkText}>
                        Earliest arrival slot in 45-60 mins
                      </Text>
                    </View>
                    <View style={styles.bookingPerkItem}>
                      <Ionicons name="shield-checkmark" size={15} color="#059669" />
                      <Text style={styles.bookingPerkText}>
                        30-Day Free Revisit Guarantee included
                      </Text>
                    </View>
                    <View style={styles.bookingPerkItem}>
                      <Ionicons name="wallet-outline" size={15} color="#2563EB" />
                      <Text style={styles.bookingPerkText}>
                        Pay after service (UPI, Cards, Cash)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingCardDivider} />

                  {/* Cart Action Buttons */}
                  {serviceQty > 0 ? (
                    <View style={styles.desktopCartActions}>
                      <View style={styles.desktopQtyControl}>
                        <TouchableOpacity
                          onPress={() => removeFromCart(service.id)}
                          style={styles.desktopQtyBtn}
                        >
                          <Ionicons name="remove" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.desktopQtyVal}>{serviceQty} in Cart</Text>
                        <TouchableOpacity
                          onPress={() => addToCart(service.id)}
                          style={styles.desktopQtyBtn}
                        >
                          <Ionicons name="add" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => router.push('/(customer)/checkout')}
                        style={styles.desktopCheckoutBtn}
                        activeOpacity={0.88}
                      >
                        <Text style={styles.desktopCheckoutText}>Proceed to Checkout</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleAddToCart}
                      style={styles.desktopAddBtn}
                      activeOpacity={0.88}
                    >
                      <Ionicons name="cart" size={18} color="#FFFFFF" />
                      <Text style={styles.desktopAddBtnText}>Add Service to Cart</Text>
                    </TouchableOpacity>
                  )}

                  {/* Total cart notification note */}
                  {totalCartCount > 0 && (
                    <TouchableOpacity
                      onPress={() => router.push('/(customer)/checkout')}
                      style={styles.activeCartPill}
                    >
                      <Ionicons name="bag-check" size={14} color="#059669" />
                      <Text style={styles.activeCartText}>
                        You have {totalCartCount} item(s) in cart • View Checkout →
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ════════ MOBILE FIXED BOTTOM BAR ════════ */}
      {!isDesktop && (
        <View style={styles.mobileFixedBar}>
          <View style={styles.mobileFixedLeft}>
            <Text style={styles.mobileFixedLabel}>Total Price</Text>
            <View style={styles.mobileFixedPriceRow}>
              <Text style={styles.mobileFixedPrice}>{currencyFormatter(service.price)}</Text>
              <Text style={styles.mobileFixedOriginal}>
                {currencyFormatter(service.originalPrice)}
              </Text>
            </View>
          </View>

          <View style={styles.mobileFixedRight}>
            {serviceQty > 0 ? (
              <TouchableOpacity
                onPress={() => router.push('/(customer)/checkout')}
                style={styles.mobileFixedCheckoutBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.mobileFixedCheckoutText}>View Cart ({serviceQty})</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleAddToCart}
                style={styles.mobileFixedAddBtn}
                activeOpacity={0.88}
              >
                <Ionicons name="cart" size={16} color="#FFFFFF" />
                <Text style={styles.mobileFixedAddText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrap: {
    paddingBottom: 90,
  },
  mainInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  breadcrumbLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  breadcrumbLink: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  breadcrumbSep: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  breadcrumbActive: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '700',
    maxWidth: 240,
  },
  productLayout: {
    width: '100%',
    gap: 32,
  },
  productLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productLayoutMobile: {
    flexDirection: 'column',
  },
  productLeftCol: {
    flex: 1,
  },
  productLeftColDesktop: {
    maxWidth: 760,
  },
  productLeftColMobile: {
    width: '100%',
  },
  productHeroImageCard: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  productHeroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productPopularBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productPopularBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  productCategoryPill: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productCategoryPillText: {
    color: '#0F172A',
    fontSize: 11.5,
    fontWeight: '800',
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
    lineHeight: 34,
  },
  productTagline: {
    fontSize: 14.5,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  productMetaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  ratingScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingScoreText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
  },
  ratingCountText: {
    fontSize: 11.5,
    color: '#78350F',
    fontWeight: '600',
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
  },
  metaTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaTimeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  warrantyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  warrantyPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  mobilePriceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  mainPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  mainOriginalPrice: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  savingsTag: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    padding: 3,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    paddingHorizontal: 8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 22,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionSubText: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionDescText: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 23,
    fontWeight: '400',
  },
  includesList: {
    gap: 12,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  includeIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  includeText: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    lineHeight: 20,
    fontWeight: '500',
  },
  exclusionsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 20,
    marginBottom: 20,
  },
  exclusionsHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
  },
  exclusionsList: {
    gap: 10,
    marginTop: 10,
  },
  exclusionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  exclusionText: {
    flex: 1,
    fontSize: 12.5,
    color: '#78350F',
    lineHeight: 18,
    fontWeight: '500',
  },
  safetyGuaranteeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: 22,
    marginBottom: 20,
  },
  safetyTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  safetyEmblem: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  safetyTopTexts: {
    flex: 1,
  },
  safetyTopTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#065F46',
  },
  safetyTopSub: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  safetyPillarsGrid: {
    gap: 12,
  },
  safetyPillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  safetyPillarTexts: {
    flex: 1,
  },
  safetyPillarTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  safetyPillarDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  faqList: {
    gap: 10,
    marginTop: 6,
  },
  faqCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    transition: 'border-color 0.25s ease, background-color 0.25s ease',
  } as any,
  faqCardOpen: {
    backgroundColor: '#FFFFFF',
    borderColor: '#93C5FD',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    cursor: 'pointer',
  } as any,
  faqQuestion: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 10,
    transition: 'color 0.25s ease',
  } as any,
  faqQuestionOpen: {
    color: '#1D4ED8',
  },
  faqBody: {
    paddingHorizontal: 14,
    borderTopColor: '#F1F5F9',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  relatedCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flex: 1,
    minWidth: 200,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 110,
  },
  relatedBody: {
    padding: 12,
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  relatedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  relatedDuration: {
    fontSize: 11,
    color: '#64748B',
  },
  relatedAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 6,
    borderRadius: 8,
  },
  relatedAddText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  relatedQtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    borderRadius: 8,
  },
  relatedQtyText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },

  /* ════════ RIGHT COLUMN: DESKTOP STICKY BOOKING CARD ════════ */
  productRightCol: {
    width: 360,
    alignSelf: 'flex-start',
    position: (Platform.OS === 'web' ? 'sticky' : 'relative') as any,
    top: 24,
    zIndex: 20,
  },
  stickyBookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    position: (Platform.OS === 'web' ? 'sticky' : 'relative') as any,
    top: 24,
  },
  stickyPriceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  desktopPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  desktopOriginalPrice: {
    fontSize: 16,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  desktopSavingsText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  durationBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E40AF',
  },
  bookingCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
  bookingPerksList: {
    gap: 12,
  },
  bookingPerkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookingPerkText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  desktopCartActions: {
    gap: 10,
  },
  desktopQtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    padding: 6,
  },
  desktopQtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  desktopQtyVal: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  desktopCheckoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  desktopCheckoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  desktopAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  desktopAddBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  activeCartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activeCartText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#047857',
  },

  /* ════════ MOBILE FIXED BOTTOM BAR ════════ */
  mobileFixedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  mobileFixedLeft: {
    justifyContent: 'center',
  },
  mobileFixedLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mobileFixedPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  mobileFixedPrice: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
  },
  mobileFixedOriginal: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  mobileFixedRight: {
    minWidth: 140,
  },
  mobileFixedAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mobileFixedAddText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  mobileFixedCheckoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mobileFixedCheckoutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
