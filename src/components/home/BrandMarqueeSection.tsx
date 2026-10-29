import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SUPPORTED_BRANDS, BrandLogo } from '../../components';

export default function BrandMarqueeSection() {
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [hoveredBrandKey, setHoveredBrandKey] = useState<string | null>(null);

  /* Continuous Circular Marquee animation for web (Right-to-Left, pauses on hover) */
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'servicewala-brand-marquee-styles';
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.textContent = `
        @keyframes servicewalaMarqueeContinuous {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        [data-marquee-track="true"] {
          display: flex !important;
          flex-direction: row !important;
          width: max-content !important;
          animation: servicewalaMarqueeContinuous 50s linear infinite !important;
          will-change: transform;
        }
        [data-marquee-outer="true"]:hover [data-marquee-track="true"],
        [data-marquee-track="true"]:hover,
        [data-brand-card="true"]:hover {
          animation-play-state: paused !important;
        }
      `;
    }
  }, []);

  return (
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
      <View
        style={styles.brandMarqueeOuter}
        {...({
          dataSet: { marqueeOuter: 'true' },
          onMouseEnter: () => setIsMarqueePaused(true),
          onMouseLeave: () => {
            setIsMarqueePaused(false);
            setHoveredBrandKey(null);
          },
        } as any)}
      >
        {/* Subtle Side Fade Gradients */}
        {Platform.OS === 'web' && <View style={styles.marqueeFadeLeft} pointerEvents="none" />}

        <View style={styles.brandMarqueeTrackContainer}>
          <View
            style={[
              styles.brandMarqueeTrack as any,
              Platform.OS === 'web' && {
                animationPlayState: isMarqueePaused || hoveredBrandKey !== null ? 'paused' : 'running',
              },
            ]}
            {...({
              dataSet: { marqueeTrack: 'true' },
              onMouseEnter: () => setIsMarqueePaused(true),
              onMouseLeave: () => setIsMarqueePaused(false),
            } as any)}
          >
            {[0, 1].map((groupIndex) => (
              <View
                key={`brand-group-${groupIndex}`}
                style={styles.brandMarqueeGroup}
                aria-hidden={groupIndex === 1 ? true : undefined}
              >
                {SUPPORTED_BRANDS.map((brand) => {
                  const itemKey = `${brand.id}-${groupIndex}`;
                  const isHovered = hoveredBrandKey === itemKey;
                  const isOtherHovered = hoveredBrandKey !== null && !isHovered;
                  return (
                    <Pressable
                      key={itemKey}
                      onHoverIn={() => {
                        setHoveredBrandKey(itemKey);
                        setIsMarqueePaused(true);
                      }}
                      onHoverOut={() => {
                        setHoveredBrandKey(null);
                        setIsMarqueePaused(false);
                      }}
                      {...({
                        dataSet: { brandCard: 'true' },
                      } as any)}
                      style={[
                        styles.brandCard,
                        isOtherHovered && styles.brandCardDimmed,
                        isHovered &&
                          ({
                            borderColor: brand.originalColor,
                            shadowColor: brand.originalColor,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.28,
                            shadowRadius: 18,
                            elevation: 8,
                            transform: [{ translateY: -5 }, { scale: 1.03 }],
                            zIndex: 10,
                            boxShadow: `0 12px 28px -6px ${brand.originalColor}38, 0 4px 12px -2px ${brand.originalColor}24`,
                          } as any),
                      ]}
                    >
                      <BrandLogo brand={brand} isHovered={isHovered} />
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {Platform.OS === 'web' && <View style={styles.marqueeFadeRight} pointerEvents="none" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 14,
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
  brandMarqueeTrackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 18,
    overflow: 'visible',
  } as any,
  brandMarqueeTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 'max-content',
    paddingVertical: 6,
    overflow: 'visible',
  } as any,
  brandMarqueeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 16,
    paddingVertical: 6,
    overflow: 'visible',
  } as any,
  brandCard: {
    width: 176,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  brandCardDimmed: {
    opacity: 0.45,
    transform: [{ scale: 0.98 }],
  },
});

