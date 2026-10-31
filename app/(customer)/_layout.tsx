import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ActivityIndicator,
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

const INDIAN_CITIES_COORDS = [
  { name: 'Budge Budge', lat: 22.4827, lon: 88.1818 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Howrah', lat: 22.5958, lon: 88.2636 },
  { name: 'Salt Lake', lat: 22.5867, lon: 88.4178 },
  { name: 'New Town', lat: 22.5898, lon: 88.4744 },
  { name: 'Barasat', lat: 22.723, lon: 88.4819 },
  { name: 'Barrackpore', lat: 22.7667, lon: 88.3667 },
  { name: 'Delhi NCR', lat: 28.6139, lon: 77.209 },
  { name: 'Noida', lat: 28.5355, lon: 77.391 },
  { name: 'Gurgaon', lat: 28.4595, lon: 77.0266 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Thane', lat: 19.2183, lon: 72.9781 },
  { name: 'Navi Mumbai', lat: 19.033, lon: 73.0297 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
  { name: 'Patna', lat: 25.5941, lon: 85.1376 },
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362 },
];

function extractBestLocality(data: any): string | null {
  if (!data) return null;

  // 1. Locality or Town or Suburb (most specific neighborhood or municipality, e.g. Budge Budge)
  const specificLocality =
    data.locality ||
    data.town ||
    data.suburb ||
    data.village ||
    data.neighbourhood ||
    data.cityDistrict;

  if (specificLocality && typeof specificLocality === 'string' && specificLocality.trim()) {
    return specificLocality.trim();
  }

  // 2. Check BigDataCloud administrative levels (higher order = more specific local entity)
  if (data.localityInfo && Array.isArray(data.localityInfo.administrative)) {
    const adminItems = [...data.localityInfo.administrative].reverse();
    for (const item of adminItems) {
      if (item && item.name && typeof item.name === 'string') {
        const name = item.name.trim();
        const isGeneric = ['India', 'West Bengal', 'District', 'Division', 'Subdivision'].some(
          (g) => name.toLowerCase().includes(g.toLowerCase())
        );
        if (!isGeneric && name.length > 2) {
          return name;
        }
      }
    }
  }

  // 3. Fallback to city or principal subdivision
  const broader = data.city || data.principalSubdivision;
  if (broader && typeof broader === 'string' && broader.trim()) {
    return broader.trim();
  }

  return null;
}

function getNearestIndianCity(lat: number, lon: number): string {
  let closest = 'Budge Budge';
  let minDist = Infinity;
  for (const c of INDIAN_CITIES_COORDS) {
    const dist = (lat - c.lat) ** 2 + (lon - c.lon) ** 2;
    if (dist < minDist) {
      minDist = dist;
      closest = c.name;
    }
  }
  return closest;
}

interface LocationSuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  fullLocation: string;
  distanceKm?: number;
}

const POPULAR_AREAS_DATABASE: {
  title: string;
  subtitle: string;
  city: string;
  distanceKm?: number;
}[] = [
  // Bishukhanra & Budge Budge II Localities (Uber / Doorstep Landmarks)
  {
    title: 'BISHUKHANRA SISHU SIKSHA KENDRA',
    subtitle: 'F52F+8PH, Bishukhanra, Nishchintapur, Hasnecha, West Bengal',
    city: 'Budge Budge',
    distanceKm: 22,
  },
  {
    title: 'Bishukhanra Modern Society Club',
    subtitle: 'Nishchintapur, Hasnecha, Kolkata, West Bengal',
    city: 'Budge Budge',
    distanceKm: 23,
  },
  {
    title: 'Bishukhnara Jumma Masjid',
    subtitle: 'KP Mondal Road, Buita, Hasnecha, Kolkata, West Bengal',
    city: 'Budge Budge',
    distanceKm: 23,
  },
  {
    title: 'Bishukhara Madrasa Miftaull Ullum',
    subtitle: 'Nishchintapur, Hasnecha, Kolkata, West Bengal',
    city: 'Budge Budge',
    distanceKm: 23,
  },
  {
    title: 'Buita Bishukhara',
    subtitle: 'Budge Budge, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 23,
  },
  {
    title: 'Bishukhanra',
    subtitle: 'Nishchintapur Gram Panchayat, Budge Budge II, West Bengal',
    city: 'Budge Budge',
    distanceKm: 22,
  },
  {
    title: 'Buita',
    subtitle: 'Budge Budge - I, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 21,
  },
  {
    title: 'Hasnecha',
    subtitle: 'Budge Budge II, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 22,
  },
  {
    title: 'Nishchintapur',
    subtitle: 'Budge Budge II, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 22,
  },
  {
    title: 'Taratala Auto Stand',
    subtitle: 'Taratala Crossing, Diamond Harbour Rd, Kolkata',
    city: 'Kolkata',
    distanceKm: 1,
  },
  {
    title: 'Batanagar Riverside',
    subtitle: 'Calcutta Riverside, Maheshtala, West Bengal',
    city: 'Kolkata',
    distanceKm: 12,
  },
  {
    title: 'Pujali',
    subtitle: 'South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 18,
  },
  {
    title: 'Achipur',
    subtitle: 'Budge Budge II, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 25,
  },
  {
    title: 'Nodakhali',
    subtitle: 'Budge Budge II, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 26,
  },
  {
    title: 'Raypur',
    subtitle: 'Budge Budge II, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 28,
  },
  {
    title: 'Burul',
    subtitle: 'South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 32,
  },
  {
    title: 'Dongaria',
    subtitle: 'Budge Budge II, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 24,
  },
  {
    title: 'Amtala',
    subtitle: 'Diamond Harbour Rd, South 24 Parganas, West Bengal',
    city: 'Kolkata',
    distanceKm: 25,
  },
  {
    title: 'Nangi',
    subtitle: 'Budge Budge Trunk Rd, South 24 Parganas, West Bengal',
    city: 'Budge Budge',
    distanceKm: 14,
  },
  {
    title: 'Budge Budge Railway Station',
    subtitle: 'Station Road, Budge Budge, West Bengal',
    city: 'Budge Budge',
    distanceKm: 19,
  },
  {
    title: 'Budge Budge Ferry Ghat',
    subtitle: 'Hooghly Riverfront, Budge Budge, West Bengal',
    city: 'Budge Budge',
    distanceKm: 20,
  },
  {
    title: 'Budge Budge Trunk Road',
    subtitle: 'Maheshtala - Budge Budge, West Bengal',
    city: 'Budge Budge',
    distanceKm: 16,
  },
  {
    title: 'Jinjira Bazar',
    subtitle: 'Maheshtala, South 24 Parganas, West Bengal',
    city: 'Kolkata',
    distanceKm: 8,
  },
  {
    title: 'Brace Bridge',
    subtitle: 'Taratala, Kolkata, West Bengal',
    city: 'Kolkata',
    distanceKm: 5,
  },
  {
    title: 'Majerhat',
    subtitle: 'Diamond Harbour Rd, Kolkata',
    city: 'Kolkata',
    distanceKm: 3,
  },
  {
    title: 'Diamond Harbour',
    subtitle: 'South 24 Parganas, West Bengal',
    city: 'Kolkata',
    distanceKm: 45,
  },
  {
    title: 'Sarisha',
    subtitle: 'Diamond Harbour Rd, South 24 Parganas, West Bengal',
    city: 'Kolkata',
    distanceKm: 35,
  },
  {
    title: 'Falta',
    subtitle: 'SEZ, South 24 Parganas, West Bengal',
    city: 'Kolkata',
    distanceKm: 42,
  },

  // Kolkata, Howrah & 24 Parganas
  { title: 'Taratala', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Taratala Road', subtitle: 'Taratala, Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Taratala Crossing', subtitle: 'Diamond Harbour Rd, Kolkata', city: 'Kolkata' },
  { title: 'Behala', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Behala Chowrasta', subtitle: 'Diamond Harbour Rd, Kolkata', city: 'Kolkata' },
  { title: 'Behala Tram Depot', subtitle: 'Behala, Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Budge Budge', subtitle: 'South 24 Parganas, West Bengal', city: 'Budge Budge' },
  { title: 'Batanagar', subtitle: 'Maheshtala, South 24 Parganas, West Bengal', city: 'Kolkata' },
  { title: 'Maheshtala', subtitle: 'South 24 Parganas, West Bengal', city: 'Kolkata' },
  { title: 'Jadavpur', subtitle: 'South Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Jadavpur 8B Bus Stand', subtitle: 'Jadavpur, Kolkata', city: 'Kolkata' },
  { title: 'Garia', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Gariahat', subtitle: 'South Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Tollygunge', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Salt Lake (Bidhannagar)', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Salt Lake Sector V', subtitle: 'IT & Tech Hub, Kolkata', city: 'Kolkata' },
  { title: 'Salt Lake City Centre 1', subtitle: 'DC Block, Sector 1, Salt Lake, Kolkata', city: 'Kolkata' },
  { title: 'New Town', subtitle: 'Action Area I, II, III, Kolkata', city: 'Kolkata' },
  { title: 'New Town Eco Park', subtitle: 'Major Arterial Rd, New Town, Kolkata', city: 'Kolkata' },
  { title: 'Rajarhat', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Alipore', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Ballygunge', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Park Street', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Esplanade', subtitle: 'Central Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Shyambazar', subtitle: 'North Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Howrah', subtitle: 'Howrah, West Bengal', city: 'Howrah' },
  { title: 'Howrah Station', subtitle: 'Station Rd, Howrah, West Bengal', city: 'Howrah' },
  { title: 'Dum Dum', subtitle: 'North 24 Parganas, West Bengal', city: 'Kolkata' },
  { title: 'Dum Dum Airport (CCU)', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Barasat', subtitle: 'North 24 Parganas, West Bengal', city: 'Barasat' },
  { title: 'Barrackpore', subtitle: 'North 24 Parganas, West Bengal', city: 'Barrackpore' },
  { title: 'Kasba', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Ruby / Anandapur', subtitle: 'EM Bypass, Kolkata', city: 'Kolkata' },
  { title: 'Joka', subtitle: 'Diamond Harbour Rd, Kolkata', city: 'Kolkata' },
  { title: 'Thakurpukur', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Bhowanipore', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Lake Gardens', subtitle: 'South Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Kestopur', subtitle: 'VIP Road, Kolkata', city: 'Kolkata' },
  { title: 'Baguiati', subtitle: 'VIP Road, Kolkata', city: 'Kolkata' },
  { title: 'Ultadanga', subtitle: 'North Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Phoolbagan', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Kankurgachi', subtitle: 'Kolkata, West Bengal', city: 'Kolkata' },
  { title: 'Sodepur', subtitle: 'BT Road, North 24 Parganas', city: 'Kolkata' },
  { title: 'Madhyamgram', subtitle: 'North 24 Parganas, West Bengal', city: 'Kolkata' },
  { title: 'Serampore', subtitle: 'Hooghly, West Bengal', city: 'Kolkata' },

  // Delhi NCR
  { title: 'Connaught Place', subtitle: 'New Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Saket', subtitle: 'South Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Hauz Khas', subtitle: 'South Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Dwarka', subtitle: 'South West Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Rohini', subtitle: 'North West Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Karol Bagh', subtitle: 'Central Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Vasant Kunj', subtitle: 'South Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Lajpat Nagar', subtitle: 'South Delhi, Delhi', city: 'Delhi NCR' },
  { title: 'Noida Sector 18', subtitle: 'Gautam Buddha Nagar, UP', city: 'Noida' },
  { title: 'Noida Sector 62', subtitle: 'Gautam Buddha Nagar, UP', city: 'Noida' },
  { title: 'Greater Noida', subtitle: 'Gautam Buddha Nagar, UP', city: 'Delhi NCR' },
  { title: 'Indirapuram', subtitle: 'Ghaziabad, UP', city: 'Delhi NCR' },
  { title: 'Cyber City', subtitle: 'DLF Phase 2, Gurgaon, Haryana', city: 'Gurgaon' },
  { title: 'Golf Course Road', subtitle: 'Sector 54, Gurgaon, Haryana', city: 'Gurgaon' },

  // Mumbai MMR
  { title: 'Andheri West', subtitle: 'Mumbai Suburban, Maharashtra', city: 'Mumbai' },
  { title: 'Andheri East', subtitle: 'Mumbai Suburban, Maharashtra', city: 'Mumbai' },
  { title: 'Bandra West', subtitle: 'Mumbai Suburban, Maharashtra', city: 'Mumbai' },
  { title: 'Bandra Kurla Complex (BKC)', subtitle: 'Bandra East, Mumbai', city: 'Mumbai' },
  { title: 'Juhu', subtitle: 'Vile Parle, Mumbai', city: 'Mumbai' },
  { title: 'Powai', subtitle: 'Hiranandani Gardens, Mumbai', city: 'Mumbai' },
  { title: 'Borivali West', subtitle: 'Mumbai Suburban, Maharashtra', city: 'Mumbai' },
  { title: 'Colaba', subtitle: 'South Mumbai, Maharashtra', city: 'Mumbai' },
  { title: 'Dadar', subtitle: 'Central Mumbai, Maharashtra', city: 'Mumbai' },
  { title: 'Thane West', subtitle: 'Thane, Maharashtra', city: 'Thane' },
  { title: 'Vashi', subtitle: 'Navi Mumbai, Maharashtra', city: 'Navi Mumbai' },

  // Bengaluru
  { title: 'Koramangala', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru' },
  { title: 'Indiranagar', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru' },
  { title: 'Whitefield', subtitle: 'ITPL Main Rd, Bengaluru', city: 'Bengaluru' },
  { title: 'HSR Layout', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru' },
  { title: 'Electronic City', subtitle: 'Phase 1 & 2, Bengaluru', city: 'Bengaluru' },
  { title: 'Jayanagar', subtitle: 'South Bengaluru, Karnataka', city: 'Bengaluru' },
  { title: 'JP Nagar', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru' },
  { title: 'Marathahalli', subtitle: 'Outer Ring Rd, Bengaluru', city: 'Bengaluru' },
  { title: 'Bellandur', subtitle: 'Outer Ring Rd, Bengaluru', city: 'Bengaluru' },

  // Hyderabad
  { title: 'HITEC City', subtitle: 'Madhapur, Hyderabad, Telangana', city: 'Hyderabad' },
  { title: 'Gachibowli', subtitle: 'Financial District, Hyderabad', city: 'Hyderabad' },
  { title: 'Madhapur', subtitle: 'Cyberabad, Hyderabad', city: 'Hyderabad' },
  { title: 'Banjara Hills', subtitle: 'Road No. 1-14, Hyderabad', city: 'Hyderabad' },
  { title: 'Jubilee Hills', subtitle: 'Hyderabad, Telangana', city: 'Hyderabad' },
  { title: 'Kondapur', subtitle: 'Hyderabad, Telangana', city: 'Hyderabad' },

  // Pune
  { title: 'Baner', subtitle: 'Pune, Maharashtra', city: 'Pune' },
  { title: 'Kothrud', subtitle: 'Pune, Maharashtra', city: 'Pune' },
  { title: 'Wakad', subtitle: 'Pimpri-Chinchwad, Pune', city: 'Pune' },
  { title: 'Hinjewadi', subtitle: 'Phase 1-3 IT Park, Pune', city: 'Pune' },
  { title: 'Viman Nagar', subtitle: 'Pune, Maharashtra', city: 'Pune' },
  { title: 'Koregaon Park', subtitle: 'Pune, Maharashtra', city: 'Pune' },

  // Chennai
  { title: 'T. Nagar', subtitle: 'Chennai, Tamil Nadu', city: 'Chennai' },
  { title: 'Adyar', subtitle: 'South Chennai, Tamil Nadu', city: 'Chennai' },
  { title: 'Velachery', subtitle: 'Chennai, Tamil Nadu', city: 'Chennai' },
  { title: 'Anna Nagar', subtitle: 'Chennai, Tamil Nadu', city: 'Chennai' },
  { title: 'OMR (IT Corridor)', subtitle: 'Old Mahabalipuram Rd, Chennai', city: 'Chennai' },
];

export default function CustomerLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const {
    cart,
    orders,
    categories,
    customerProfile,
    updateCustomerProfile,
    addNotification,
    selectedLocation,
    setSelectedLocation,
  } = useEcosystemStore();

  const [headerSearch, setHeaderSearch] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [userGpsCoords, setUserGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [hoveredMenuCat, setHoveredMenuCat] = useState<string | null>(null);

  const handleDetectCurrentLocation = () => {
    setIsDetectingLocation(true);

    const applyDetectedCity = (city: string, isFromGps: boolean = true) => {
      const normalizedCity = city.trim();
      let finalCity = normalizedCity;

      // Telecom Cellular Gateway Safeguard:
      // Mobile 4G/5G cellular IP pools in West Bengal (Jio, Airtel, Vi) physically route through core gateways in Barakpur/Barrackpore.
      // If detection is from an IP fallback (not hardware GPS satellites), prevent incorrectly shifting the user to the remote cellular gateway city.
      if (
        !isFromGps &&
        (normalizedCity.toLowerCase().includes('barakpur') ||
          normalizedCity.toLowerCase().includes('barrackpore'))
      ) {
        finalCity =
          selectedLocation && selectedLocation !== 'All India'
            ? selectedLocation
            : 'Budge Budge';
      }

      setSelectedLocation(finalCity);
      setIsDetectingLocation(false);
      setShowLocationPicker(false);
      setLocationSearchQuery('');
      addNotification({
        title: isFromGps ? 'Location Detected' : 'Location Updated',
        message: `Your service location has been set to ${finalCity}.`,
        targetPortal: 'customer',
      });
    };

    const resolveCoordsToCity = async (latitude: number, longitude: number) => {
      setUserGpsCoords({ lat: latitude, lon: longitude });
      // 1. Primary reverse geocode provider: BigDataCloud (locality-first)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const detected = extractBestLocality(data);
          if (detected) {
            applyDetectedCity(detected, true);
            return;
          }
        }
      } catch {
        // Fallback to secondary provider
      }

      // 2. Secondary reverse geocode provider: OpenStreetMap Nominatim
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=15&addressdetails=1`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          const nomData = await res.json();
          const addr = nomData.address || {};
          const candidate =
            addr.town ||
            addr.suburb ||
            addr.village ||
            addr.neighbourhood ||
            addr.city_district ||
            addr.city ||
            addr.county;
          if (candidate) {
            applyDetectedCity(candidate, true);
            return;
          }
        }
      } catch {
        // Fallback to coordinate distance
      }

      // 3. Mathematical closest coordinate match from database
      const nearest = getNearestIndianCity(latitude, longitude);
      applyDetectedCity(nearest, true);
    };

    const resolveByIpOrFallback = async () => {
      // If mobile browser blocks GPS on HTTP, query BigDataCloud by client IP (returns exact locality)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const detected = extractBestLocality(data);
          if (detected) {
            applyDetectedCity(detected, false);
            return;
          }
        }
      } catch {
        // Next IP provider
      }

      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const ipData = await res.json();
          const detected = ipData.city || ipData.region;
          if (detected) {
            applyDetectedCity(detected, false);
            return;
          }
        }
      } catch {}

      // Default to Budge Budge
      applyDetectedCity('Budge Budge', false);
    };

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolveCoordsToCity(latitude, longitude);
        },
        () => {
          // GPS denied or blocked (e.g. mobile HTTP origin) -> use IP detection with cellular safeguard
          resolveByIpOrFallback();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      resolveByIpOrFallback();
    }
  };

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
        document.addEventListener('mousedown', handleOutsideClick, true);
        document.addEventListener('touchstart', handleOutsideClick, true);
        document.addEventListener('click', handleOutsideClick, true);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick, true);
          document.removeEventListener('touchstart', handleOutsideClick, true);
          document.removeEventListener('click', handleOutsideClick, true);
          document.removeEventListener('keydown', handleKeyDown);
        };
      }
    }
  }, [showLocationPicker, showProfileMenu, showServicesMenu]);

  // Address Autocomplete State (Swiggy / Zomato / Urban Company Style)
  const [apiSuggestions, setApiSuggestions] = useState<LocationSuggestionItem[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    setShowLocationPicker(false);
    setLocationSearchQuery('');
    addNotification({
      title: 'Location Updated',
      message: `Your service location has been set to ${loc}.`,
      targetPortal: 'customer',
    });
  };

  // Active geographical coordinates (user GPS or selected city coordinates for proximity biasing)
  const activeCoords = useMemo(() => {
    if (userGpsCoords) return userGpsCoords;
    const match = INDIAN_CITIES_COORDS.find(
      (c) => c.name.toLowerCase() === selectedLocation.toLowerCase()
    );
    if (match) return { lat: match.lat, lon: match.lon };
    return { lat: 22.4827, lon: 88.1818 }; // Default Budge Budge / Kolkata
  }, [userGpsCoords, selectedLocation]);

  // 1. Instant match from comprehensive Indian localities database (0ms latency, zero render cascade)
  const localMatches = useMemo(() => {
    const q = locationSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return POPULAR_AREAS_DATABASE.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
    )
      .slice(0, 8)
      .map((a, i) => ({
        id: `local-${i}-${a.title}`,
        title: a.title,
        subtitle: a.subtitle,
        fullLocation: `${a.title}, ${a.city}`,
        distanceKm: a.distanceKm,
      }));
  }, [locationSearchQuery]);

  // Combined suggestions (Local + Live API, deduplicated)
  const liveSuggestions = useMemo(() => {
    const q = locationSearchQuery.trim();
    if (!q) return [];
    const titles = new Set<string>();
    const combined: LocationSuggestionItem[] = [];
    for (const item of [...localMatches, ...apiSuggestions]) {
      const key = item.title.toLowerCase();
      if (!titles.has(key)) {
        titles.add(key);
        combined.push(item);
      }
    }
    return combined.slice(0, 10);
  }, [localMatches, apiSuggestions, locationSearchQuery]);

  // 2. Debounced API live search: STRICT India only, proximity biased towards active locality
  useEffect(() => {
    const q = locationSearchQuery.trim();
    if (!q) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingPlaces(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const targetLat = activeCoords.lat;
        const targetLon = activeCoords.lon;

        // Query Photon with proximity bias (&lat=&lon=) and higher candidate limit
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            q
          )}&limit=25&lang=en&lat=${targetLat}&lon=${targetLon}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.features)) {
            const apiItems: LocationSuggestionItem[] = [];

            for (const f of data.features) {
              const p = f.properties || {};
              const name = p.name || p.street || '';
              if (!name) continue;

              const country = (p.country || '').trim().toLowerCase();
              const countryCode = (p.countrycode || '').trim().toLowerCase();
              const state = (p.state || '').trim().toLowerCase();

              // 1. STRICT REJECTION of foreign countries (Nepal, Saudi Arabia, USA, China, etc.)
              const isForeign =
                (countryCode && countryCode !== 'in') ||
                [
                  'nepal',
                  'saudi arabia',
                  'united states',
                  'usa',
                  'china',
                  'bangladesh',
                  'pakistan',
                  'iran',
                  'congo',
                  'nigeria',
                  'tanzania',
                  'united kingdom',
                  'canada',
                  'germany',
                  'russia',
                ].some((c) => country.includes(c));

              if (isForeign) {
                continue;
              }

              // 2. Verified India only
              const isIndia =
                countryCode === 'in' ||
                country === 'india' ||
                country === 'bharat' ||
                [
                  'west bengal',
                  'delhi',
                  'maharashtra',
                  'karnataka',
                  'tamil nadu',
                  'telangana',
                  'uttar pradesh',
                  'gujarat',
                  'rajasthan',
                  'punjab',
                  'haryana',
                  'kerala',
                  'bihar',
                  'odisha',
                  'madhya pradesh',
                  'assam',
                  'bengal',
                ].some((s) => state.includes(s));

              if (!isIndia) {
                continue;
              }

              // 3. Calculate distance in km from user's active coordinates
              let distKm: number | undefined;
              if (
                Array.isArray(f.geometry?.coordinates) &&
                f.geometry.coordinates.length >= 2
              ) {
                const [pLon, pLat] = f.geometry.coordinates;
                const dLat = (pLat - targetLat) * 111;
                const dLon =
                  (pLon - targetLon) *
                  111 *
                  Math.cos((targetLat * Math.PI) / 180);
                distKm = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));
              }

              const parts = [p.district, p.city, p.state].filter(Boolean);
              const uniqueParts = Array.from(new Set(parts));

              apiItems.push({
                id: `photon-${p.osm_id || name}-${Math.random().toString(36).substring(7)}`,
                title: name,
                subtitle: uniqueParts.join(', ') || 'India',
                fullLocation: `${name}, ${p.city || p.district || p.state || 'India'}`,
                distanceKm: distKm,
              });
            }

            // Sort API items by proximity to user (closest first)
            apiItems.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));

            setApiSuggestions(apiItems.slice(0, 8));
          }
        }
      } catch {
        // Fallback or offline: local matches already populated
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [locationSearchQuery, activeCoords]);

  const renderLocationPickerBody = (isMobileView: boolean) => (
    <>
      {/* Search Input inside Dropdown */}
      <View style={styles.locationSearchInputWrap}>
        <Ionicons name="search-outline" size={13} color="#94A3B8" />
        <TextInput
          value={locationSearchQuery}
          onChangeText={setLocationSearchQuery}
          placeholder="Search area, landmark, street..."
          placeholderTextColor="#94A3B8"
          style={styles.locationSearchInput}
          autoFocus={!isMobileView}
        />
        {isSearchingPlaces && (
          <ActivityIndicator size="small" color="#991B1B" style={{ marginRight: 4 }} />
        )}
        {locationSearchQuery ? (
          <TouchableOpacity onPress={() => setLocationSearchQuery('')}>
            <Ionicons name="close-circle" size={14} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        style={styles.locationScrollList}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {locationSearchQuery.trim().length > 0 ? (
          /* Live Search Suggestions (Swiggy / Zomato / Urban Company style) */
          <>
            <View style={styles.citiesSectionDivider}>
              <Text style={styles.citiesSectionLabel}>
                {isSearchingPlaces ? 'SEARCHING LOCATIONS...' : 'SUGGESTED PLACES'}
              </Text>
            </View>

            {liveSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectLocation(item.title)}
                style={styles.suggestionItem}
                activeOpacity={0.7}
              >
                <View style={styles.suggestionIconWrap}>
                  <Ionicons name="location-sharp" size={14} color="#991B1B" />
                </View>
                <View style={styles.suggestionTextWrap}>
                  <Text style={styles.suggestionTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.suggestionSubRow}>
                    {item.distanceKm != null && item.distanceKm > 0 && (
                      <View style={styles.suggestionDistanceBadge}>
                        <Text style={styles.suggestionDistanceText}>
                          {item.distanceKm < 1 ? '< 1 km' : `${item.distanceKm} km`}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={12} color="#CBD5E1" />
              </TouchableOpacity>
            ))}

            {/* Custom Add Option */}
            <TouchableOpacity
              onPress={() => handleSelectLocation(locationSearchQuery.trim())}
              style={styles.locationCustomAddRow}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={16} color="#059669" />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationCustomAddTitle}>
                  {'Deliver to "' + locationSearchQuery.trim() + '"'}
                </Text>
                <Text style={styles.locationCustomAddSub}>Use this exact location</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          /* Empty Search State: GPS Auto-Detect + Current & All India Selection (No static city clutter) */
          <View style={styles.emptyLocationWrap}>
            {/* Primary Action: USE CURRENT LOCATION BUTTON */}
            <TouchableOpacity
              onPress={handleDetectCurrentLocation}
              disabled={isDetectingLocation}
              style={styles.useCurrentLocationBtn}
              activeOpacity={0.7}
            >
              <View style={styles.useCurrentLocationIconWrap}>
                {isDetectingLocation ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : (
                  <Ionicons name="navigate-circle" size={22} color="#059669" />
                )}
              </View>
              <View style={styles.useCurrentLocationTextWrap}>
                <Text style={styles.useCurrentLocationTitle}>
                  {isDetectingLocation ? 'Detecting location...' : 'Use current location'}
                </Text>
                <Text style={styles.useCurrentLocationSub} numberOfLines={1}>
                  {isDetectingLocation ? 'Fetching via GPS & Wi-Fi' : 'Detect accurately via GPS'}
                </Text>
              </View>
              <View style={styles.useCurrentLocationGpsTag}>
                <Text style={styles.useCurrentLocationGpsText}>GPS</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.citiesSectionDivider}>
              <Text style={styles.citiesSectionLabel}>YOUR SELECTION & BROWSING</Text>
            </View>

            {/* Active / Current Location Item */}
            {selectedLocation && selectedLocation !== 'All India' && (
              <TouchableOpacity
                onPress={() => handleSelectLocation(selectedLocation)}
                style={[styles.locationMenuItem, styles.locationMenuItemActive]}
                activeOpacity={0.7}
              >
                <Ionicons name="location-sharp" size={15} color="#991B1B" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.locationMenuText, styles.locationMenuTextActive]}>
                    {selectedLocation}
                  </Text>
                  <Text style={styles.locationSubTag}>Currently Selected</Text>
                </View>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
              </TouchableOpacity>
            )}

            {/* All India (Show all services across India) */}
            <TouchableOpacity
              onPress={() => handleSelectLocation('All India')}
              style={[
                styles.locationMenuItem,
                selectedLocation === 'All India' && styles.locationMenuItemActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="globe-outline"
                size={15}
                color={selectedLocation === 'All India' ? '#991B1B' : '#64748B'}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.locationMenuText,
                    selectedLocation === 'All India' && styles.locationMenuTextActive,
                  ]}
                >
                  All India
                </Text>
                <Text style={styles.locationSubTag}>Browse all doorstep services</Text>
              </View>
              {selectedLocation === 'All India' && (
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
              )}
            </TouchableOpacity>

            {/* Helpful Search Tip */}
            <View style={styles.searchTipBox}>
              <Ionicons name="search" size={13} color="#94A3B8" />
              <Text style={styles.searchTipText}>
                Type any area, street or landmark above to find it instantly
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
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
                  <>
                    <Pressable
                      style={styles.dropdownBackdropOverlay}
                      onPress={() => {
                        setShowLocationPicker(false);
                        setLocationSearchQuery('');
                      }}
                      accessibilityLabel="Dismiss location picker"
                    />
                    <View style={styles.locationDropdownMenu}>
                      {renderLocationPickerBody(false)}
                    </View>
                </>
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
        /* MOBILE TOP HEADER (Spacious 2-Row Modern Urban Company Style) */
        <View style={[styles.mobileHeader, { paddingTop: Math.max(insets.top, 8) }]}>
          {/* Row 1: Logo & Location (Left) + Profile Avatar (Right) */}
          <View style={styles.mobileHeaderTopRow}>
            <View style={styles.mobileHeaderLeft}>
              <TouchableOpacity
                onPress={() => router.push('/(customer)')}
                style={styles.mobileLogoRow}
                activeOpacity={0.8}
                accessibilityLabel="Servicewala Home"
              >
                <View style={styles.brandSquareBadgeSmall}>
                  <Text style={styles.brandSquareTextSmall}>SW</Text>
                </View>
              </TouchableOpacity>

              <View ref={mobileLocationRef} style={styles.mobileLocationWrap}>
                <TouchableOpacity
                  onPress={() => setShowLocationPicker(!showLocationPicker)}
                  style={styles.mobileLocationPill}
                  activeOpacity={0.7}
                >
                  <Ionicons name="location" size={13} color="#991B1B" />
                  <Text style={styles.mobileLocationText} numberOfLines={1}>
                    {selectedLocation}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color="#64748B" />
                </TouchableOpacity>

                {showLocationPicker && (
                  <>
                    <Pressable
                      style={styles.dropdownBackdropOverlay}
                      onPress={() => {
                        setShowLocationPicker(false);
                        setLocationSearchQuery('');
                      }}
                      accessibilityLabel="Dismiss location picker"
                    />
                    <View style={styles.mobileLocationDropdownMenu}>
                      {renderLocationPickerBody(true)}
                    </View>
                </>
              )}
            </View>
            </View>

            {/* Profile Button on Top Right (like before) */}
            <TouchableOpacity
              onPress={handleOpenEditProfile}
              style={styles.mobileProfileBtn}
              activeOpacity={0.8}
              accessibilityLabel="Profile & Account"
            >
              {customerProfile.avatarUrl ? (
                <Image
                  source={{ uri: customerProfile.avatarUrl }}
                  style={styles.mobileAvatarImg}
                />
              ) : (
                <Ionicons name="person-outline" size={18} color="#0F172A" />
              )}
              {activeOrdersCount > 0 && (
                <View style={styles.mobileProfileBadgeDot} />
              )}
            </TouchableOpacity>
          </View>

          {/* Row 2: Search Bar (Full Width, Spacious, Never Touching) */}
          <View style={styles.mobileSearchRow}>
            <Ionicons name="search-outline" size={15} color="#64748B" />
            <TextInput
              value={headerSearch}
              onChangeText={setHeaderSearch}
              placeholder="Search for 'AC Repair', 'Laptop', 'Cleaning'..."
              placeholderTextColor="#94A3B8"
              style={styles.mobileSearchInput}
              returnKeyType="search"
              onSubmitEditing={() => {
                if (headerSearch.trim()) {
                  router.push(`/(customer)?q=${encodeURIComponent(headerSearch)}`);
                }
              }}
            />
            {headerSearch.length > 0 && (
              <TouchableOpacity
                onPress={() => setHeaderSearch('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={15} color="#94A3B8" />
              </TouchableOpacity>
            )}
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

          {/* 3. Cart Tab (Placed before Bookings as requested) */}
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

          {/* 4. Bookings Tab (Placed at the end as requested) */}
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
    width: 300,
    maxHeight: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 200,
  },
  locationScrollList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  } as any,
  suggestionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTextWrap: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  suggestionSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  suggestionDistanceBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  suggestionDistanceText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  suggestionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  locationCustomAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    marginTop: 4,
    cursor: 'pointer',
  } as any,
  locationCustomAddTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#065F46',
  },
  locationCustomAddSub: {
    fontSize: 10.5,
    color: '#059669',
    marginTop: 1,
  },
  useCurrentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as any,
  useCurrentLocationIconWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useCurrentLocationTextWrap: {
    flex: 1,
  },
  useCurrentLocationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  useCurrentLocationSub: {
    fontSize: 10,
    color: '#059669',
    marginTop: 1,
  },
  useCurrentLocationGpsTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  useCurrentLocationGpsText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.3,
  },
  emptyLocationWrap: {
    paddingBottom: 4,
  },
  locationSubTag: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  searchTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchTipText: {
    fontSize: 10.5,
    color: '#64748B',
    flex: 1,
    lineHeight: 14,
  },
  citiesSectionDivider: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 2,
  },
  citiesSectionLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
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
  dropdownBackdropOverlay: {
    ...(Platform.OS === 'web'
      ? ({
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        } as any)
      : {
          position: 'absolute',
          top: -2000,
          bottom: -2000,
          left: -2000,
          right: -2000,
        }),
    zIndex: 150,
    backgroundColor: 'transparent',
  },
  mobileHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 100,
  },
  mobileHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  mobileHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  mobileLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandSquareBadgeSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSquareTextSmall: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: -0.5,
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
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  mobileLocationDropdownMenu: {
    position: 'absolute',
    top: 38,
    left: 0,
    width: 280,
    maxHeight: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 300,
  },
  mobileLocationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    maxWidth: 110,
  },
  mobileProfileBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mobileProfileBadgeDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  mobileSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
    marginTop: 8,
  },
  mobileSearchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    padding: 0,
    outlineStyle: 'none' as any,
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
