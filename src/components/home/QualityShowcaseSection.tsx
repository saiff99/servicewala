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
import { THEME, currencyFormatter } from '../../constants/theme';
import { useEcosystemStore } from '../../store/useEcosystemStore';

interface TransformationMetric {
  label: string;
  value: string;
  isAlert?: boolean;
  isSuccess?: boolean;
}

interface TransformationItem {
  id: string;
  serviceId: string;
  tabLabel: string;
  tabIcon: string;
  categoryName: string;
  title: string;
  tagline: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  badge: string;
  deltaHighlight: string;
  before: {
    badge: string;
    headline: string;
    description: string;
    metrics: TransformationMetric[];
    symptoms: string[];
  };
  after: {
    badge: string;
    headline: string;
    description: string;
    metrics: TransformationMetric[];
    benefits: string[];
  };
  technicianProof: string;
}

const TRANSFORMATION_ITEMS: TransformationItem[] = [
  {
    id: 'srv-ac-deep',
    serviceId: 'srv-ac-deep',
    tabLabel: 'AC Power Jet Wash',
    tabIcon: 'snow-outline',
    categoryName: 'Air Conditioner & Appliances',
    title: 'Power Jet AC Servicing & Sanitization',
    tagline: 'Restores clogged cooling coils, eliminates foul mold, and reduces electricity load',
    duration: '45 mins',
    rating: 4.87,
    reviewCount: 1420,
    price: 599,
    originalPrice: 899,
    badge: 'Bestseller Quality Restoration',
    deltaHighlight: '26°C ➔ 14.5°C (-44% Heat)',
    before: {
      badge: 'BEFORE SERVICE: CHOKED COIL & HEAT',
      headline: 'Choked Fins, Bacterial Mold & 9.4A High Load',
      description:
        'Thick layer of dust, lint, and pet dander blocking cooling fins, forcing the compressor into thermal overload.',
      metrics: [
        { label: 'Cooling Air Output', value: '26.2°C (Lukewarm)', isAlert: true },
        { label: 'Coil Airflow Speed', value: '1.8 m/s (Choked)', isAlert: true },
        { label: 'Compressor Draw', value: '9.4 Amps (Overload)', isAlert: true },
      ],
      symptoms: [
        'Foul musty odor when AC starts up',
        'Takes over 40 mins to cool the bedroom',
        'Compressor cuts off abruptly in peak heat',
      ],
    },
    after: {
      badge: 'AFTER SERVICEWALA: 100% FACTORY FRESH',
      headline: '150-Bar Jet Washed & Sanitized Chilled Air',
      description:
        'Deep high-pressure hydro-jet wash with German anti-bacterial foam dissolves 100% sludge and unclogs drain tray.',
      metrics: [
        { label: 'Cooling Air Output', value: '14.5°C (Chilled Air)', isSuccess: true },
        { label: 'Coil Airflow Speed', value: '4.6 m/s (+155% Boost)', isSuccess: true },
        { label: 'Compressor Draw', value: '6.1 Amps (Optimal)', isSuccess: true },
      ],
      benefits: [
        'Pure, odorless hospital-grade sanitized air',
        'Room chills completely in under 12 minutes',
        'Saves up to ₹850/month in power bills',
      ],
    },
    technicianProof: '150-bar German pressure washer • OEM anti-fungal foam • 30-day rework warranty',
  },
  {
    id: 'srv-laptop-chip',
    serviceId: 'srv-laptop-chip',
    tabLabel: 'Laptop Thermal Fix',
    tabIcon: 'laptop-outline',
    categoryName: 'Computers & Laptops',
    title: 'Laptop & MacBook Thermal Overhaul & Fan Clean',
    tagline: 'Eliminates 96°C thermal throttling with Arctic MX-4 paste and ultra-sonic fan de-dusting',
    duration: '60 mins',
    rating: 4.89,
    reviewCount: 940,
    price: 499,
    originalPrice: 899,
    badge: 'Hardware Specialist Pick',
    deltaHighlight: '96.4°C ➔ 51.8°C (-45°C Drop)',
    before: {
      badge: 'BEFORE SERVICE: 96°C THERMAL THROTTLE',
      headline: 'Hardened Dry Paste & Shrieking High Fan',
      description:
        'Dried-out thermal paste and thick carpet of dust choking the heatsink radiator, causing severe FPS drops.',
      metrics: [
        { label: 'Peak CPU Core Temp', value: '96.4°C (Throttling)', isAlert: true },
        { label: 'Fan Exhaust Noise', value: '58 dB (Loud Whine)', isAlert: true },
        { label: 'Clock Speed Throttle', value: 'Down by 42%', isAlert: true },
      ],
      symptoms: [
        'Keyboard and palmrest uncomfortably hot',
        'Sudden lag & freezing during Zoom/Teams calls',
        'Battery drains rapidly due to constant fan blast',
      ],
    },
    after: {
      badge: 'AFTER SERVICEWALA: 52°C WHISPER QUIET',
      headline: 'Arctic MX-4 Compound & Calibrated Dual Fans',
      description:
        'Surfaces cleaned with 99% pure isopropyl alcohol, high-viscosity Arctic MX-4 applied, and fans lubricated.',
      metrics: [
        { label: 'Peak CPU Core Temp', value: '51.8°C (-45°C Drop)', isSuccess: true },
        { label: 'Fan Exhaust Noise', value: '23 dB (Whisper Silent)', isSuccess: true },
        { label: 'Benchmark Speed', value: '100% Full Performance', isSuccess: true },
      ],
      benefits: [
        'Immediate 45°C temperature drop under load',
        'Completely silent dual fan operation',
        'Restores full clock speed & battery longevity',
      ],
    },
    technicianProof: 'ESD-safe anti-static workstation • Arctic MX-4 compound • 90-day parts warranty',
  },
  {
    id: 'srv-chimney-repair',
    serviceId: 'srv-chimney-repair',
    tabLabel: 'Kitchen Chimney Clean',
    tabIcon: 'restaurant-outline',
    categoryName: 'Kitchen Appliances',
    title: 'Auto-Clean Chimney Deep Degreasing & Blower Wash',
    tagline: 'Dissolves hardened grease sludge, unclogs baffle filters, and restores 1200 m³/hr suction',
    duration: '60 mins',
    rating: 4.78,
    reviewCount: 380,
    price: 499,
    originalPrice: 799,
    badge: 'Heavy Grime Elimination',
    deltaHighlight: '480 ➔ 1210 m³/hr (+152% Draft)',
    before: {
      badge: 'BEFORE SERVICE: OIL SLUDGE & SMOKE CHOKE',
      headline: 'Choked Baffle Filters & Oil Dripping on Stove',
      description:
        'Heavy grease deposits choking the centrifugal blower, causing oily kitchen tiles and smoke backdraft.',
      metrics: [
        { label: 'Actual Suction Draft', value: '480 m³/hr (Choked)', isAlert: true },
        { label: 'Motor Wattage Strain', value: '185W (Overheating)', isAlert: true },
        { label: 'Oil Trap Chamber', value: 'Overflowing Sludge', isAlert: true },
      ],
      symptoms: [
        'Cooking smoke lingers throughout the house',
        'Black sticky oil drops onto food & stove',
        'Loud rattling vibration from unbalanced motor',
      ],
    },
    after: {
      badge: 'AFTER SERVICEWALA: 1200 M³/HR FACTORY DRAFT',
      headline: 'Food-Grade Chemical Wash & Balanced Rotor',
      description:
        'Non-toxic organic degreaser chemical soak dissolves 100% stubborn carbon grease; blower rotor dynamically balanced.',
      metrics: [
        { label: 'Actual Suction Draft', value: '1,210 m³/hr (Peak)', isSuccess: true },
        { label: 'Motor Wattage Strain', value: '122W (Efficient)', isSuccess: true },
        { label: 'Oil Trap Chamber', value: 'Spotless Stainless Shine', isSuccess: true },
      ],
      benefits: [
        'Instant smoke evacuation within 5 seconds',
        'Mirror-clean baffle filters & odorless kitchen',
        'Completely eliminates chimney fire hazard',
      ],
    },
    technicianProof: '100% food-grade eco degreaser • Zero metal corrosion • Motor balance certified',
  },
  {
    id: 'srv-rep-switchboard',
    serviceId: 'srv-rep-switchboard',
    tabLabel: 'Electrical DB Upgrade',
    tabIcon: 'flash-outline',
    categoryName: 'Home Electrical Safety',
    title: 'Main Distribution Box & Smart MCB Rewiring Upgrade',
    tagline: 'Upgrades loose tangled fuse boxes to certified Schneider DIN-rail circuit breaker units',
    duration: '35 mins',
    rating: 4.83,
    reviewCount: 1890,
    price: 249,
    originalPrice: 399,
    badge: 'Essential Home Safety',
    deltaHighlight: 'Spark Risk ➔ Certified Fire-Safe',
    before: {
      badge: 'BEFORE SERVICE: LOOSE WIRES & SPARK RISK',
      headline: 'Charred Copper Cables & Frequent Tripping',
      description:
        'Sub-standard, overloaded porcelain fuses and charred copper cables posing severe electrical fire hazard.',
      metrics: [
        { label: 'Terminal Connection Temp', value: '78°C (Charring Hot)', isAlert: true },
        { label: 'Trip Reaction Speed', value: 'Slow Fuse Wire (Lag)', isAlert: true },
        { label: 'Shock Protection (RCCB)', value: 'None (Hazardous)', isAlert: true },
      ],
      symptoms: [
        'Burning plastic smell during peak AC usage',
        'Unprovoked power trips during rain or surges',
        'Naked copper joints exposed inside metal box',
      ],
    },
    after: {
      badge: 'AFTER SERVICEWALA: IS 8828 CERTIFIED PANEL',
      headline: 'Neat Ferruled Cable-Managed DIN-Rail Box',
      description:
        'Certified C-curve MCBs and 30mA RCCB shock protector fitted with heat-shrink sleeves and neat cable combs.',
      metrics: [
        { label: 'Terminal Connection Temp', value: '29°C (Cool & Stable)', isSuccess: true },
        { label: 'Trip Reaction Speed', value: '< 2.5 Milliseconds', isSuccess: true },
        { label: 'Shock Protection (RCCB)', value: '30mA Human Safe', isSuccess: true },
      ],
      benefits: [
        'Certified zero-spark & fire-resistant panel',
        'Instant millisecond cutoff on short-circuits',
        'Clear phase labeling for every room in the house',
      ],
    },
    technicianProof: 'Grade-A licensed wireman • Megger insulation tested • IS 8828 compliant hardware',
  },
];

export default function QualityShowcaseSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const { cart, addToCart, removeFromCart } = useEcosystemStore();

  const [selectedTransformId, setSelectedTransformId] = useState<string>('srv-ac-deep');
  const [hoveredTransformTabId, setHoveredTransformTabId] = useState<string | null>(null);
  const [hoveredTransformCardId, setHoveredTransformCardId] = useState<string | null>(null);

  const currentItem =
    TRANSFORMATION_ITEMS.find((t) => t.id === selectedTransformId) || TRANSFORMATION_ITEMS[0];
  const serviceQty = cart[currentItem.serviceId] || 0;

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.transformationHeaderPill}>
            <Ionicons name="git-compare-outline" size={13} color="#059669" />
            <Text style={styles.transformationHeaderPillText}>
              VERIFIED CRAFTSMANSHIP • BEFORE & AFTER RESULTS
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Real Transformations, Measurable Results</Text>
          <Text style={styles.sectionSub}>
            See how our certified specialists restore appliances and gadgets to peak factory performance with verified thermal, airflow, and safety metrics
          </Text>
        </View>
      </View>

      {/* ── Category Filter Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.transformationTabsScroll}
      >
        {TRANSFORMATION_ITEMS.map((item) => {
          const isSelected = selectedTransformId === item.id;
          const isHovered = hoveredTransformTabId === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedTransformId(item.id)}
              onHoverIn={() => setHoveredTransformTabId(item.id)}
              onHoverOut={() => setHoveredTransformTabId(null)}
              style={[
                styles.transformationTabBtn,
                isSelected && styles.transformationTabBtnActive,
                isHovered && !isSelected && styles.transformationTabBtnHovered,
              ]}
            >
              <Ionicons
                name={item.tabIcon as any}
                size={16}
                color={isSelected ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.transformationTabBtnText,
                  isSelected && styles.transformationTabBtnTextActive,
                ]}
              >
                {item.tabLabel}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Master Transformation Spotlight Card ── */}
      <View style={styles.transformMasterCard}>
        {/* Master Card Top Header Bar */}
        <View
          style={[
            styles.transformMasterHeaderRow,
            isDesktop ? styles.transformMasterHeaderRowDesktop : styles.transformMasterHeaderRowMobile,
          ]}
        >
          <View style={styles.transformMasterHeaderLeft}>
            <View style={styles.transformMasterBadgeRow}>
              <View style={styles.transformCategoryPill}>
                <Text style={styles.transformCategoryPillText}>{currentItem.categoryName}</Text>
              </View>
              <View style={styles.transformHighlightPill}>
                <Ionicons name="sparkles" size={11} color="#D97706" />
                <Text style={styles.transformHighlightPillText}>{currentItem.badge}</Text>
              </View>
            </View>
            <Text style={styles.transformMasterTitle}>{currentItem.title}</Text>
            <Text style={styles.transformMasterTagline}>{currentItem.tagline}</Text>
          </View>

          <View
            style={[
              styles.transformMasterHeaderRight,
              isDesktop ? styles.transformMasterHeaderRightDesktop : styles.transformMasterHeaderRightMobile,
            ]}
          >
            <View style={styles.transformMasterStatsWrap}>
              <View style={styles.transformStatItem}>
                <View style={styles.transformStatStarRow}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.transformStatStarScore}>{currentItem.rating}</Text>
                </View>
                <Text style={styles.transformStatCount}>({currentItem.reviewCount} reviews)</Text>
              </View>
              <View style={styles.transformStatDivider} />
              <View style={styles.transformStatItem}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.transformStatDuration}>{currentItem.duration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Master Comparison Split Columns (Before vs After) */}
        <View
          style={[
            styles.transformSplitWrap,
            isDesktop ? styles.transformSplitWrapDesktop : styles.transformSplitWrapMobile,
          ]}
        >
          {/* ── LEFT: BEFORE REPAIR ── */}
          <View
            style={[
              styles.transformColBefore,
              isDesktop ? styles.transformColDesktop : styles.transformColMobile,
            ]}
          >
            <View style={styles.transformColTopRow}>
              <View style={styles.transformBeforePill}>
                <Ionicons name="close-circle" size={13} color="#BE123C" />
                <Text style={styles.transformBeforePillText}>{currentItem.before.badge}</Text>
              </View>
              <View style={styles.transformStatusIndicatorRed} />
            </View>

            <Text style={styles.transformProblemHeadline}>{currentItem.before.headline}</Text>
            <Text style={styles.transformProblemDesc}>{currentItem.before.description}</Text>

            {/* Problem Metrics Chips */}
            <View style={styles.transformMetricsList}>
              {currentItem.before.metrics.map((m, idx) => (
                <View key={idx} style={styles.transformMetricChipBefore}>
                  <Ionicons name="alert-circle-outline" size={14} color="#E11D48" />
                  <View style={styles.transformMetricTexts}>
                    <Text style={styles.transformMetricLabelBefore}>{m.label}</Text>
                    <Text style={styles.transformMetricValueBefore}>{m.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Symptoms Checklist */}
            <View style={styles.transformChecklistBefore}>
              <Text style={styles.transformChecklistTitleBefore}>Reported Customer Symptoms:</Text>
              {currentItem.before.symptoms.map((symptom, sIdx) => (
                <View key={sIdx} style={styles.transformCheckItem}>
                  <Ionicons name="close-circle-outline" size={14} color="#E11D48" />
                  <Text style={styles.transformCheckTextBefore}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── CENTER TRANSFORMATION BADGE ── */}
          <View
            style={[
              styles.transformCenterWrap,
              isDesktop ? styles.transformCenterWrapDesktop : styles.transformCenterWrapMobile,
            ]}
          >
            <View style={styles.transformCenterCircle}>
              <Ionicons
                name={isDesktop ? 'arrow-forward' : 'arrow-down'}
                size={20}
                color="#059669"
              />
            </View>
            <Text style={styles.transformCenterText}>SERVICEWALA{'\n'}RESTORE</Text>
          </View>

          {/* ── RIGHT: AFTER PRO FIX ── */}
          <View
            style={[
              styles.transformColAfter,
              isDesktop ? styles.transformColDesktop : styles.transformColMobile,
            ]}
          >
            <View style={styles.transformColTopRow}>
              <View style={styles.transformAfterPill}>
                <Ionicons name="checkmark-circle" size={13} color="#047857" />
                <Text style={styles.transformAfterPillText}>{currentItem.after.badge}</Text>
              </View>
              <View style={styles.transformStatusIndicatorGreen} />
            </View>

            <Text style={styles.transformSolutionHeadline}>{currentItem.after.headline}</Text>
            <Text style={styles.transformSolutionDesc}>{currentItem.after.description}</Text>

            {/* Restored Metrics Chips */}
            <View style={styles.transformMetricsList}>
              {currentItem.after.metrics.map((m, idx) => (
                <View key={idx} style={styles.transformMetricChipAfter}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <View style={styles.transformMetricTexts}>
                    <Text style={styles.transformMetricLabelAfter}>{m.label}</Text>
                    <Text style={styles.transformMetricValueAfter}>{m.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Verified Benefits Checklist */}
            <View style={styles.transformChecklistAfter}>
              <Text style={styles.transformChecklistTitleAfter}>Verified Craftsmanship Results:</Text>
              {currentItem.after.benefits.map((benefit, bIdx) => (
                <View key={bIdx} style={styles.transformCheckItem}>
                  <Ionicons name="checkmark-done" size={14} color="#059669" />
                  <Text style={styles.transformCheckTextAfter}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Master Card Bottom Action & Pricing Bar */}
        <View
          style={[
            styles.transformMasterBottomBar,
            isDesktop ? styles.transformMasterBottomBarDesktop : styles.transformMasterBottomBarMobile,
          ]}
        >
          <View style={styles.transformMasterBottomLeft}>
            <Ionicons name="shield-checkmark" size={17} color="#059669" />
            <Text style={styles.transformTechnicianProofText}>{currentItem.technicianProof}</Text>
          </View>

          <View style={styles.transformMasterBottomRight}>
            <View style={styles.transformPriceWrap}>
              <View style={styles.transformPriceRow}>
                <Text style={styles.transformCurrentPrice}>{currencyFormatter(currentItem.price)}</Text>
                <Text style={styles.transformOriginalPrice}>
                  {currencyFormatter(currentItem.originalPrice)}
                </Text>
              </View>
              <Text style={styles.transformSavingsText}>
                Save {currencyFormatter(currentItem.originalPrice - currentItem.price)}
              </Text>
            </View>

            {/* Cart Action Button */}
            {serviceQty > 0 ? (
              <View style={styles.transformQtyControl}>
                <TouchableOpacity
                  onPress={() => removeFromCart(currentItem.serviceId)}
                  style={styles.transformQtyBtn}
                >
                  <Ionicons name="remove" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.transformQtyText}>{serviceQty} in Cart</Text>
                <TouchableOpacity
                  onPress={() => addToCart(currentItem.serviceId)}
                  style={styles.transformQtyBtn}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => addToCart(currentItem.serviceId)}
                style={styles.transformBookBtn}
                activeOpacity={0.88}
              >
                <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                <Text style={styles.transformBookBtnText}>Book This Service</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* ── 4 Quick Transformation Selector Cards ── */}
      <View style={styles.transformCardsGrid}>
        {TRANSFORMATION_ITEMS.map((item) => {
          const isSelected = selectedTransformId === item.id;
          const isHovered = hoveredTransformCardId === item.id;
          return (
            <Pressable
              key={`preview-${item.id}`}
              onPress={() => setSelectedTransformId(item.id)}
              onHoverIn={() => setHoveredTransformCardId(item.id)}
              onHoverOut={() => setHoveredTransformCardId(null)}
              style={[
                styles.transformPreviewCard,
                isDesktop
                  ? styles.transformPreviewCardDesktop
                  : width < 640
                  ? styles.transformPreviewCardMobile
                  : styles.transformPreviewCardTablet,
                isSelected && styles.transformPreviewCardSelected,
                isHovered && !isSelected && styles.transformPreviewCardHovered,
              ]}
            >
              <View style={styles.transformPreviewTopRow}>
                <View
                  style={[
                    styles.transformPreviewIconWrap,
                    isSelected && styles.transformPreviewIconWrapSelected,
                  ]}
                >
                  <Ionicons
                    name={item.tabIcon as any}
                    size={18}
                    color={isSelected ? '#FFFFFF' : '#0F172A'}
                  />
                </View>
                <View style={styles.transformPreviewDeltaBadge}>
                  <Text style={styles.transformPreviewDeltaText} numberOfLines={1}>
                    {item.deltaHighlight}
                  </Text>
                </View>
              </View>

              <Text style={styles.transformPreviewTitle} numberOfLines={1}>
                {item.tabLabel}
              </Text>

              <View style={styles.transformPreviewBottomRow}>
                <Text style={styles.transformPreviewPrice}>
                  From {currencyFormatter(item.price)}
                </Text>
                <View style={styles.transformPreviewArrowWrap}>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
                    size={15}
                    color={isSelected ? '#059669' : '#94A3B8'}
                  />
                </View>
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
  transformationHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  transformationHeaderPillText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  transformationTabsScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
    marginBottom: 20,
  },
  transformationTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    transition: 'all 0.2s ease',
  } as any,
  transformationTabBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  transformationTabBtnHovered: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    transform: [{ translateY: -1 }],
  } as any,
  transformationTabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  transformationTabBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Master Spotlight Card */
  transformMasterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 26,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  transformMasterHeaderRow: {
    gap: 16,
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transformMasterHeaderRowDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  transformMasterHeaderRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  transformMasterHeaderLeft: {
    flex: 1,
    maxWidth: 760,
  },
  transformMasterBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  transformCategoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  transformCategoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  transformHighlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  transformHighlightPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  transformMasterTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  transformMasterTagline: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  transformMasterHeaderRight: {
    flexShrink: 0,
  },
  transformMasterHeaderRightDesktop: {
    alignItems: 'flex-end',
  },
  transformMasterHeaderRightMobile: {
    alignSelf: 'stretch',
  },
  transformMasterStatsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  transformStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transformStatStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  transformStatStarScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  transformStatCount: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  transformStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
  },
  transformStatDuration: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },

  /* Master Comparison Split Columns */
  transformSplitWrap: {
    gap: 16,
    alignItems: 'stretch',
    marginBottom: 22,
  },
  transformSplitWrapDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transformSplitWrapMobile: {
    flexDirection: 'column',
  },
  transformColDesktop: {
    flex: 1,
  },
  transformColMobile: {
    width: '100%',
  },
  transformColBefore: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    padding: 22,
  },
  transformColAfter: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    padding: 22,
  },
  transformColTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transformBeforePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDA4AF',
  },
  transformBeforePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE123C',
    letterSpacing: 0.5,
  },
  transformStatusIndicatorRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
  },
  transformAfterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  transformAfterPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  transformStatusIndicatorGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  transformProblemHeadline: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#9F1239',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  transformProblemDesc: {
    fontSize: 13,
    color: '#881337',
    lineHeight: 19,
    marginBottom: 16,
  },
  transformSolutionHeadline: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  transformSolutionDesc: {
    fontSize: 13,
    color: '#064E3B',
    lineHeight: 19,
    marginBottom: 16,
  },
  transformMetricsList: {
    gap: 8,
    marginBottom: 16,
  },
  transformMetricChipBefore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  transformMetricChipAfter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  transformMetricTexts: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transformMetricLabelBefore: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#9F1239',
  },
  transformMetricValueBefore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#BE123C',
  },
  transformMetricLabelAfter: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#065F46',
  },
  transformMetricValueAfter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  transformChecklistBefore: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    gap: 6,
  },
  transformChecklistTitleBefore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9F1239',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  transformChecklistAfter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: 6,
  },
  transformChecklistTitleAfter: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  transformCheckItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  transformCheckTextBefore: {
    fontSize: 12,
    color: '#881337',
    fontWeight: '500',
    flex: 1,
    lineHeight: 17,
  },
  transformCheckTextAfter: {
    fontSize: 12,
    color: '#064E3B',
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },

  /* Center Connector */
  transformCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  transformCenterWrapDesktop: {
    width: 60,
  },
  transformCenterWrapMobile: {
    width: '100%',
    paddingVertical: 4,
  },
  transformCenterCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  transformCenterText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },

  /* Master Bottom Bar */
  transformMasterBottomBar: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  transformMasterBottomBarDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transformMasterBottomBarMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  transformMasterBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  transformTechnicianProofText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
  },
  transformMasterBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  transformPriceWrap: {
    alignItems: 'flex-end',
  },
  transformPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  transformCurrentPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  transformOriginalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  transformSavingsText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  transformBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  transformBookBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  transformQtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  transformQtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  transformQtyText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12.5,
    paddingHorizontal: 6,
  },

  /* 4 Quick Transformation Selector Cards */
  transformCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  transformPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    justifyContent: 'space-between',
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  transformPreviewCardDesktop: {
    flex: 1,
    minWidth: 220,
  },
  transformPreviewCardTablet: {
    width: '48.5%',
  },
  transformPreviewCardMobile: {
    width: '100%',
  },
  transformPreviewCardSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
    transform: [{ translateY: -2 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  transformPreviewCardHovered: {
    borderColor: '#CBD5E1',
    transform: [{ translateY: -2 }],
  } as any,
  transformPreviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transformPreviewIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transformPreviewIconWrapSelected: {
    backgroundColor: '#0F172A',
  },
  transformPreviewDeltaBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    maxWidth: 160,
  },
  transformPreviewDeltaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  transformPreviewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  transformPreviewBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  transformPreviewPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  transformPreviewArrowWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

