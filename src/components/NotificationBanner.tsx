import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../store/useEcosystemStore';
import { THEME } from '../constants/theme';

export const NotificationBanner: React.FC = () => {
  const { notifications, dismissNotification } = useEcosystemStore();
  const latestNotif = notifications[0];
  const [dismissedIds, setDismissedIds] = useState<Record<string, boolean>>({});

  const notifId = latestNotif?.id;

  useEffect(() => {
    if (!notifId) return;
    const timer = setTimeout(() => {
      setDismissedIds((prev) => ({ ...prev, [notifId]: true }));
    }, 6000);
    return () => clearTimeout(timer);
  }, [notifId]);

  if (!latestNotif || dismissedIds[latestNotif.id]) {
    return null;
  }

  const isCustomer = latestNotif.targetPortal === 'customer';
  const isPartner = latestNotif.targetPortal === 'partner';

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View
        style={[
          styles.banner,
          isCustomer && styles.bannerCustomer,
          isPartner && styles.bannerPartner,
          !isCustomer && !isPartner && styles.bannerAdmin,
        ]}
      >
        <View style={styles.iconWrap}>
          <Ionicons
            name={
              isPartner
                ? 'notifications'
                : isCustomer
                ? 'sparkles'
                : 'shield-checkmark'
            }
            size={18}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{latestNotif.title}</Text>
          <Text style={styles.message} numberOfLines={2}>
            {latestNotif.message}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setDismissedIds((prev) => ({ ...prev, [latestNotif.id]: true }));
            dismissNotification(latestNotif.id);
          }}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={16} color="#CBD5E1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    zIndex: 999999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 640,
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...THEME.shadows.floating,
  },
  bannerCustomer: {
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
  },
  bannerPartner: {
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.partnerPrimary,
  },
  bannerAdmin: {
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.adminAccent,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 16,
  },
  closeBtn: {
    padding: 6,
  },
});
