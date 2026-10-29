import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';

export default function LiveImpactBar() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  return (
    <View style={styles.liveMetricsOuter}>
      <View style={styles.liveMetricsInner}>
        {/* Top Live Status Indicator Bar */}
        <View style={styles.liveStatusRow}>
          <View style={styles.livePulseWrap}>
            <View style={styles.livePulseDot as any} />
            <Text style={styles.livePulseText}>LIVE DOORSTEP NETWORK ACTIVE</Text>
          </View>
          <Text style={styles.liveCitiesText}>Servicing Across 50+ Cities in India</Text>
        </View>

        {/* 4 Primary Impact Metric Capsules */}
        <View
          style={[
            styles.liveMetricsGrid,
            isDesktop ? styles.liveMetricsGridDesktop : styles.liveMetricsGridMobile,
          ]}
        >
          {[
            {
              id: 'rating',
              val: '4.85 ★',
              sub: '150K+ Verified Reviews',
              icon: 'star',
              color: '#F59E0B',
              bg: '#FEF3C7',
            },
            {
              id: 'speed',
              val: '45-60 Mins',
              sub: 'Doorstep Arrival Guarantee',
              icon: 'flash',
              color: '#2563EB',
              bg: '#EFF6FF',
            },
            {
              id: 'volume',
              val: '50,000+',
              sub: 'Successful Home Repairs',
              icon: 'checkmark-done-circle',
              color: '#059669',
              bg: '#ECFDF5',
            },
            {
              id: 'parts',
              val: '100% OEM',
              sub: 'Genuine Parts & Warranty',
              icon: 'shield-checkmark',
              color: '#991B1B',
              bg: '#FEF2F2',
            },
          ].map((metric, idx) => (
            <View
              key={metric.id}
              style={[
                styles.liveMetricCard,
                idx < 3 && isDesktop && styles.liveMetricCardBorder,
              ]}
            >
              <View style={[styles.liveMetricIconWrap, { backgroundColor: metric.bg }]}>
                <Ionicons name={metric.icon as any} size={20} color={metric.color} />
              </View>
              <View style={styles.liveMetricTextWrap}>
                <Text style={styles.liveMetricVal}>{metric.val}</Text>
                <Text style={styles.liveMetricSub}>{metric.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  liveMetricsOuter: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  liveMetricsInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  liveStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  livePulseWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)',
  },
  livePulseText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.7,
  },
  liveCitiesText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  liveMetricsGrid: {
    width: '100%',
  },
  liveMetricsGridDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveMetricsGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  liveMetricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 220,
    paddingHorizontal: 12,
  },
  liveMetricCardBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  liveMetricIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveMetricTextWrap: {
    flex: 1,
  },
  liveMetricVal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  liveMetricSub: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
});

