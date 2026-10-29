import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: () => void;
  onResetQuickFilter?: () => void;
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onResetQuickFilter,
}: HeroSectionProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  return (
    <View style={styles.heroWrapper}>
      <ImageBackground
        source={require('../../../assets/hero-service-banner.jpg')}
        style={[
          styles.heroBackground,
          isDesktop ? styles.heroBackgroundDesktop : styles.heroBackgroundMobile,
        ]}
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
            <Text
              style={[
                styles.heroHeadline,
                isDesktop ? styles.heroHeadlineDesktop : styles.heroHeadlineMobile,
              ]}
            >
              Expert Doorstep Repair for{'\n'}Laptops, Computers & AC
            </Text>

            {/* Servicewala luxury pill search capsule */}
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
                  if (onResetQuickFilter) onResetQuickFilter();
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onSubmitEditing={onSearchSubmit}
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
                onPress={onSearchSubmit}
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
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#991B1B',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  } as any,
});

