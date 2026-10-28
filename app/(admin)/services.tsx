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
import { ServiceItem } from '../../src/data/mockEcosystemData';
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function AdminServicesManager() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { services, categories, addService, updateService, deleteService } = useEcosystemStore();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || 'ac-appliances');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('499');
  const [formOriginalPrice, setFormOriginalPrice] = useState('799');
  const [formDuration, setFormDuration] = useState('45 mins');
  const [formImageUrl, setFormImageUrl] = useState(
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80'
  );
  const [formIncludes, setFormIncludes] = useState('Standard inspection, Sanitized parts, 30-day warranty');
  const [formPopularBadge, setFormPopularBadge] = useState('New');

  const filteredServices = services.filter((s) => {
    const matchesCat =
      selectedCategoryFilter === 'all' || s.categoryId === selectedCategoryFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openAddModal = () => {
    setEditingServiceId(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || 'ac-appliances');
    setFormTagline('');
    setFormDescription('');
    setFormPrice('599');
    setFormOriginalPrice('899');
    setFormDuration('45 mins');
    setFormImageUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=80');
    setFormIncludes('Professional on-site check, Tool sanitization, 30-day rework warranty');
    setFormPopularBadge('New');
    setModalVisible(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setFormName(service.name);
    setFormCategoryId(service.categoryId);
    setFormTagline(service.tagline);
    setFormDescription(service.description);
    setFormPrice(service.price.toString());
    setFormOriginalPrice(service.originalPrice.toString());
    setFormDuration(service.duration);
    setFormImageUrl(service.imageUrl);
    setFormIncludes(service.includes.join(', '));
    setFormPopularBadge(service.popularBadge || '');
    setModalVisible(true);
  };

  const handleSaveService = () => {
    if (!formName.trim()) {
      alert('Please enter a service name.');
      return;
    }

    const priceNum = parseFloat(formPrice) || 299;
    const origPriceNum = parseFloat(formOriginalPrice) || priceNum * 1.3;
    const includesArray = formIncludes
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (editingServiceId) {
      updateService(editingServiceId, {
        name: formName,
        categoryId: formCategoryId,
        tagline: formTagline,
        description: formDescription,
        price: priceNum,
        originalPrice: origPriceNum,
        duration: formDuration,
        imageUrl: formImageUrl,
        includes: includesArray,
        popularBadge: formPopularBadge || undefined,
      });
    } else {
      addService({
        name: formName,
        categoryId: formCategoryId,
        tagline: formTagline || 'Professional on-demand service by certified partners',
        description: formDescription || 'Complete satisfaction guaranteed with verified pros.',
        price: priceNum,
        originalPrice: origPriceNum,
        duration: formDuration,
        imageUrl: formImageUrl,
        includes: includesArray,
        popularBadge: formPopularBadge || undefined,
      });
    }

    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* HEADER & ACTION BAR */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Services & Category Catalog</Text>
          <Text style={styles.headerSub}>
            Live catalog synced with Customer Website ({services.length} active offerings)
          </Text>
        </View>

        <TouchableOpacity onPress={openAddModal} style={styles.addServiceBtn} activeOpacity={0.88}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addServiceBtnText}>Add New Service</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH AND CATEGORY FILTER CHIPS */}
      <View style={styles.filterBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search service name, tagline..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          <TouchableOpacity
            onPress={() => setSelectedCategoryFilter('all')}
            style={[
              styles.filterPill,
              selectedCategoryFilter === 'all' && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCategoryFilter === 'all' && styles.filterPillTextActive,
              ]}
            >
              All Categories ({services.length})
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategoryFilter(cat.id)}
              style={[
                styles.filterPill,
                selectedCategoryFilter === cat.id && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedCategoryFilter === cat.id && styles.filterPillTextActive,
                ]}
              >
                {cat.name} ({cat.serviceCount})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SERVICES TABLE / CARDS GRID */}
      <View style={styles.servicesGrid}>
        {filteredServices.map((service) => {
          const category = categories.find((c) => c.id === service.categoryId);
          return (
            <View
              key={service.id}
              style={[
                styles.serviceAdminCard,
                isDesktop ? styles.serviceCardDesktop : styles.serviceCardMobile,
              ]}
            >
              <View style={styles.cardTopRow}>
                <Image source={{ uri: service.imageUrl }} style={styles.serviceThumbnail} />
                <View style={styles.cardMetaWrap}>
                  <View style={styles.categoryBadgeRow}>
                    <View
                      style={[
                        styles.catTag,
                        { backgroundColor: `${category?.tagColor || '#4F46E5'}15` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.catTagText,
                          { color: category?.tagColor || '#4F46E5' },
                        ]}
                      >
                        {category?.name || service.categoryId}
                      </Text>
                    </View>
                    {service.popularBadge && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>{service.popularBadge}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceTagline} numberOfLines={2}>
                    {service.tagline}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardBottomRow}>
                <View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceVal}>{currencyFormatter(service.price)}</Text>
                    <Text style={styles.origPriceVal}>
                      {currencyFormatter(service.originalPrice)}
                    </Text>
                  </View>
                  <Text style={styles.durationVal}>{service.duration}</Text>
                </View>

                {/* EDIT & DELETE ACTIONS */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    onPress={() => openEditModal(service)}
                    style={styles.actionBtnEdit}
                  >
                    <Ionicons name="pencil" size={14} color="#4F46E5" />
                    <Text style={styles.actionBtnEditText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteService(service.id)}
                    style={styles.actionBtnDelete}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 120 }} />

      {/* ADD / EDIT SERVICE MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDesktop ? styles.modalDesktop : styles.modalMobile]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingServiceId ? 'Edit Service Details' : 'Add New Service to Catalog'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Service Name *</Text>
                <TextInput
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="e.g. Microwave & Oven Heating Fix"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Category *</Text>
                <View style={styles.categoryRadioWrap}>
                  {categories.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setFormCategoryId(c.id)}
                      style={[
                        styles.catChoiceBtn,
                        formCategoryId === c.id && styles.catChoiceBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catChoiceText,
                          formCategoryId === c.id && styles.catChoiceTextActive,
                        ]}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Tagline</Text>
                <TextInput
                  value={formTagline}
                  onChangeText={setFormTagline}
                  placeholder="e.g. Magnetron check, diode replacement & spark test"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Selling Price (₹) *</Text>
                  <TextInput
                    value={formPrice}
                    onChangeText={setFormPrice}
                    placeholder="399"
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Original Price (₹)</Text>
                  <TextInput
                    value={formOriginalPrice}
                    onChangeText={setFormOriginalPrice}
                    placeholder="599"
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Duration</Text>
                  <TextInput
                    value={formDuration}
                    onChangeText={setFormDuration}
                    placeholder="40 mins"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Image URL</Text>
                <TextInput
                  value={formImageUrl}
                  onChangeText={setFormImageUrl}
                  placeholder="https://images.unsplash.com/..."
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Included Bullet Points (Comma Separated)</Text>
                <TextInput
                  value={formIncludes}
                  onChangeText={setFormIncludes}
                  placeholder="Point 1, Point 2, Point 3"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Popularity Badge</Text>
                <TextInput
                  value={formPopularBadge}
                  onChangeText={setFormPopularBadge}
                  placeholder="Bestseller / New / 30-Day Warranty"
                  style={styles.textInput}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSaveService} style={styles.saveBtn} activeOpacity={0.88}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>
                  {editingServiceId ? 'Save Changes' : 'Publish to Customer App'}
                </Text>
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
  addServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  addServiceBtnText: {
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
    outlineStyle: 'none' as any,
  },
  catScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceAdminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  serviceCardDesktop: {
    width: '31.5%',
  },
  serviceCardMobile: {
    width: '100%',
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  cardMetaWrap: {
    flex: 1,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  catTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  popularBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  serviceTagline: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  origPriceVal: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  durationVal: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionBtnEditText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  actionBtnDelete: {
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
    maxHeight: '90%',
    ...THEME.shadows.modal,
  },
  modalDesktop: {
    width: 620,
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
  formField: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formCol: {
    flex: 1,
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
    outlineStyle: 'none' as any,
  },
  categoryRadioWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChoiceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  catChoiceBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  catChoiceText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  catChoiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
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
    backgroundColor: THEME.colors.primary,
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
