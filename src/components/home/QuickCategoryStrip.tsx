import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { QUICK_SERVICES_STRIP } from './PopularServicesSection';

interface QuickCategoryStripProps {
  activeQuickFilter: string | null;
  setActiveQuickFilter: (filter: string | null) => void;
  onFilterChange?: () => void;
}

export default function QuickCategoryStrip({
  activeQuickFilter,
  setActiveQuickFilter,
  onFilterChange,
}: QuickCategoryStripProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;
  const [hoveredStripId, setHoveredStripId] = useState<string | null>(null);

  return (
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
                  if (onFilterChange) onFilterChange();
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
  );
}

const styles = StyleSheet.create({
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
    shadowOpacity: 0.2,
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
});

