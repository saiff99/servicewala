import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import { useEcosystemStore } from '../../store/useEcosystemStore';

const CATEGORY_STATS: Record<string, { rating: string; reviews: string }> = {
  'gadgets-repair': { rating: '4.8', reviews: '12k+' },
  'printer-repair': { rating: '4.9', reviews: '4.5k+' },
  'ac-appliances': { rating: '4.8', reviews: '28k+' },
  cleaning: { rating: '4.8', reviews: '15k+' },
  'home-repairs': { rating: '4.7', reviews: '32k+' },
  'salon-women': { rating: '4.8', reviews: '18k+' },
  'salon-men': { rating: '4.7', reviews: '9k+' },
  painting: { rating: '4.8', reviews: '6k+' },
};

function getCategoryIcon(iconName: string) {
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

export default function CategoriesGridSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const isMobileSmall = width < 540;
  const router = useRouter();
  const { categories } = useEcosystemStore();
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);

  return (
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
});

