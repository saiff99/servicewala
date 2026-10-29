import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

export default function AppDownloadBanner() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.appBannerCard}>
        {/* Subtle Ambient Accent Gradient on Web */}
        {Platform.OS === 'web' && <View style={styles.appBannerGlow} pointerEvents="none" />}

        <View
          style={[
            styles.appBannerContent,
            isDesktop ? styles.appBannerContentDesktop : styles.appBannerContentMobile,
          ]}
        >
          {/* Left Column: Headlines, Perks, Store Badges & QR Code */}
          <View
            style={[
              styles.appBannerLeft,
              isDesktop ? styles.appBannerLeftDesktop : styles.appBannerLeftMobile,
            ]}
          >
            <View style={styles.appBannerPill}>
              <Ionicons name="phone-portrait-outline" size={13} color="#2563EB" />
              <Text style={styles.appBannerPillText}>FAST & SECURE MOBILE BOOKING</Text>
            </View>

            <Text style={styles.appBannerTitle}>
              Experience Servicewala on Your Phone
            </Text>

            <Text style={styles.appBannerDesc}>
              Book certified doorstep repairs in 1-tap, track your technician live on GPS map, securely verify OTP, and enjoy instant flat ₹150 discount on your first mobile order.
            </Text>

            {/* 4 App Features Grid */}
            <View style={styles.appPerksGrid}>
              {[
                { icon: 'flash-outline', title: '1-Tap Fast Booking', desc: 'Repeat orders in 10s', color: '#2563EB', bg: '#EFF6FF' },
                { icon: 'navigate-outline', title: 'Live GPS Tracking', desc: 'Real-time arrival meter', color: '#059669', bg: '#ECFDF5' },
                { icon: 'pricetag-outline', title: 'Flat ₹150 OFF', desc: 'Code: APPFIRST', color: '#D97706', bg: '#FFFBEB' },
                { icon: 'shield-checkmark-outline', title: 'Secure OTP Handshake', desc: 'Safe start & end code', color: '#991B1B', bg: '#FEF2F2' },
              ].map((perk, idx) => (
                <View key={idx} style={styles.appPerkCard}>
                  <View style={[styles.appPerkIconWrap, { backgroundColor: perk.bg }]}>
                    <Ionicons name={perk.icon as any} size={16} color={perk.color} />
                  </View>
                  <View style={styles.appPerkTexts}>
                    <Text style={styles.appPerkTitle}>{perk.title}</Text>
                    <Text style={styles.appPerkDesc}>{perk.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Store Download Buttons & QR Code Row */}
            <View
              style={[
                styles.appDownloadRow,
                isDesktop ? styles.appDownloadRowDesktop : styles.appDownloadRowMobile,
              ]}
            >
              {/* Store Badges Column */}
              <View style={styles.storeBadgesCol}>
                <TouchableOpacity
                  style={styles.storeBadgeBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (Platform.OS === 'web' && typeof window !== 'undefined') {
                      window.open('https://play.google.com', '_blank');
                    }
                  }}
                >
                  <Ionicons name="logo-google-playstore" size={20} color="#FFFFFF" />
                  <View style={styles.storeBadgeTexts}>
                    <Text style={styles.storeBadgeSub}>GET IT ON</Text>
                    <Text style={styles.storeBadgeMain}>Google Play</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.storeBadgeBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (Platform.OS === 'web' && typeof window !== 'undefined') {
                      window.open('https://apple.com/app-store', '_blank');
                    }
                  }}
                >
                  <Ionicons name="logo-apple" size={23} color="#FFFFFF" />
                  <View style={styles.storeBadgeTexts}>
                    <Text style={styles.storeBadgeSub}>Download on the</Text>
                    <Text style={styles.storeBadgeMain}>App Store</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* QR Code Scan Capsule */}
              <View style={styles.appQrCard}>
                <View style={styles.appQrWrap}>
                  <Ionicons name="qr-code" size={42} color="#0F172A" />
                </View>
                <View style={styles.appQrInfo}>
                  <Text style={styles.appQrTitle}>Scan to Download</Text>
                  <Text style={styles.appQrSub}>iOS & Android Universal</Text>
                  <View style={styles.appQrRatingRow}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.appQrRatingText}>4.8 • 100k+ downloads</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right Column: Realistic Sleek Smartphone Mockup Frame */}
          <View
            style={[
              styles.appBannerRight,
              isDesktop ? styles.appBannerRightDesktop : styles.appBannerRightMobile,
            ]}
          >
            {/* Floating Live Tracking Badge Top */}
            <View style={styles.phoneFloatingBadgeTop}>
              <Ionicons name="navigate-circle" size={16} color="#059669" />
              <Text style={styles.phoneFloatingBadgeText}>Live GPS Tracking</Text>
            </View>

            {/* Floating Shield Badge Bottom */}
            <View style={styles.phoneFloatingBadgeBottom}>
              <Ionicons name="shield-checkmark" size={16} color="#2563EB" />
              <Text style={styles.phoneFloatingBadgeText}>OTP Verified Visit</Text>
            </View>

            {/* Smartphone Frame Outer */}
            <View style={styles.phoneFrame}>
              {/* Dynamic Island Notch */}
              <View style={styles.phoneDynamicIsland} />

              {/* Status Bar */}
              <View style={styles.phoneStatusBar}>
                <Text style={styles.phoneStatusTime}>9:41</Text>
                <View style={styles.phoneStatusIcons}>
                  <Ionicons name="cellular-outline" size={12} color="#0F172A" />
                  <Ionicons name="wifi-outline" size={12} color="#0F172A" />
                  <Ionicons name="battery-full-outline" size={14} color="#0F172A" />
                </View>
              </View>

              {/* In-Phone App Screen Content */}
              <View style={styles.phoneScreenContent}>
                {/* App Header */}
                <View style={styles.phoneAppHeader}>
                  <View>
                    <Text style={styles.phoneAppBrand}>Servicewala</Text>
                    <View style={styles.phoneAppLocationRow}>
                      <Ionicons name="location" size={10} color="#991B1B" />
                      <Text style={styles.phoneAppLocationText}>Bengaluru, KA</Text>
                    </View>
                  </View>
                  <View style={styles.phoneAppBellWrap}>
                    <Ionicons name="notifications-outline" size={14} color="#0F172A" />
                    <View style={styles.phoneAppBellDot} />
                  </View>
                </View>

                {/* Live Order Card inside Phone */}
                <View style={styles.phoneLiveOrderCard}>
                  <View style={styles.phoneLiveOrderTop}>
                    <View style={styles.phoneLiveOrderPill}>
                      <View style={styles.phoneLivePulsingDot} />
                      <Text style={styles.phoneLiveOrderPillText}>TECH ON THE WAY</Text>
                    </View>
                    <Text style={styles.phoneLiveEta}>14 mins</Text>
                  </View>

                  <View style={styles.phoneTechRow}>
                    <View style={styles.phoneTechAvatar}>
                      <Ionicons name="person" size={14} color="#FFFFFF" />
                    </View>
                    <View style={styles.phoneTechInfo}>
                      <Text style={styles.phoneTechName}>Rajesh Kumar</Text>
                      <Text style={styles.phoneTechService}>Senior AC Jet Specialist</Text>
                    </View>
                    <View style={styles.phoneTechRating}>
                      <Ionicons name="star" size={10} color="#F59E0B" />
                      <Text style={styles.phoneTechRatingText}>4.9</Text>
                    </View>
                  </View>

                  {/* Start OTP Capsule */}
                  <View style={styles.phoneOtpCapsule}>
                    <Ionicons name="key-outline" size={12} color="#047857" />
                    <Text style={styles.phoneOtpLabel}>Start OTP:</Text>
                    <Text style={styles.phoneOtpCode}>4829</Text>
                  </View>
                </View>

                {/* In-App Promo Banner inside Phone */}
                <View style={styles.phonePromoBanner}>
                  <Ionicons name="gift-outline" size={13} color="#991B1B" />
                  <Text style={styles.phonePromoText}>Code: APPFIRST • ₹150 OFF</Text>
                </View>

                {/* Quick Services Icons inside Phone */}
                <View style={styles.phoneQuickGrid}>
                  {[
                    { icon: 'snow-outline', label: 'AC Repair' },
                    { icon: 'laptop-outline', label: 'Laptop' },
                    { icon: 'flash-outline', label: 'Electric' },
                  ].map((s, i) => (
                    <View key={i} style={styles.phoneQuickItem}>
                      <View style={styles.phoneQuickIcon}>
                        <Ionicons name={s.icon as any} size={14} color="#0F172A" />
                      </View>
                      <Text style={styles.phoneQuickLabel}>{s.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Phone Bottom Nav Bar */}
                <View style={styles.phoneBottomNav}>
                  <Ionicons name="home" size={16} color="#991B1B" />
                  <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                  <Ionicons name="wallet-outline" size={16} color="#94A3B8" />
                  <Ionicons name="person-outline" size={16} color="#94A3B8" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    paddingHorizontal: 20,
    marginTop: 36,
  },
  appBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 36,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  appBannerGlow: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundImage:
      'radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, rgba(248, 250, 252, 0) 70%)',
  } as any,
  appBannerContent: {
    gap: 32,
    alignItems: 'center',
  },
  appBannerContentDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appBannerContentMobile: {
    flexDirection: 'column',
  },
  appBannerLeft: {
    flex: 1,
  },
  appBannerLeftDesktop: {
    maxWidth: 620,
  },
  appBannerLeftMobile: {
    width: '100%',
  },
  appBannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  appBannerPillText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  appBannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 10,
  },
  appBannerDesc: {
    fontSize: 14.5,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  appPerksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 26,
  },
  appPerkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '48%',
    minWidth: 180,
  },
  appPerkIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appPerkTexts: {
    flex: 1,
  },
  appPerkTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  appPerkDesc: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  appDownloadRow: {
    gap: 18,
    alignItems: 'center',
  },
  appDownloadRowDesktop: {
    flexDirection: 'row',
  },
  appDownloadRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  storeBadgesCol: {
    flexDirection: 'row',
    gap: 10,
  },
  storeBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  storeBadgeTexts: {
    justifyContent: 'center',
  },
  storeBadgeSub: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  storeBadgeMain: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appQrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  appQrWrap: {
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  appQrInfo: {
    justifyContent: 'center',
  },
  appQrTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  appQrSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  appQrRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  appQrRatingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },

  /* Right Column: Smartphone Mockup */
  appBannerRight: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  appBannerRightDesktop: {
    width: 300,
  },
  appBannerRightMobile: {
    width: '100%',
    paddingVertical: 16,
  },
  phoneFloatingBadgeTop: {
    position: 'absolute',
    top: 36,
    right: -10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    zIndex: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  phoneFloatingBadgeBottom: {
    position: 'absolute',
    bottom: 40,
    left: -12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    zIndex: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  phoneFloatingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  phoneFrame: {
    width: 250,
    height: 440,
    borderRadius: 36,
    borderWidth: 8,
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  phoneDynamicIsland: {
    width: 76,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    alignSelf: 'center',
    marginTop: 6,
    zIndex: 10,
  },
  phoneStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 6,
  },
  phoneStatusTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  phoneStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneScreenContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },
  phoneAppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phoneAppBrand: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  phoneAppLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  phoneAppLocationText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  phoneAppBellWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  phoneAppBellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E11D48',
  },
  phoneLiveOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  phoneLiveOrderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phoneLiveOrderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  phoneLivePulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  phoneLiveOrderPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.4,
  },
  phoneLiveEta: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  phoneTechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  phoneTechAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneTechInfo: {
    flex: 1,
  },
  phoneTechName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  phoneTechService: {
    fontSize: 9,
    color: '#64748B',
  },
  phoneTechRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  phoneTechRatingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  phoneOtpCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  phoneOtpLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#047857',
  },
  phoneOtpCode: {
    fontSize: 11,
    fontWeight: '900',
    color: '#047857',
    letterSpacing: 1,
  },
  phonePromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  phonePromoText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#991B1B',
  },
  phoneQuickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  phoneQuickItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneQuickIcon: {
    marginBottom: 2,
  },
  phoneQuickLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#475569',
  },
  phoneBottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});

