import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, currencyFormatter } from '../../constants/theme';
import { useEcosystemStore } from '../../store/useEcosystemStore';

/* ─── Diagnostic Topics ─── */
interface HelpIssue {
  id: string;
  icon: string;
  label: string;
  category: string;
  diagnosis: string;
  recommendedService: string;
  serviceId: string;
  price: number;
}

const QUICK_HELP_ISSUES: HelpIssue[] = [
  {
    id: 'ac-issue',
    icon: 'snow-outline',
    label: 'AC not cooling / water leakage',
    category: 'Air Conditioners',
    diagnosis: 'Commonly caused by choked cooling coils, blocked condensate drain tray, or refrigerant pressure drop.',
    recommendedService: 'Power Jet AC Servicing & Deep Sanitization',
    serviceId: 'srv-ac-deep',
    price: 599,
  },
  {
    id: 'laptop-issue',
    icon: 'laptop-outline',
    label: 'Laptop overheating / fan noise / lag',
    category: 'Computers & Laptops',
    diagnosis: 'Hardened 2+ year dry thermal paste and dust clogging dual heatpipes, forcing severe thermal throttling.',
    recommendedService: 'Laptop Thermal Paste Repaste & Fan Overhaul',
    serviceId: 'srv-laptop-chip',
    price: 499,
  },
  {
    id: 'elec-issue',
    icon: 'flash-outline',
    label: 'MCB tripping / burning wire smell',
    category: 'Electrical Safety',
    diagnosis: 'Loose charred copper terminal joints or overloaded phase lines. Requires immediate fire-safety inspection.',
    recommendedService: 'Distribution Board & Smart MCB Rewiring',
    serviceId: 'srv-rep-switchboard',
    price: 249,
  },
  {
    id: 'chimney-issue',
    icon: 'restaurant-outline',
    label: 'Chimney suction loss / oil dripping',
    category: 'Kitchen Appliances',
    diagnosis: 'Heavy grease sludge accumulation choking the centrifugal rotor blades and oil baffle filtration channel.',
    recommendedService: 'Kitchen Chimney Deep Degreasing & Blower Wash',
    serviceId: 'srv-chimney-repair',
    price: 499,
  },
];

interface FloatingHelpCapsuleProps {
  onScrollToServices?: () => void;
}

export default function FloatingHelpCapsule({ onScrollToServices }: FloatingHelpCapsuleProps) {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const router = useRouter();
  const pathname = usePathname();
  const { cart, addToCart } = useEcosystemStore();

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const isProductPage = Boolean(pathname && pathname.includes('/service'));
  const hasFloatingCart = totalCartCount > 0 && !(pathname && pathname.includes('/checkout'));

  const scrollViewRef = useRef<any>(null);
  const phoneInputRef = useRef<any>(null);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedHelpIssueId, setSelectedHelpIssueId] = useState<string | null>(null);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [isCallbackSubmitted, setIsCallbackSubmitted] = useState(false);
  const [isFloatingPillHovered, setIsFloatingPillHovered] = useState(false);

  useEffect(() => {
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsPhoneFocused(false);
    });
    return () => {
      hideSub.remove();
    };
  }, []);

  const handlePhoneFocus = () => {
    setIsPhoneFocused(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handlePhoneBlur = () => {
    setIsPhoneFocused(false);
  };

  const handleDismissKeyboard = () => {
    phoneInputRef.current?.blur();
    Keyboard.dismiss();
    setIsPhoneFocused(false);
  };

  const handleBackdropPress = () => {
    if (isPhoneFocused) {
      handleDismissKeyboard();
      return;
    }
    setIsHelpModalOpen(false);
    setSelectedHelpIssueId(null);
    setIsCallbackSubmitted(false);
  };

  const selectedHelpIssue = useMemo(
    () => QUICK_HELP_ISSUES.find((q) => q.id === selectedHelpIssueId) || null,
    [selectedHelpIssueId]
  );

  const handleBookService = (serviceId: string) => {
    addToCart(serviceId);
    setIsHelpModalOpen(false);
    if (onScrollToServices) {
      onScrollToServices();
    }
  };

  return (
    <>
      {/* Dimmed & Frosted Blurred Backdrop (When Help Modal is Open) */}
      {isHelpModalOpen && (
        <Pressable
          style={styles.helpBackdrop}
          onPress={handleBackdropPress}
          accessibilityLabel="Close help modal backdrop"
        />
      )}

      <View
        style={[
          styles.floatingHelpContainer,
          !isDesktop &&
            (isPhoneFocused
              ? styles.floatingHelpContainerKeyboardMobile
              : hasFloatingCart
              ? styles.floatingHelpContainerWithCartMobile
              : isProductPage
              ? styles.floatingHelpContainerProductMobile
              : styles.floatingHelpContainerMobile),
        ]}
      >
        {/* Flyout Consultation Panel (When Open) */}
        {isHelpModalOpen && (
          <View
            style={[
              styles.helpFlyoutCard,
              isDesktop
                ? styles.helpFlyoutCardDesktop
                : [
                    styles.helpFlyoutCardMobile,
                    {
                      width: Math.min(width - 32, 380),
                      maxHeight: isPhoneFocused
                        ? Math.min(height - 350, 400)
                        : Math.min(height - (isProductPage ? 190 : 120), 565),
                    },
                  ],
            ]}
          >
          {/* Top Bar: Specialist Info & Close Button */}
          <View style={styles.helpFlyoutHeader}>
            <View style={styles.helpFlyoutHeaderLeft}>
              <View style={styles.helpFlyoutAvatarWrap}>
                <Ionicons name="headset" size={16} color="#FFFFFF" />
                <View style={styles.helpFlyoutAvatarPulse} />
              </View>
              <View>
                <View style={styles.helpFlyoutNameRow}>
                  <Text style={styles.helpFlyoutName}>Diagnostic Desk</Text>
                  <View style={styles.helpFlyoutVerifiedBadge}>
                    <Ionicons name="checkmark-circle" size={10} color="#10B981" />
                    <Text style={styles.helpFlyoutVerifiedText}>ONLINE</Text>
                  </View>
                </View>
                <Text style={styles.helpFlyoutSub}>Senior Engineers • Reply in &lt; 45s</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setIsHelpModalOpen(false);
                setSelectedHelpIssueId(null);
                setIsCallbackSubmitted(false);
              }}
              style={styles.helpFlyoutCloseBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Scrollable / Interactive Flyout Body */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.helpFlyoutScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.helpFlyoutScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* If an issue is selected: Show Smart Diagnosis Result */}
            {selectedHelpIssue ? (
              <View style={styles.helpDiagnosisResultWrap}>
                <TouchableOpacity
                  onPress={() => setSelectedHelpIssueId(null)}
                  style={styles.helpBackToTopicsBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={14} color="#64748B" />
                  <Text style={styles.helpBackToTopicsText}>Change Problem Topic</Text>
                </TouchableOpacity>

                <View style={styles.helpDiagnosisCard}>
                  <View style={styles.helpDiagnosisBadgeRow}>
                    <View style={styles.helpDiagnosisCategoryPill}>
                      <Text style={styles.helpDiagnosisCategoryText}>{selectedHelpIssue.category}</Text>
                    </View>
                    <Text style={styles.helpDiagnosisTimeTag}>⚡ Instant Assessment</Text>
                  </View>

                  <Text style={styles.helpDiagnosisTitle}>{selectedHelpIssue.label}</Text>
                  <Text style={styles.helpDiagnosisBody}>{selectedHelpIssue.diagnosis}</Text>

                  {/* Recommended Doorstep Solution Card */}
                  <View style={styles.helpSolutionCard}>
                    <View style={styles.helpSolutionHeader}>
                      <Ionicons name="shield-checkmark" size={14} color="#059669" />
                      <Text style={styles.helpSolutionHeaderText}>RECOMMENDED PRO FIX</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setIsHelpModalOpen(false);
                        router.push(`/(customer)/service/${selectedHelpIssue.serviceId}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.helpSolutionName}>{selectedHelpIssue.recommendedService}</Text>
                      <Text style={styles.helpSolutionViewPageLink}>View full service details & protocol →</Text>
                    </TouchableOpacity>
                    <View style={styles.helpSolutionFooter}>
                      <Text style={styles.helpSolutionPrice}>From {currencyFormatter(selectedHelpIssue.price)}</Text>
                      <TouchableOpacity
                        onPress={() => handleBookService(selectedHelpIssue.serviceId)}
                        style={styles.helpSolutionBookBtn}
                        activeOpacity={0.88}
                      >
                        <Text style={styles.helpSolutionBookText}>
                          {cart[selectedHelpIssue.serviceId] ? 'In Cart • View' : 'Add to Cart'}
                        </Text>
                        <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              /* Problem Selector Menu */
              <View>
                <Text style={styles.helpSectionPrompt}>
                  What can our technical specialists assist you with?
                </Text>

                {/* 4 Quick Diagnosis Chips */}
                <View style={styles.helpIssuesGrid}>
                  {QUICK_HELP_ISSUES.map((issue) => (
                    <TouchableOpacity
                      key={issue.id}
                      onPress={() => setSelectedHelpIssueId(issue.id)}
                      style={styles.helpIssueChip}
                      activeOpacity={0.85}
                    >
                      <View style={styles.helpIssueIconWrap}>
                        <Ionicons name={issue.icon as any} size={15} color="#0F172A" />
                      </View>
                      <Text style={styles.helpIssueLabel}>{issue.label}</Text>
                      <Ionicons name="chevron-forward" size={13} color="#94A3B8" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Instant WhatsApp Consultation Action */}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.open(
                    'https://wa.me/919876543210?text=Hi%20Servicewala%2C%20I%20need%20expert%20help%20choosing%20a%20doorstep%20repair%20service.',
                    '_blank'
                  );
                }
              }}
              style={styles.helpWhatsappBtn}
              activeOpacity={0.88}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <View style={styles.helpWhatsappTexts}>
                <Text style={styles.helpWhatsappTitle}>Chat on WhatsApp with Senior Tech</Text>
                <Text style={styles.helpWhatsappSub}>Share appliance photo for instant diagnosis</Text>
              </View>
            </TouchableOpacity>

            {/* Instant 2-Minute Callback Form */}
            <View style={styles.helpCallbackCard}>
              <View style={styles.helpCallbackHeader}>
                <View style={styles.helpCallbackHeaderLeft}>
                  <Ionicons name="call-outline" size={14} color="#059669" />
                  <Text style={styles.helpCallbackTitle}>Request Free Callback in &lt; 2 Mins</Text>
                </View>
                {isPhoneFocused && (
                  <TouchableOpacity
                    onPress={handleDismissKeyboard}
                    style={styles.helpKeyboardDismissBtn}
                    activeOpacity={0.8}
                    accessibilityLabel="Dismiss keyboard"
                  >
                    <Text style={styles.helpKeyboardDismissText}>Done ✓</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isCallbackSubmitted ? (
                <View style={styles.helpCallbackSuccess}>
                  <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  <Text style={styles.helpCallbackSuccessText}>
                    Callback request received! Senior Specialist Rahul will call {callbackPhone || 'your number'} in &lt; 2 minutes.
                  </Text>
                </View>
              ) : (
                <View style={styles.helpCallbackForm}>
                  <TextInput
                    ref={phoneInputRef}
                    value={callbackPhone}
                    onChangeText={setCallbackPhone}
                    onFocus={handlePhoneFocus}
                    onBlur={handlePhoneBlur}
                    placeholder="Enter 10-digit mobile number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    onSubmitEditing={handleDismissKeyboard}
                    style={styles.helpCallbackInput}
                    maxLength={10}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (callbackPhone.trim().length >= 10) {
                        setIsCallbackSubmitted(true);
                        handleDismissKeyboard();
                      }
                    }}
                    disabled={callbackPhone.trim().length < 10}
                    style={[
                      styles.helpCallbackSubmitBtn,
                      callbackPhone.trim().length < 10 && styles.helpCallbackSubmitBtnDisabled,
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.helpCallbackSubmitText}>Call Me</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Direct Toll-Free Line & Guarantee Ribbon */}
            <View style={styles.helpFooterTrustRow}>
              <View style={styles.helpTollFreePill}>
                <Ionicons name="call" size={11} color="#0F172A" />
                <Text style={styles.helpTollFreeText}>Toll-Free: 1800-120-WALA</Text>
              </View>
              <Text style={styles.helpHoursText}>7 AM – 11 PM Daily • 100% Free</Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Floating Capsule Button (Anchored Pin) */}
      <Pressable
        onPress={() => setIsHelpModalOpen(!isHelpModalOpen)}
        onHoverIn={() => setIsFloatingPillHovered(true)}
        onHoverOut={() => setIsFloatingPillHovered(false)}
        style={[
          styles.floatingPillBtn,
          !isDesktop && styles.floatingPillBtnMobile,
          isHelpModalOpen && styles.floatingPillBtnActive,
          isFloatingPillHovered && styles.floatingPillBtnHovered,
        ]}
        accessibilityLabel={isHelpModalOpen ? 'Close Help' : 'Need Help Chat'}
      >
        {isHelpModalOpen ? (
          <>
            <Ionicons name="close" size={isDesktop ? 18 : 20} color="#FFFFFF" />
            {isDesktop && <Text style={styles.floatingPillText}>Close Help</Text>}
          </>
        ) : isDesktop ? (
          <>
            {/* Desktop Compact Pill */}
            <View style={styles.floatingBeaconWrap}>
              <View style={styles.floatingBeaconDot} />
            </View>

            <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />

            <Text style={styles.floatingPillText}>Need Help?</Text>

            <View style={styles.floatingLiveBadge}>
              <Text style={styles.floatingLiveBadgeText}>LIVE</Text>
            </View>
          </>
        ) : (
          /* Mobile Minimal Icon Button (No Text, Tiny Footprint) */
          <>
            <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
            <View style={styles.mobileFloatingBeaconDot} />
          </>
        )}
      </Pressable>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  helpBackdrop: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }
      : {}),
    zIndex: 100000,
  } as any,
  floatingHelpContainer: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    bottom: 24,
    right: 24,
    zIndex: 100005,
    alignItems: 'flex-end',
    transition: 'bottom 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  floatingHelpContainerMobile: {
    bottom: 74, // Clears mobile bottom navigation bar on home/catalog
    right: 16,
  },
  floatingHelpContainerWithCartMobile: {
    bottom: 136, // Sits cleanly above the sticky View Cart & Checkout button on mobile
    right: 16,
  },
  floatingHelpContainerProductMobile: {
    bottom: 158, // Sits cleanly above the sticky Total Price & Add to Cart action bar on product pages
    right: 16,
  },
  floatingHelpContainerKeyboardMobile: {
    bottom: 290, // Lifts the modal above the mobile virtual numeric keyboard
    right: 16,
  },
  floatingPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  floatingPillBtnMobile: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  mobileFloatingBeaconDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  floatingPillBtnActive: {
    backgroundColor: '#1E293B',
    borderColor: '#64748B',
  },
  floatingPillBtnHovered: {
    backgroundColor: '#1E293B',
    borderColor: '#10B981',
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.35,
    shadowRadius: 22,
  } as any,
  floatingPillText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  floatingBeaconWrap: {
    position: 'relative',
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBeaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  floatingLiveBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  floatingLiveBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 0.6,
  },

  /* Flyout Card Modal */
  helpFlyoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 36,
    elevation: 16,
  },
  helpFlyoutCardDesktop: {
    width: 380,
    maxHeight: 620,
  },
  helpFlyoutCardMobile: {
    width: 340,
    maxHeight: 565,
  },
  helpFlyoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  helpFlyoutHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  helpFlyoutAvatarWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  helpFlyoutAvatarPulse: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  helpFlyoutNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpFlyoutName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helpFlyoutVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  helpFlyoutVerifiedText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  helpFlyoutSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  helpFlyoutCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpFlyoutScroll: {
    maxHeight: 515,
  },
  helpFlyoutScrollContent: {
    padding: 16,
    paddingBottom: 12,
    gap: 12,
  },
  helpSectionPrompt: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    lineHeight: 18,
  },
  helpIssuesGrid: {
    gap: 8,
    marginBottom: 4,
  },
  helpIssueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpIssueIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpIssueLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },

  /* Diagnosis Result View */
  helpDiagnosisResultWrap: {
    gap: 10,
  },
  helpBackToTopicsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  helpBackToTopicsText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  helpDiagnosisCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    gap: 8,
  },
  helpDiagnosisBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpDiagnosisCategoryPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  helpDiagnosisCategoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    textTransform: 'uppercase',
  },
  helpDiagnosisTimeTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  helpDiagnosisTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  helpDiagnosisBody: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 18,
  },
  helpSolutionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 4,
    gap: 4,
  },
  helpSolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpSolutionHeaderText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#047857',
    letterSpacing: 0.5,
  },
  helpSolutionName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  helpSolutionViewPageLink: {
    fontSize: 10.5,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 6,
  },
  helpSolutionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  helpSolutionPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  helpSolutionBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  helpSolutionBookText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* WhatsApp Action */
  helpWhatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  helpWhatsappTexts: {
    flex: 1,
  },
  helpWhatsappTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helpWhatsappSub: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },

  /* 2-Minute Callback Card */
  helpCallbackCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  helpCallbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpCallbackHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpKeyboardDismissBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  helpKeyboardDismissText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.3,
  },
  helpCallbackTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  helpCallbackForm: {
    flexDirection: 'row',
    gap: 6,
  },
  helpCallbackInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#0F172A',
  },
  helpCallbackSubmitBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpCallbackSubmitBtnDisabled: {
    opacity: 0.45,
  },
  helpCallbackSubmitText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helpCallbackSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  helpCallbackSuccessText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },

  /* Footer Trust Row */
  helpFooterTrustRow: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 2,
    paddingBottom: 2,
  },
  helpTollFreePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  helpTollFreeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  helpHoursText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
});

