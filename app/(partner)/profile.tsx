import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME } from '../../src/constants/theme';

export default function PartnerProfileScreen() {
  const { currentPartnerId, setCurrentPartnerId, technicians } = useEcosystemStore();
  const partner = technicians.find((t) => t.id === currentPartnerId) || technicians[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* PROFILE HEADER CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <Image source={{ uri: partner.avatar }} style={styles.avatarImage} />
          <View style={styles.avatarTextWrap}>
            <View style={styles.nameRow}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <View style={styles.verifiedKycBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                <Text style={styles.verifiedKycText}>KYC VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.primarySkill}>{partner.primarySkill}</Text>
            <Text style={styles.cityText}>{partner.city}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={14} color="#64748B" />
            <Text style={styles.contactVal}>{partner.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={14} color="#64748B" />
            <Text style={styles.contactVal}>{partner.email}</Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Rating</Text>
            <View style={styles.starRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.metaVal}>{partner.rating}</Text>
            </View>
            <Text style={styles.metaSub}>({partner.ratingCount} reviews)</Text>
          </View>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Completed</Text>
            <Text style={styles.metaVal}>{partner.completedJobs}</Text>
            <Text style={styles.metaSub}>Orders</Text>
          </View>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Joined On</Text>
            <Text style={styles.metaVal}>{partner.joinedDate}</Text>
            <Text style={styles.metaSub}>Partner Level 3</Text>
          </View>
        </View>
      </View>

      {/* QUICK SWITCH TECHNICIAN PROFILE (FOR EASY TESTING) */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>Switch Technician (Dev Preview)</Text>
        <Text style={styles.sectionSub}>Select any onboarded partner to test their jobs and wallet</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.techSwitcherRow}>
          {technicians.map((t) => {
            const isSelected = t.id === partner.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setCurrentPartnerId(t.id)}
                style={[
                  styles.techPillCard,
                  isSelected && styles.techPillCardSelected,
                ]}
              >
                <Image source={{ uri: t.avatar }} style={styles.techPillAvatar} />
                <View>
                  <Text style={[styles.techPillName, isSelected && styles.techPillNameSelected]}>
                    {t.name}
                  </Text>
                  <Text style={styles.techPillSub}>{t.primarySkill.split(' ')[0]}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color={THEME.colors.partnerPrimary} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* KYC DOCUMENTS STATUS */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>KYC & Legal Verification</Text>
        <View style={styles.docList}>
          {[
            {
              title: 'Government Identity (Aadhaar Card)',
              status: 'Verified',
              sub: 'UIDAI biometric match completed',
              icon: 'id-card-outline',
            },
            {
              title: 'Police Clearance Certificate (PCC)',
              status: 'Approved',
              sub: 'Valid till 31 Dec 2027 • Government Police Verification',
              icon: 'document-text-outline',
            },
            {
              title: 'Servicewala Skill Certification',
              status: 'Level 3 Pro',
              sub: '98% pass score on HVAC & plumbing safety',
              icon: 'ribbon-outline',
            },
            {
              title: 'Bank Mandate (Cancelled Cheque)',
              status: 'Active IMPS',
              sub: 'HDFC Bank • Account ending in 4102',
              icon: 'cash-outline',
            },
          ].map((doc, idx) => (
            <View key={idx} style={styles.docItem}>
              <View style={styles.docIconWrap}>
                <Ionicons name={doc.icon as any} size={18} color="#059669" />
              </View>
              <View style={styles.docDetails}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docSub}>{doc.sub}</Text>
              </View>
              <View style={styles.docStatusBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                <Text style={styles.docStatusText}>{doc.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrap: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    ...THEME.shadows.subtle,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#10B981',
  },
  avatarTextWrap: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  partnerName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  verifiedKycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  verifiedKycText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#065F46',
  },
  primarySkill: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  cityText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  contactRow: {
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactVal: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  metaSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  techSwitcherRow: {
    gap: 10,
    paddingVertical: 4,
  },
  techPillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  techPillCardSelected: {
    borderColor: THEME.colors.partnerPrimary,
    backgroundColor: '#ECFDF5',
  },
  techPillAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  techPillName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  techPillNameSelected: {
    color: '#065F46',
    fontWeight: '900',
  },
  techPillSub: {
    fontSize: 10,
    color: '#64748B',
  },
  docList: {
    gap: 10,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...THEME.shadows.subtle,
  },
  docIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docDetails: {
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  docSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  docStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  docStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
});
