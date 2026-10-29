import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { THEME } from '../../src/constants/theme';
import {
  HeroSection,
  QuickCategoryStrip,
  LiveImpactBar,
  CategoriesGridSection,
  SpotlightOffersStrip,
  PopularServicesSection,
  WhyChooseSection,
  HowItWorksSection,
  TestimonialsSection,
  BrandMarqueeSection,
  FaqSection,
  PartnerBanner,
  HomeMegaFooter,
} from '../../src/components/home';

export default function CustomerHomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const mainScrollRef = useRef<any>(null);

  const handleSearchSubmit = () => {
    if (activeQuickFilter) setActiveQuickFilter(null);
    mainScrollRef.current?.scrollTo({
      y: isDesktop ? 450 : 390,
      animated: true,
    });
  };

  const handleQuickFilterChange = () => {
    mainScrollRef.current?.scrollTo({
      y: isDesktop ? 450 : 390,
      animated: true,
    });
  };

  return (
    <View style={styles.screenRoot}>
      <ScrollView
        ref={mainScrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentWrap}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Section with Search Bar */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onResetQuickFilter={() => setActiveQuickFilter(null)}
        />

        {/* 2. Horizontal Quick Categories Strip */}
        <QuickCategoryStrip
          activeQuickFilter={activeQuickFilter}
          setActiveQuickFilter={setActiveQuickFilter}
          onFilterChange={handleQuickFilterChange}
        />

        {/* 3. Live Platform Impact & Trust Metrics Bar */}
        <LiveImpactBar />

        {/* 4. Explore All Categories Grid */}
        <CategoriesGridSection />

        {/* 5. Spotlight Seasonal Offers Strip */}
        <SpotlightOffersStrip />

        {/* 6. Popular / Search-Filtered Services Grid */}
        <PopularServicesSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeQuickFilter={activeQuickFilter}
          onClearFilter={() => setActiveQuickFilter(null)}
        />

        {/* 7. Why Choose Servicewala & ₹10,000 Protection Promise */}
        <WhyChooseSection />

        {/* 9. How It Works (3 Effortless Steps) */}
        <HowItWorksSection />

        {/* 10. Verified Customer Testimonials */}
        <TestimonialsSection />

        {/* 11. Multi-Brand Continuous Marquee Strip */}
        <BrandMarqueeSection />

        {/* 12. Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* 13. Partner Recruitment CTA Banner */}
        <PartnerBanner />

        {/* 15. Luxury Multi-Column Mega Footer */}
        <HomeMegaFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrap: {
    paddingBottom: 40,
  },
});
