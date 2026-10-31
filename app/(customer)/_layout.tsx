import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Image,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Slot, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME } from '../../src/constants/theme';
import { FloatingHelpCapsule } from '../../src/components/home';

const AVATAR_PRESETS = [
  { id: 'av-1', label: 'Saif', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80' },
  { id: 'av-2', label: 'Ananya', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { id: 'av-3', label: 'Rahul', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80' },
  { id: 'av-4', label: 'Pooja', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80' },
  { id: 'av-5', label: 'Amit', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { id: 'av-6', label: 'Neha', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
];

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

export default function CustomerLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { cart, orders, categories, customerProfile, updateCustomerProfile } =
    useEcosystemStore();

  const [headerSearch, setHeaderSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All India');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [hoveredMenuCat, setHoveredMenuCat] = useState<string | null>(null);

  // Edit Profile Modal States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(customerProfile.name);
  const [editPhone, setEditPhone] = useState(customerProfile.phone);
  const [editEmail, setEditEmail] = useState(customerProfile.email);
  const [editAvatar, setEditAvatar] = useState(customerProfile.avatarUrl);

  const handleOpenEditProfile = () => {
    setEditName(customerProfile.name);
    setEditPhone(customerProfile.phone);
    setEditEmail(customerProfile.email);
    setEditAvatar(customerProfile.avatarUrl);
    setShowProfileMenu(false);
    setShowEditProfileModal(true);
  };

  const locationDropdownRef = useRef<any>(null);
  const profileDropdownRef = useRef<any>(null);
  const servicesDropdownRef = useRef<any>(null);
  const mobileLocationRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
        const target = event.target as any;
        if (showLocationPicker) {
          const isInsideDesktop =
            locationDropdownRef.current &&
            locationDropdownRef.current.contains &&
            locationDropdownRef.current.contains(target);
          const isInsideMobile =
            mobileLocationRef.current &&
            mobileLocationRef.current.contains &&
            mobileLocationRef.current.contains(target);
          if (!isInsideDesktop && !isInsideMobile) {
            setShowLocationPicker(false);
            setLocationSearchQuery('');
          }
        }
        if (showProfileMenu) {
          const isInsideProfile =
            profileDropdownRef.current &&
            profileDropdownRef.current.contains &&
            profileDropdownRef.current.contains(target);
          if (!isInsideProfile) {
            setShowProfileMenu(false);
          }
        }
        if (showServicesMenu) {
          const isInsideServices =
            servicesDropdownRef.current &&
            servicesDropdownRef.current.contains &&
            servicesDropdownRef.current.contains(target);
          if (!isInsideServices) {
            setShowServicesMenu(false);
          }
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowLocationPicker(false);
          setShowProfileMenu(false);
          setShowServicesMenu(false);
          setLocationSearchQuery('');
        }
      };

      if (showLocationPicker || showProfileMenu || showServicesMenu) {
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
          document.removeEventListener('touchstart', handleOutsideClick);
          document.removeEventListener('keydown', handleKeyDown);
        };
      }
    }
  }, [showLocationPicker, showProfileMenu, showServicesMenu]);

  const CITIES = [
    'All India',
    'Kolkata',
    'Delhi NCR',
    'Mumbai',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Pune',
  ];

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(locationSearchQuery.trim().toLowerCase())
  );

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'requested' || o.status === 'assigned' || o.status === 'in_progress'
  ).length;

  return (
    <View style={styles.container}>
      {/* DESKTOP TOP NAVBAR (Servicewala Luxury Style) */}
      {isDesktop ? (
        <View style={styles.desktopNav}>
          <View style={styles.navInner}>
            {/* Left: Brand + Location Selector */}
            <View style={styles.leftNavGroup}>
              {/* Brand Logo (UC Style square badge + 2 stacked lines) */}
              <TouchableOpacity
                onPress={() => router.push('/(customer)')}
                style={styles.logoRow}
                activeOpacity={0.8}
              >
                <View style={styles.brandSquareBadge}>
                  <Text style={styles.brandSquareText}>SW</Text>
                </View>
                <View style={styles.brandTitleWrap}>
                  <Text style={styles.brandTitleLine1}>Service</Text>
                  <Text style={styles.brandTitleLine2}>wala</Text>
                </View>
              </TouchableOpacity>

              {/* Location Selector Box (Positioned next to Logo like Urban Company) */}
              <View ref={locationDropdownRef} style={styles.locationDropdownWrap}>
                <TouchableOpacity
                  onPress={() => {
                    setShowLocationPicker(!showLocationPicker);
                    if (showServicesMenu) setShowServicesMenu(false);
                    if (showProfileMenu) setShowProfileMenu(false);
                  }}
                  style={styles.locationBox}
                  activeOpacity={0.8}
                >
                  <Ionicons name="location-outline" size={17} color="#475569" />
                  <Text style={styles.locationBoxText} numberOfLines={1}>
                    {selectedLocation}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#64748B" />
                </TouchableOpacity>

                {/* Dropdown Menu */}
                {showLocationPicker && (
                  <View style={styles.locationDropdownMenu}>
                    {/* Search Input inside Dropdown */}
                    <View style={styles.locationSearchInputWrap}>
                      <Ionicons name="search-outline" size={13} color="#94A3B8" />
                      <TextInput
                        value={locationSearchQuery}
                        onChangeText={setLocationSearchQuery}
                        placeholder="Search city..."
                        placeholderTextColor="#94A3B8"
                        style={styles.locationSearchInput}
                        autoFocus
                      />
                      {locationSearchQuery ? (
                        <TouchableOpacity onPress={() => setLocationSearchQuery('')}>
                          <Ionicons name="close-circle" size={14} color="#94A3B8" />
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    {filteredCities.map((city) => (
                      <TouchableOpacity
                        key={city}
                        onPress={() => {
                          setSelectedLocation(city);
                          setShowLocationPicker(false);
                          setLocationSearchQuery('');
                        }}
                        style={[
                          styles.locationMenuItem,
                          selectedLocation === city && styles.locationMenuItemActive,
                        ]}
                      >
                        <Ionicons
                          name="location-sharp"
                          size={14}
                          color={selectedLocation === city ? '#0F172A' : '#94A3B8'}
                        />
                        <Text
                          style={[
                            styles.locationMenuText,
                            selectedLocation === city && styles.locationMenuTextActive,
                          ]}
                        >
                          {city}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    {filteredCities.length === 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedLocation(locationSearchQuery);
                          setShowLocationPicker(false);
                          setLocationSearchQuery('');
                        }}
                        style={styles.locationMenuItem}
                      >
                        <Ionicons name="add-circle-outline" size={14} color="#0F172A" />
                        <Text style={styles.locationCustomAddText} numberOfLines={1}>
                          {'Use "' + locationSearchQuery + '"'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Center: Search Bar Box */}
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={17} color="#64748B" />
              <TextInput
                value={headerSearch}
                onChangeText={setHeaderSearch}
                placeholder="Search for 'AC Repair', 'Cleaning', 'Salon'..."
                placeholderTextColor="#9CA3AF"
                style={styles.headerSearchInput}
                onSubmitEditing={() => {
                  if (headerSearch.trim()) {
                    router.push(`/(customer)?q=${encodeURIComponent(headerSearch)}`);
                  }
                }}
              />
              {headerSearch.length > 0 && (
                <TouchableOpacity onPress={() => setHeaderSearch('')} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Right: All Services + Direct My Bookings + Partner CTA + Cart + Profile */}
            <View style={styles.rightActionsGroup}>
              {/* All Services Mega Dropdown */}
              <View ref={servicesDropdownRef} style={styles.servicesDropdownWrap}>
                <TouchableOpacity
                  onPress={() => {
                    setShowServicesMenu(!showServicesMenu);
                    if (showLocationPicker) setShowLocationPicker(false);
                    if (showProfileMenu) setShowProfileMenu(false);
                  }}
                  style={[
                    styles.allServicesNavBtn,
                    showServicesMenu && styles.allServicesNavBtnActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="grid-outline"
                    size={16}
                    color={showServicesMenu ? '#2563EB' : '#0F172A'}
                  />
                  <Text
                    style={[
                      styles.allServicesNavBtnText,
                      showServicesMenu && styles.allServicesNavBtnTextActive,
                    ]}
                  >
                    All Services
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={13}
                    color={showServicesMenu ? '#2563EB' : '#64748B'}
                  />
                </TouchableOpacity>

                {showServicesMenu && (
                  <View style={styles.servicesDropdownMenu}>
                    {/* Header */}
                    <View style={styles.servicesMenuHeader}>
                      <View>
                        <Text style={styles.servicesMenuTitle}>All Services</Text>
                        <Text style={styles.servicesMenuSub}>Verified doorstep specialists</Text>
                      </View>
                      <View style={styles.servicesMenuCountBadge}>
                        <Text style={styles.servicesMenuCountText}>
                          {categories.length} Categories
                        </Text>
                      </View>
                    </View>

                    {/* 2-Column Grid */}
                    <View style={styles.servicesMenuGrid}>
                      {categories.map((cat) => {
                        const isHovered = hoveredMenuCat === cat.id;
                        return (
                          <Pressable
                            key={cat.id}
                            onPress={() => {
                              setShowServicesMenu(false);
                              router.push(`/(customer)/category/${cat.id}`);
                            }}
                            onHoverIn={() => setHoveredMenuCat(cat.id)}
                            onHoverOut={() => setHoveredMenuCat(null)}
                            style={[
                              styles.servicesMenuItem,
                              isHovered && styles.servicesMenuItemHovered,
                            ]}
                            accessibilityRole="button"
                          >
                            <View
                              style={[
                                styles.servicesMenuIconWrap,
                                isHovered && styles.servicesMenuIconWrapHovered,
                              ]}
                            >
                              <Ionicons
                                name={getCategoryIcon(cat.icon) as any}
                                size={19}
                                color={isHovered ? '#FFFFFF' : '#0F172A'}
                              />
                            </View>
                            <View style={styles.servicesMenuItemInfo}>
                              <Text
                                style={[
                                  styles.servicesMenuItemName,
                                  isHovered && styles.servicesMenuItemNameHovered,
                                ]}
                                numberOfLines={1}
                              >
                                {cat.name}
                              </Text>
                              <Text style={styles.servicesMenuItemCount}>
                                {cat.serviceCount} services • 30-Day Guarantee
                              </Text>
                            </View>
                            <Ionicons
                              name="chevron-forward"
                              size={15}
                              color={isHovered ? '#0F172A' : '#CBD5E1'}
                              style={isHovered ? { transform: [{ translateX: 3 }] } : undefined}
                            />
                          </Pressable>
                        );
                      })}
                    </View>

                    {/* Footer Trust Bar */}
                    <View style={styles.servicesMenuFooter}>
                      <View style={styles.servicesMenuFooterBadge}>
                        <Ionicons name="shield-checkmark" size={13} color="#059669" />
                        <Text style={styles.servicesMenuFooterText}>
                          Standardized Pricing & Free Revisit
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setShowServicesMenu(false);
                          router.push('/(customer)');
                        }}
                      >
                        <Text style={styles.servicesMenuFooterLink}>View All Categories →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Direct "My Bookings" Button */}
              <TouchableOpacity
                onPress={() => router.push('/(customer)/bookings')}
                style={[
                  styles.bookingsNavBtn,
                  pathname.includes('bookings') && styles.bookingsNavBtnActive,
                ]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={pathname.includes('bookings') ? 'calendar' : 'calendar-outline'}
                  size={16}
                  color={pathname.includes('bookings') ? '#991B1B' : '#0F172A'}
                />
                <Text
                  style={[
                    styles.bookingsNavBtnText,
                    pathname.includes('bookings') && styles.bookingsNavBtnTextActive,
                  ]}
                >
                  My Bookings
                </Text>
                {activeOrdersCount > 0 && (
                  <View style={styles.bookingsBadge}>
                    <Text style={styles.bookingsBadgeText}>{activeOrdersCount} Active</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Cart Button */}
              <TouchableOpacity
                onPress={() => router.push('/(customer)/checkout')}
                style={styles.circleIconButton}
                activeOpacity={0.8}
              >
                <Ionicons name="cart-outline" size={20} color="#111827" />
                {totalCartCount > 0 && (
                  <View style={styles.cartBadgeSmall}>
                    <Text style={styles.cartBadgeTextSmall}>{totalCartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Profile Button with Dropdown containing My Bookings & Edit Profile */}
              <View ref={profileDropdownRef} style={styles.profileWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    setShowProfileMenu(!showProfileMenu);
                    if (showLocationPicker) setShowLocationPicker(false);
                    if (showServicesMenu) setShowServicesMenu(false);
                  }}
                  style={[
                    styles.circleIconButton,
                    showProfileMenu && styles.circleIconButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  {customerProfile.avatarUrl ? (
                    <Image
                      source={{ uri: customerProfile.avatarUrl }}
                      style={styles.circleAvatarImg}
                    />
                  ) : (
                    <Ionicons
                      name={showProfileMenu ? 'person' : 'person-outline'}
                      size={19}
                      color={showProfileMenu ? '#991B1B' : '#111827'}
                    />
                  )}
                  {activeOrdersCount > 0 && (
                    <View style={styles.profileNoticeDot}>
                      <Text style={styles.profileNoticeDotText}>{activeOrdersCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <View style={styles.profileDropdownMenu}>
                    {/* User Info Header with Quick Edit */}
                    <View style={styles.profileDropdownHeader}>
                      <TouchableOpacity
                        onPress={handleOpenEditProfile}
                        style={styles.profileAvatarCircle}
                        activeOpacity={0.8}
                      >
                        {customerProfile.avatarUrl ? (
                          <Image
                            source={{ uri: customerProfile.avatarUrl }}
                            style={styles.profileAvatarImg}
                          />
                        ) : (
                          <Ionicons name="person" size={20} color="#991B1B" />
                        )}
                        <View style={styles.avatarEditPencilBadge}>
                          <Ionicons name="pencil" size={9} color="#FFFFFF" />
                        </View>
                      </TouchableOpacity>

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.profileNameText} numberOfLines={1}>
                          {customerProfile.name}
                        </Text>
                        <Text style={styles.profileLocationText} numberOfLines={1}>
                          {customerProfile.phone}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={handleOpenEditProfile}
                        style={styles.profileHeaderEditBtn}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil" size={11} color="#2563EB" />
                        <Text style={styles.profileHeaderEditText}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.profileMenuDivider} />

                    {/* Item 1: Edit Profile */}
                    <TouchableOpacity
                      style={styles.profileMenuItem}
                      onPress={handleOpenEditProfile}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profileMenuItemLeft}>
                        <View style={[styles.profileMenuIconWrap, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                          <Ionicons name="person-circle-outline" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.profileMenuItemTextBold}>Edit Profile</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                    </TouchableOpacity>

                    {/* Item 2: My Bookings */}
                    <TouchableOpacity
                      style={styles.profileMenuItem}
                      onPress={() => {
                        setShowProfileMenu(false);
                        router.push('/(customer)/bookings');
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profileMenuItemLeft}>
                        <View style={styles.profileMenuIconWrap}>
                          <Ionicons name="calendar" size={17} color="#991B1B" />
                        </View>
                        <Text style={styles.profileMenuItemText}>My Bookings</Text>
                      </View>
                      {activeOrdersCount > 0 ? (
                        <View style={styles.profileOrdersBadge}>
                          <Text style={styles.profileOrdersBadgeText}>{activeOrdersCount} Active</Text>
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                      )}
                    </TouchableOpacity>

                    {/* Saved Addresses */}
                    <TouchableOpacity
                      style={styles.profileMenuItem}
                      onPress={() => {
                        setShowProfileMenu(false);
                        setShowLocationPicker(true);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profileMenuItemLeft}>
                        <View style={styles.profileMenuIconWrap}>
                          <Ionicons name="location-outline" size={17} color="#475569" />
                        </View>
                        <Text style={styles.profileMenuItemText}>Saved Addresses</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                    </TouchableOpacity>

                    {/* Support */}
                    <TouchableOpacity
                      style={styles.profileMenuItem}
                      onPress={() => {
                        setShowProfileMenu(false);
                        router.push('/(customer)');
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profileMenuItemLeft}>
                        <View style={styles.profileMenuIconWrap}>
                          <Ionicons name="headset-outline" size={17} color="#475569" />
                        </View>
                        <Text style={styles.profileMenuItemText}>Help & Support</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      ) : (
        /* MOBILE TOP HEADER (Clean Servicewala style) */
        <View style={[styles.mobileHeader, { paddingTop: Math.max(insets.top, 10) }]}>
          <TouchableOpacity
            onPress={() => router.push('/(customer)')}
            style={styles.mobileLogoRow}
            activeOpacity={0.8}
          >
            <View style={styles.brandSquareBadgeSmall}>
              <Text style={styles.brandSquareTextSmall}>SW</Text>
            </View>
            <View>
              <Text style={styles.mobileBrandTitle}>Servicewala</Text>
            </View>
          </TouchableOpacity>

          <View ref={mobileLocationRef} style={styles.mobileLocationWrap}>
            <TouchableOpacity
              onPress={() => setShowLocationPicker(!showLocationPicker)}
              style={styles.mobileLocationPill}
            >
              <Ionicons name="location-outline" size={13} color="#475569" />
              <Text style={styles.mobileLocationText} numberOfLines={1}>
                {selectedLocation}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#64748B" />
            </TouchableOpacity>

            {showLocationPicker && (
              <View style={styles.mobileLocationDropdownMenu}>
                <View style={styles.locationSearchInputWrap}>
                  <Ionicons name="search-outline" size={13} color="#94A3B8" />
                  <TextInput
                    value={locationSearchQuery}
                    onChangeText={setLocationSearchQuery}
                    placeholder="Search city..."
                    placeholderTextColor="#94A3B8"
                    style={styles.locationSearchInput}
                  />
                  {locationSearchQuery ? (
                    <TouchableOpacity onPress={() => setLocationSearchQuery('')}>
                      <Ionicons name="close-circle" size={14} color="#94A3B8" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {filteredCities.map((city) => (
                  <TouchableOpacity
                    key={city}
                    onPress={() => {
                      setSelectedLocation(city);
                      setShowLocationPicker(false);
                      setLocationSearchQuery('');
                    }}
                    style={[
                      styles.locationMenuItem,
                      selectedLocation === city && styles.locationMenuItemActive,
                    ]}
                  >
                    <Ionicons
                      name="location-sharp"
                      size={14}
                      color={selectedLocation === city ? '#0F172A' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.locationMenuText,
                        selectedLocation === city && styles.locationMenuTextActive,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}

                {filteredCities.length === 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedLocation(locationSearchQuery);
                      setShowLocationPicker(false);
                      setLocationSearchQuery('');
                    }}
                    style={styles.locationMenuItem}
                  >
                    <Ionicons name="add-circle-outline" size={14} color="#0F172A" />
                    <Text style={styles.locationCustomAddText} numberOfLines={1}>
                      {'Use "' + locationSearchQuery + '"'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.mobileActionButtons}>
            <TouchableOpacity
              onPress={() => router.push('/(customer)/checkout')}
              style={styles.mobileCircleBtn}
            >
              <Ionicons name="cart-outline" size={20} color="#111827" />
              {totalCartCount > 0 && (
                <View style={styles.mobileCartBadge}>
                  <Text style={styles.mobileCartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenEditProfile}
              style={styles.mobileCircleBtn}
            >
              {customerProfile.avatarUrl ? (
                <Image
                  source={{ uri: customerProfile.avatarUrl }}
                  style={styles.mobileAvatarImg}
                />
              ) : (
                <Ionicons name="person-outline" size={18} color="#111827" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Page Content */}
      <View style={styles.contentArea}>
        <Slot />
      </View>

      {/* Floating Quick Help & Diagnostic Capsule (Globally visible on Home, Product Details & Categories) */}
      <FloatingHelpCapsule />

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={showEditProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalDismissOverlay}
            onPress={() => setShowEditProfileModal(false)}
            accessibilityLabel="Close Edit Profile modal"
          />

          <View style={styles.editProfileCard}>
            {/* Header */}
            <View style={styles.editProfileHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.editProfileTitle}>Edit Profile</Text>
                <Text style={styles.editProfileSubtitle}>
                  Change your display name, contact, and avatar photo
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowEditProfileModal(false)}
                style={styles.editProfileCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.editProfileBody}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarPreviewWrap}>
                  {editAvatar ? (
                    <Image
                      source={{ uri: editAvatar }}
                      style={styles.avatarPreviewImg}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholderWrap}>
                      <Ionicons name="person" size={38} color="#94A3B8" />
                    </View>
                  )}
                  <View style={styles.avatarPreviewBadge}>
                    <Ionicons name="camera" size={13} color="#FFFFFF" />
                  </View>
                </View>

                <Text style={styles.avatarChooseTitle}>Choose an Avatar Photo</Text>
                <Text style={styles.avatarChooseSub}>
                  Select a stylish preset or paste a custom image link
                </Text>

                {/* Preset Avatars Row */}
                <View style={styles.presetAvatarsRow}>
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = editAvatar === preset.url;
                    return (
                      <TouchableOpacity
                        key={preset.id}
                        onPress={() => setEditAvatar(preset.url)}
                        style={[
                          styles.presetAvatarBtn,
                          isSelected && styles.presetAvatarBtnSelected,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: preset.url }}
                          style={styles.presetAvatarImg}
                        />
                        {isSelected && (
                          <View style={styles.presetCheckBadge}>
                            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Custom Image URL Input */}
                <View style={styles.customUrlInputWrap}>
                  <Ionicons name="link-outline" size={15} color="#94A3B8" />
                  <TextInput
                    value={editAvatar}
                    onChangeText={setEditAvatar}
                    placeholder="Or enter custom image URL (https://...)"
                    placeholderTextColor="#94A3B8"
                    style={styles.customUrlInput}
                  />
                  {editAvatar ? (
                    <TouchableOpacity onPress={() => setEditAvatar('')} style={{ padding: 2 }}>
                      <Ionicons name="close-circle" size={15} color="#94A3B8" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {/* Form Input: Full Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <View style={styles.formInputWrap}>
                  <Ionicons name="person-outline" size={16} color="#64748B" />
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="e.g. Saif Ali"
                    placeholderTextColor="#94A3B8"
                    style={styles.formInput}
                  />
                </View>
              </View>

              {/* Form Input: Mobile Number */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Mobile Number</Text>
                <View style={styles.formInputWrap}>
                  <Ionicons name="call-outline" size={16} color="#64748B" />
                  <TextInput
                    value={editPhone}
                    onChangeText={setEditPhone}
                    placeholder="e.g. +91 98765 43210"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    style={styles.formInput}
                  />
                </View>
              </View>

              {/* Form Input: Email Address */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <View style={styles.formInputWrap}>
                  <Ionicons name="mail-outline" size={16} color="#64748B" />
                  <TextInput
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="e.g. saif@example.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.formInput}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.editProfileActions}>
              <TouchableOpacity
                onPress={() => setShowEditProfileModal(false)}
                style={styles.cancelBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  updateCustomerProfile({
                    name: editName.trim() || customerProfile.name,
                    phone: editPhone.trim() || customerProfile.phone,
                    email: editEmail.trim() || customerProfile.email,
                    avatarUrl: editAvatar.trim(),
                  });
                  setShowEditProfileModal(false);
                }}
                style={styles.saveProfileBtn}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text style={styles.saveProfileBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MOBILE BOTTOM TABS */}
      {!isDesktop && (
        <View style={[styles.mobileTabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TouchableOpacity
            onPress={() => router.push('/(customer)')}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name={
                pathname === '/(customer)' || pathname === '/(customer)/'
                  ? 'home'
                  : 'home-outline'
              }
              size={22}
              color={
                pathname === '/(customer)' || pathname === '/(customer)/'
                  ? THEME.colors.primary
                  : '#64748B'
              }
            />
            <Text
              style={[
                styles.mobileTabLabel,
                (pathname === '/(customer)' || pathname === '/(customer)/') &&
                  styles.mobileTabLabelActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(customer)/category/ac-appliances')}
            style={styles.mobileTabItem}
          >
            <Ionicons
              name={pathname.includes('category') ? 'grid' : 'grid-outline'}
              size={22}
              color={pathname.includes('category') ? THEME.colors.primary : '#64748B'}
            />
            <Text
              style={[
                styles.mobileTabLabel,
                pathname.includes('category') && styles.mobileTabLabelActive,
              ]}
            >
              Categories
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(customer)/bookings')}
            style={styles.mobileTabItem}
          >
            <View>
              <Ionicons
                name={pathname.includes('bookings') ? 'calendar' : 'calendar-outline'}
                size={22}
                color={pathname.includes('bookings') ? THEME.colors.primary : '#64748B'}
              />
              {activeOrdersCount > 0 && <View style={styles.mobileDotIndicator} />}
            </View>
            <Text
              style={[
                styles.mobileTabLabel,
                pathname.includes('bookings') && styles.mobileTabLabelActive,
              ]}
            >
              Bookings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(customer)/checkout')}
            style={styles.mobileTabItem}
          >
            <View>
              <Ionicons
                name={pathname.includes('checkout') ? 'cart' : 'cart-outline'}
                size={22}
                color={pathname.includes('checkout') ? THEME.colors.primary : '#64748B'}
              />
              {totalCartCount > 0 && (
                <View style={styles.mobileTabCartBadge}>
                  <Text style={styles.mobileTabCartText}>{totalCartCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.mobileTabLabel,
                pathname.includes('checkout') && styles.mobileTabLabelActive,
              ]}
            >
              Cart
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentArea: {
    flex: 1,
  },
  desktopNav: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  navInner: {
    maxWidth: 1280,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  leftNavGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandSquareBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSquareText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandTitleWrap: {
    justifyContent: 'center',
  },
  brandTitleLine1: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 15,
    letterSpacing: -0.3,
  },
  brandTitleLine2: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 15,
    letterSpacing: -0.3,
  },
  /* All Services Dropdown */
  servicesDropdownWrap: {
    position: 'relative',
    zIndex: 130,
  },
  allServicesNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 42,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as any,
  allServicesNavBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  allServicesNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  allServicesNavBtnTextActive: {
    color: '#2563EB',
  },
  servicesDropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 580,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 12,
    zIndex: 250,
    overflow: 'hidden',
  },
  servicesMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  servicesMenuTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  servicesMenuSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  servicesMenuCountBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  servicesMenuCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  servicesMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  servicesMenuItem: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  servicesMenuItemHovered: {
    backgroundColor: '#F8FAFC',
    borderColor: '#0F172A',
    transform: [{ translateX: 4 }],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  } as any,
  servicesMenuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  servicesMenuIconWrapHovered: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    transform: [{ scale: 1.05 }],
  } as any,
  servicesMenuItemInfo: {
    flex: 1,
  },
  servicesMenuItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    transition: 'color 0.2s ease',
  } as any,
  servicesMenuItemNameHovered: {
    color: '#000000',
    fontWeight: '800',
  },
  servicesMenuItemCount: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  servicesMenuFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  servicesMenuFooterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  servicesMenuFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  servicesMenuFooterLink: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
    cursor: 'pointer',
  } as any,

  /* Direct Bookings Button */
  bookingsNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 42,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as any,
  bookingsNavBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  bookingsNavBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  bookingsNavBtnTextActive: {
    color: '#991B1B',
  },
  bookingsBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookingsBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* Partner CTA */
  partnerNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as any,
  partnerNavBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#166534',
  },
  locationDropdownWrap: {
    position: 'relative',
    zIndex: 110,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 12,
    gap: 8,
    minWidth: 175,
  },
  locationBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    maxWidth: 130,
  },
  locationDropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 200,
  },
  locationSearchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 8,
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationSearchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    padding: 0,
    outlineStyle: 'none' as any,
  },
  locationCustomAddText: {
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  locationMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as any,
  locationMenuItemActive: {
    backgroundColor: '#F1F5F9',
  },
  locationMenuText: {
    fontSize: 13,
    color: '#334151',
    fontWeight: '500',
  },
  locationMenuTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 12,
    gap: 8,
    flex: 1,
    maxWidth: 360,
    minWidth: 200,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
    outlineStyle: 'none' as any,
  },
  rightActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileWrapper: {
    position: 'relative',
    zIndex: 120,
  },
  circleIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleIconButtonActive: {
    borderColor: '#991B1B',
    backgroundColor: '#FEF2F2',
  },
  profileNoticeDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#059669',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileNoticeDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  profileDropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 300,
  },
  profileDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  profileAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  profileAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarEditPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileHeaderEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    cursor: 'pointer',
  } as any,
  profileHeaderEditText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  mobileAvatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  profileNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileLocationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  profileMenuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileMenuIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMenuItemText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  profileMenuItemTextBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  profileOrdersBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  profileOrdersBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  cartBadgeSmall: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#991B1B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeTextSmall: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    zIndex: 50,
  },
  mobileLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandSquareBadgeSmall: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSquareTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  mobileBrandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  mobileLocationWrap: {
    position: 'relative',
    zIndex: 60,
  },
  mobileLocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    maxWidth: 130,
  },
  mobileLocationDropdownMenu: {
    position: 'absolute',
    top: 36,
    left: 0,
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 300,
  },
  mobileLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334151',
  },
  mobileActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mobileCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mobileCartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#991B1B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  mobileCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  mobileTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    ...THEME.shadows.subtle,
  },
  mobileTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  mobileTabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  mobileTabLabelActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  mobileDotIndicator: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  mobileTabCartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 15,
    alignItems: 'center',
  },
  mobileTabCartText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  /* Edit Profile Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}),
  } as any,
  modalDismissOverlay: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  editProfileCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
    overflow: 'hidden',
    zIndex: 10,
  },
  editProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  editProfileTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  editProfileSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  editProfileCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  } as any,
  editProfileBody: {
    maxHeight: 460,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarPreviewWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'relative',
    marginBottom: 10,
  },
  avatarPreviewImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: '#2563EB',
  },
  avatarPlaceholderWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  avatarPreviewBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarChooseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  avatarChooseSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  presetAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  presetAvatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    cursor: 'pointer',
  } as any,
  presetAvatarBtnSelected: {
    borderColor: '#2563EB',
    transform: [{ scale: 1.08 }],
  } as any,
  presetAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  presetCheckBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  customUrlInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    width: '100%',
    maxWidth: 380,
  },
  customUrlInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    padding: 0,
    outlineStyle: 'none' as any,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  formInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  formInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
    outlineStyle: 'none' as any,
  },
  editProfileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer',
  } as any,
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  saveProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    cursor: 'pointer',
  } as any,
  saveProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
