import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { Technician } from '../../src/data/mockEcosystemData';
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function AdminTechniciansManager() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const {
    technicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    toggleTechnicianDuty,
  } = useEcosystemStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Modal State for Onboarding
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('+91 ');
  const [formEmail, setFormEmail] = useState('');
  const [formSkill, setFormSkill] = useState('');
  const [formCity, setFormCity] = useState('Bengaluru (Indiranagar / Koramangala)');
  const [formCommission, setFormCommission] = useState('15');
  const [formAvatar, setFormAvatar] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
  );

  // Edit Commission Modal State
  const [commissionModalTech, setCommissionModalTech] = useState<Technician | null>(null);
  const [tempCommission, setTempCommission] = useState('15');

  const filteredTechs = technicians.filter((t) => {
    const matchesKyc = kycFilter === 'all' || t.kycStatus === kycFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primarySkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKyc && matchesSearch;
  });

  const handleCreateTechnician = () => {
    if (!formName.trim() || !formPhone.trim()) {
      alert('Please fill in partner name and phone.');
      return;
    }

    addTechnician({
      name: formName,
      phone: formPhone,
      email: formEmail || `${formName.toLowerCase().replace(/\s+/g, '.')}@servicewala.in`,
      avatar: formAvatar,
      categoryIds: ['ac-appliances', 'home-repairs'],
      primarySkill: formSkill || 'Expert Service Specialist',
      status: 'online',
      kycStatus: 'verified',
      commissionRate: parseFloat(formCommission) || 15,
      city: formCity,
    });

    setModalVisible(false);
  };

  const handleSaveCommission = () => {
    if (!commissionModalTech) return;
    const rate = parseFloat(tempCommission);
    if (!isNaN(rate) && rate >= 0 && rate <= 100) {
      updateTechnician(commissionModalTech.id, { commissionRate: rate });
    }
    setCommissionModalTech(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* HEADER & ONBOARD ACTION */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Technician & Partner Fleet Manager</Text>
          <Text style={styles.headerSub}>
            Onboard professionals, configure take-rate commission & manage KYC verification
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setFormName('');
            setFormPhone('+91 9');
            setFormEmail('');
            setFormSkill('Master Electrician & Smart Home Specialist');
            setFormCity('Bengaluru (HSR / Koramangala)');
            setFormCommission('15');
            setModalVisible(true);
          }}
          style={styles.onboardBtn}
          activeOpacity={0.88}
        >
          <Ionicons name="person-add" size={16} color="#FFFFFF" />
          <Text style={styles.onboardBtnText}>Onboard New Partner</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH AND KYC FILTERS */}
      <View style={styles.filterBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search technician by name, phone, city..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterTabsRow}>
          {[
            { id: 'all', label: `All Fleet (${technicians.length})` },
            { id: 'verified', label: `KYC Verified (${technicians.filter((t) => t.kycStatus === 'verified').length})` },
            { id: 'pending', label: `Pending KYC (${technicians.filter((t) => t.kycStatus === 'pending').length})` },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setKycFilter(tab.id as any)}
              style={[
                styles.filterPill,
                kycFilter === tab.id && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  kycFilter === tab.id && styles.filterPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TECHNICIAN CARDS GRID */}
      <View style={styles.techGrid}>
        {filteredTechs.map((tech) => (
          <View
            key={tech.id}
            style={[
              styles.techCard,
              isDesktop ? styles.techCardDesktop : styles.techCardMobile,
            ]}
          >
            {/* Top Row: Avatar, Name & Duty Toggle */}
            <View style={styles.techCardTop}>
              <Image source={{ uri: tech.avatar }} style={styles.techAvatar} />
              <View style={styles.techCardMainInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.techName}>{tech.name}</Text>
                  <View
                    style={[
                      styles.kycTag,
                      {
                        backgroundColor:
                          tech.kycStatus === 'verified' ? '#D1FAE5' : '#FEF3C7',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        tech.kycStatus === 'verified' ? 'shield-checkmark' : 'alert-circle'
                      }
                      size={11}
                      color={tech.kycStatus === 'verified' ? '#065F46' : '#92400E'}
                    />
                    <Text
                      style={[
                        styles.kycTagText,
                        {
                          color: tech.kycStatus === 'verified' ? '#065F46' : '#92400E',
                        },
                      ]}
                    >
                      {tech.kycStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.techSkill}>{tech.primarySkill}</Text>
                <Text style={styles.techLocation}>{tech.city}</Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={styles.metricsBox}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Rating</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.metricValue}>{tech.rating}</Text>
                </View>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Completed</Text>
                <Text style={styles.metricValue}>{tech.completedJobs} jobs</Text>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Commission</Text>
                <TouchableOpacity
                  onPress={() => {
                    setCommissionModalTech(tech);
                    setTempCommission(tech.commissionRate.toString());
                  }}
                  style={styles.commissionPill}
                >
                  <Text style={styles.commissionPillText}>{tech.commissionRate}%</Text>
                  <Ionicons name="pencil" size={10} color="#4F46E5" />
                </TouchableOpacity>
              </View>

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Wallet</Text>
                <Text style={[styles.metricValue, { color: '#059669' }]}>
                  {currencyFormatter(tech.walletBalance)}
                </Text>
              </View>
            </View>

            {/* Action Bar */}
            <View style={styles.cardActionsRow}>
              {/* Duty Toggle Button */}
              <TouchableOpacity
                onPress={() => toggleTechnicianDuty(tech.id)}
                style={[
                  styles.dutyToggleBtn,
                  tech.status === 'online'
                    ? styles.dutyToggleOnline
                    : styles.dutyToggleOffline,
                ]}
              >
                <View
                  style={[
                    styles.dutyDot,
                    {
                      backgroundColor:
                        tech.status === 'online'
                          ? '#10B981'
                          : tech.status === 'busy'
                          ? '#F59E0B'
                          : '#EF4444',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.dutyToggleText,
                    {
                      color:
                        tech.status === 'online'
                          ? '#065F46'
                          : tech.status === 'busy'
                          ? '#92400E'
                          : '#991B1B',
                    },
                  ]}
                >
                  {tech.status.toUpperCase()}
                </Text>
              </TouchableOpacity>

              {/* KYC Status Toggle */}
              <TouchableOpacity
                onPress={() =>
                  updateTechnician(tech.id, {
                    kycStatus: tech.kycStatus === 'verified' ? 'pending' : 'verified',
                  })
                }
                style={styles.actionBtnSmall}
              >
                <Text style={styles.actionBtnSmallText}>
                  {tech.kycStatus === 'verified' ? 'Flag KYC' : 'Approve KYC'}
                </Text>
              </TouchableOpacity>

              {/* Delete / Remove */}
              <TouchableOpacity
                onPress={() => deleteTechnician(tech.id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 120 }} />

      {/* ONBOARD NEW PARTNER MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDesktop ? styles.modalDesktop : styles.modalMobile]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Onboard New Technician</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Technician Full Name *</Text>
                  <TextInput
                    value={formName}
                    onChangeText={setFormName}
                    placeholder="e.g. Suresh Gowda"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Mobile Phone *</Text>
                  <TextInput
                    value={formPhone}
                    onChangeText={setFormPhone}
                    placeholder="+91 98765 00000"
                    keyboardType="phone-pad"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  value={formEmail}
                  onChangeText={setFormEmail}
                  placeholder="suresh.g@servicewala.in"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Primary Trade & Skill Title</Text>
                <TextInput
                  value={formSkill}
                  onChangeText={setFormSkill}
                  placeholder="e.g. Certified Inverter AC Specialist"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.fieldLabel}>Assigned Hub / City Zone</Text>
                  <TextInput
                    value={formCity}
                    onChangeText={setFormCity}
                    placeholder="Bengaluru (Whitefield / Marathahalli)"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Commission %</Text>
                  <TextInput
                    value={formCommission}
                    onChangeText={setFormCommission}
                    placeholder="15"
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Profile Avatar Image URL</Text>
                <TextInput
                  value={formAvatar}
                  onChangeText={setFormAvatar}
                  placeholder="https://images.unsplash.com/..."
                  style={styles.textInput}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateTechnician}
                style={styles.saveBtn}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Approve & Onboard Partner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT COMMISSION MODAL */}
      <Modal
        visible={!!commissionModalTech}
        transparent
        animationType="fade"
        onRequestClose={() => setCommissionModalTech(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 380 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Platform Commission</Text>
              <TouchableOpacity
                onPress={() => setCommissionModalTech(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalBodyText}>
                Adjust the platform take-rate percentage for {commissionModalTech?.name}. This
                determines what percentage is retained by Servicewala on completed jobs.
              </Text>

              <Text style={styles.fieldLabel}>Commission Rate (%)</Text>
              <TextInput
                value={tempCommission}
                onChangeText={setTempCommission}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setCommissionModalTech(null)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveCommission}
                style={styles.saveBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.saveBtnText}>Update Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  contentWrap: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  onboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.partnerPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  onboardBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  filterBar: {
    gap: 12,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: 420,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  techCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  techCardDesktop: {
    width: '48.8%',
  },
  techCardMobile: {
    width: '100%',
  },
  techCardTop: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  techAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  techCardMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 2,
  },
  techName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  kycTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  kycTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  techSkill: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  techLocation: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  commissionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  commissionPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dutyToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  dutyToggleOnline: {
    backgroundColor: '#ECFDF5',
  },
  dutyToggleOffline: {
    backgroundColor: '#FEF2F2',
  },
  dutyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dutyToggleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionBtnSmall: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnSmallText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '85%',
    ...THEME.shadows.modal,
  },
  modalDesktop: {
    width: 580,
  },
  modalMobile: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalBodyText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  formCol: {
    flex: 1,
  },
  formField: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.partnerPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
