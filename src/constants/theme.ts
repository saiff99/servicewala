export const THEME = {
  colors: {
    primary: '#4F46E5', // Indigo 600
    primaryDark: '#3730A3',
    primaryLight: '#EEF2FF',
    primaryHover: '#4338CA',

    secondary: '#0F172A', // Slate 900
    secondaryLight: '#1E293B',
    
    accent: '#06B6D4', // Cyan 500
    accentGold: '#F59E0B', // Amber 500

    partnerPrimary: '#059669', // Emerald 600
    partnerDark: '#064E3B',
    partnerLight: '#ECFDF5',

    adminPrimary: '#312E81', // Indigo 900
    adminSidebar: '#0F172A',
    adminAccent: '#8B5CF6',

    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    background: '#F8FAFC',
    card: '#FFFFFF',
    cardMuted: '#F1F5F9',
    surfaceBorder: '#E2E8F0',
    surfaceBorderDark: '#CBD5E1',

    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
    textGold: '#D97706',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    hero: 48,
  },
  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    floating: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 8,
    },
    modal: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 32,
      elevation: 16,
    },
  },
  typography: {
    fontFamilies: {
      sans: 'System',
    },
  },
  breakpoints: {
    mobileMax: 767,
    tabletMin: 768,
    desktopMin: 1024,
    wideMin: 1280,
  },
};

export const currencyFormatter = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
