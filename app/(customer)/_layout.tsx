import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Slot, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME } from '../../src/constants/theme';

const NAV_MENU_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    path: '/(customer)',
    isActive: (p: string) => p === '/(customer)' || p === '/(customer)/',
  },
  {
    id: 'computer',
    label: 'Computer',
    path: '/(customer)/category/gadgets-repair',
    isActive: (p: string) => p.includes('gadgets-repair'),
  },
  {
    id: 'printer',
    label: 'Printer',
    path: '/(customer)/category/printer-repair',
    isActive: (p: string) => p.includes('printer-repair'),
  },
  {
    id: 'ac',
    label: 'Air Conditioner',
    path: '/(customer)/category/ac-appliances',
    isActive: (p: string) => p.includes('ac-appliances'),
  },
];

export default function CustomerLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const { cart, orders } = useEcosystemStore();

  const [headerSearch, setHeaderSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All India');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const locationDropdownRef = useRef<any>(null);
  const profileDropdownRef = useRef<any>(null);
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
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowLocationPicker(false);
          setShowProfileMenu(false);
          setLocationSearchQuery('');
        }
      };

      if (showLocationPicker || showProfileMenu) {
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
  }, [showLocationPicker, showProfileMenu]);

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
            {/* Left: Brand + Nav Links */}
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

              {/* Navigation Links with Hover States (Home, Computer, Printer, Air Conditioner) */}
              <View style={styles.navLinksRow}>
                {NAV_MENU_ITEMS.map((item) => {
                  const isActive = item.isActive(pathname);
                  const isHovered = hoveredNav === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => router.push(item.path as any)}
                      onHoverIn={() => setHoveredNav(item.id)}
                      onHoverOut={() => setHoveredNav(null)}
                      style={[
                        styles.textNavLink,
                        isActive && styles.textNavLinkActive,
                        isHovered && styles.textNavLinkHovered,
                      ]}
                    >
                      <Text
                        style={[
                          styles.textNavLinkLabel,
                          isActive && styles.textNavLinkLabelActive,
                          isHovered && styles.textNavLinkLabelHovered,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Center-Right: Location Selector + Search Bar */}
            <View style={styles.centerInputsGroup}>
              {/* Location Selector Box */}
              <View ref={locationDropdownRef} style={styles.locationDropdownWrap}>
                <TouchableOpacity
                  onPress={() => setShowLocationPicker(!showLocationPicker)}
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

              {/* Search Bar Box */}
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={17} color="#64748B" />
                <TextInput
                  value={headerSearch}
                  onChangeText={setHeaderSearch}
                  placeholder="Search for 'Facial', 'AC Repair'..."
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
            </View>

            {/* Right: Circular Cart & Profile Buttons */}
            <View style={styles.rightActionsGroup}>
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

              {/* Profile Button with Dropdown containing My Bookings */}
              <View ref={profileDropdownRef} style={styles.profileWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    setShowProfileMenu(!showProfileMenu);
                    if (showLocationPicker) setShowLocationPicker(false);
                  }}
                  style={[
                    styles.circleIconButton,
                    showProfileMenu && styles.circleIconButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={showProfileMenu ? 'person' : 'person-outline'}
                    size={19}
                    color={showProfileMenu ? '#991B1B' : '#111827'}
                  />
                  {activeOrdersCount > 0 && (
                    <View style={styles.profileNoticeDot}>
                      <Text style={styles.profileNoticeDotText}>{activeOrdersCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <View style={styles.profileDropdownMenu}>
                    {/* User Info Header */}
                    <View style={styles.profileDropdownHeader}>
                      <View style={styles.profileAvatarCircle}>
                        <Ionicons name="person" size={18} color="#991B1B" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.profileNameText}>Saif (Customer)</Text>
                        <Text style={styles.profileLocationText} numberOfLines={1}>
                          {selectedLocation.split(',')[0]}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.profileMenuDivider} />

                    {/* Primary Item: My Bookings */}
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
                        <Text style={styles.profileMenuItemTextBold}>My Bookings</Text>
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
              onPress={() => router.push('/(customer)/bookings')}
              style={styles.mobileCircleBtn}
            >
              <Ionicons name="person-outline" size={18} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Page Content */}
      <View style={styles.contentArea}>
        <Slot />
      </View>

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
    gap: 28,
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
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textNavLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  textNavLinkActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  textNavLinkHovered: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    transform: [{ translateY: -1 }],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  textNavLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    transition: 'color 0.2s ease',
  } as any,
  textNavLinkLabelActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  textNavLinkLabelHovered: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activeOrdersDot: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  activeOrdersText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  centerInputsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
    maxWidth: 620,
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
    borderColor: '#E5E7EB',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 12,
    gap: 8,
    width: 300,
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
    gap: 12,
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
});
