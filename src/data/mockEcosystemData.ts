export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  includes: string[];
  popularBadge?: string;
  warranty?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
  bannerUrl: string;
  tagColor: string;
  serviceCount: number;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  categoryIds: string[];
  primarySkill: string;
  rating: number;
  ratingCount: number;
  completedJobs: number;
  status: 'online' | 'offline' | 'busy';
  kycStatus: 'verified' | 'pending' | 'rejected';
  commissionRate: number; // percentage (e.g. 15%)
  walletBalance: number;
  totalEarnings: number;
  city: string;
  joinedDate: string;
  currentOrderId?: string;
}

export interface OrderItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingOrder {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: {
    street: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  scheduledDate: string;
  scheduledSlot: string;
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTechnicianId?: string;
  startOtp: string;
  endOtp: string;
  paymentMethod: 'online' | 'cash_on_delivery';
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface SpotlightOffer {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  code: string;
  discount: string;
  bgGradient: [string, string];
  targetCategory: string;
}

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'gadgets-repair',
    name: 'Computer & Laptop Repair',
    shortDesc: 'MacBook, Windows laptop, desktop PC assembly & chip-level repair',
    icon: 'Laptop',
    bannerUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
    tagColor: '#6366F1',
    serviceCount: 2,
  },
  {
    id: 'printer-repair',
    name: 'Printer Repair & Maintenance',
    shortDesc: 'LaserJet, InkTank printer servicing & ink cartridge refill',
    icon: 'Print',
    bannerUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80',
    tagColor: '#0EA5E9',
    serviceCount: 1,
  },
  {
    id: 'ac-appliances',
    name: 'Air Conditioner & Appliances',
    shortDesc: 'Split AC deep jet wash, gas refill, refrigerator & washing machine',
    icon: 'Snowflake',
    bannerUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    tagColor: '#3B82F6',
    serviceCount: 7,
  },
  {
    id: 'cleaning',
    name: 'Home Deep Cleaning',
    shortDesc: 'Full home, kitchen, bathroom & sofa sanitization',
    icon: 'Sparkles',
    bannerUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    tagColor: '#10B981',
    serviceCount: 4,
  },
  {
    id: 'home-repairs',
    name: 'Electrician, Plumber & Carpenter',
    shortDesc: 'Instant doorstep fixes within 60 mins',
    icon: 'Wrench',
    bannerUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80',
    tagColor: '#F59E0B',
    serviceCount: 5,
  },
  {
    id: 'salon-women',
    name: "Women's Salon & Spa",
    shortDesc: 'Facials, waxing, manicure, pedicure at home',
    icon: 'Flower2',
    bannerUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    tagColor: '#EC4899',
    serviceCount: 4,
  },
  {
    id: 'salon-men',
    name: "Men's Grooming & Haircut",
    shortDesc: 'Haircut, beard styling, head massage & detox',
    icon: 'Scissors',
    bannerUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    tagColor: '#8B5CF6',
    serviceCount: 3,
  },
  {
    id: 'painting',
    name: 'Painting & Waterproofing',
    shortDesc: 'Laser measurement, dust-free paint & damp check',
    icon: 'Paintbrush',
    bannerUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    tagColor: '#06B6D4',
    serviceCount: 3,
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  // AC & Appliances
  {
    id: 'srv-ac-deep',
    categoryId: 'ac-appliances',
    name: 'Power Jet AC Servicing',
    tagline: '2X deeper foam-jet wash for maximum cooling',
    description: 'Complete indoor & outdoor unit foam cleaning with pressure washer. Reduces power bills by up to 25% and restores ice-cold airflow.',
    price: 599,
    originalPrice: 899,
    duration: '45 mins',
    rating: 4.87,
    reviewCount: 1420,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=80',
    popularBadge: 'Bestseller',
    warranty: '30-day warranty',
    includes: ['Indoor cooling coil foam wash', 'Outdoor unit jet spray', 'Gas pressure leak check', 'Air filter sanitization'],
  },
  {
    id: 'srv-ac-gas',
    categoryId: 'ac-appliances',
    name: 'AC Gas Refill & Leak Fix',
    tagline: 'Pure R32 / R410 refrigerant recharge',
    description: 'High-grade Nitrogen pressure testing to detect hairline leakages, brazing repair, and factory-calibrated gas replenishment.',
    price: 2199,
    originalPrice: 2899,
    duration: '60 mins',
    rating: 4.79,
    reviewCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&q=80',
    warranty: '60-day cool guarantee',
    includes: ['Nitrogen leak diagnosis', 'Copper pipe brazing', 'Pure brand refrigerant refill', 'Cooling temperature check'],
  },
  {
    id: 'srv-wm-repair',
    categoryId: 'ac-appliances',
    name: 'Washing Machine Full Checkup',
    tagline: 'Spin, drainage & mother-board repair',
    description: 'Comprehensive electrical diagnostics for Front Load & Top Load washing machines. Covers drum vibration, drain pumps, and water inlet valve issues.',
    price: 299,
    originalPrice: 499,
    duration: '40 mins',
    rating: 4.72,
    reviewCount: 650,
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&q=80',
    includes: ['Complete error code scan', 'Drum & belt inspection', 'Drain pump testing', 'Transparent spare parts quote'],
  },
  {
    id: 'srv-fridge-repair',
    categoryId: 'ac-appliances',
    name: 'Refrigerator Repair & Gas Refill',
    tagline: 'Single door, double door & inverter frost fix',
    description: 'Expert repair for cooling loss, thermostat failure, defroster coils, and compressor replacement.',
    price: 349,
    originalPrice: 599,
    duration: '45 mins',
    rating: 4.81,
    reviewCount: 740,
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=700&q=80',
    includes: ['Compressor relay test', 'Thermostat calibration', 'Condenser coil cleaning', 'Door rubber seal inspection'],
  },
  {
    id: 'srv-geyser-repair',
    categoryId: 'ac-appliances',
    name: 'Geyser & Water Heater Servicing',
    tagline: 'Heating coil, thermostat & leakage repair',
    description: 'Complete inspection of instant and storage geysers. Heating element replacement, safety valve inspection, and tank descaling.',
    price: 349,
    originalPrice: 499,
    duration: '40 mins',
    rating: 4.83,
    reviewCount: 520,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=700&q=80',
    includes: ['Heating element check', 'Thermostat calibration', 'Water pipe leak fix', 'Tank scale cleaning'],
  },
  {
    id: 'srv-chimney-repair',
    categoryId: 'ac-appliances',
    name: 'Kitchen Chimney Repair & Servicing',
    tagline: 'Motor fix, suction boost & deep degreasing',
    description: 'Expert repair of baffle filter, auto-clean, and ductless kitchen chimneys. Deep chemical degreasing and motor capacitor replacement.',
    price: 499,
    originalPrice: 799,
    duration: '60 mins',
    rating: 4.78,
    reviewCount: 380,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&q=80',
    includes: ['Baffle filter chemical soak', 'Motor speed & suction test', 'Exhaust duct cleaning', 'Light & switch repair'],
  },
  {
    id: 'srv-cooler-repair',
    categoryId: 'ac-appliances',
    name: 'Air Cooler Servicing & Motor Repair',
    tagline: 'Submersible pump, pad replacement & motor check',
    description: 'Full summer servicing for desert and personal air coolers. Honeycomb pad change, water pump replacement, and fan speed repair.',
    price: 299,
    originalPrice: 449,
    duration: '35 mins',
    rating: 4.74,
    reviewCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&q=80',
    includes: ['Submersible pump testing', 'Cooling pad fitment', 'Motor oiling & wiring', 'Water tank disinfection'],
  },

  // Laptop, Desktop & Printer Gadget Repairs
  {
    id: 'srv-laptop-chip',
    categoryId: 'gadgets-repair',
    name: 'Laptop & MacBook Repair',
    tagline: 'Screen, battery, motherboard & OS fixing',
    description: 'Chip-level diagnosis for Apple MacBook, Dell, HP, Lenovo & Asus. Screen replacement, battery swap, liquid damage recovery, and SSD upgrade.',
    price: 499,
    originalPrice: 899,
    duration: '60 mins',
    rating: 4.89,
    reviewCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&q=80',
    popularBadge: 'Popular',
    warranty: '90-day parts warranty',
    includes: ['Hardware diagnostic scan', 'Thermal paste re-application', 'RAM & SSD speed test', 'Original parts quotation'],
  },
  {
    id: 'srv-desktop-repair',
    categoryId: 'gadgets-repair',
    name: 'Desktop PC & Monitor Diagnostics',
    tagline: 'SMPS, motherboard, virus removal & custom assembly',
    description: 'Complete doorstep troubleshooting for desktop computers, gaming rigs, and office PCs. Power supply fix, Windows 11 re-install, and hardware upgrade.',
    price: 399,
    originalPrice: 699,
    duration: '50 mins',
    rating: 4.81,
    reviewCount: 460,
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=700&q=80',
    includes: ['Power supply (SMPS) testing', 'OS & antivirus optimization', 'Display & cabling check', 'Data backup guidance'],
  },
  {
    id: 'srv-printer-repair',
    categoryId: 'printer-repair',
    name: 'Printer & Scanner Repair',
    tagline: 'Paper jam, ink tank head unclog & WiFi setup',
    description: 'Fast doorstep repair for HP, Canon, Epson & Brother ink tank, inkjet, and laser printers. Cartridge nozzle unclogging, roller replacement, and wireless connectivity.',
    price: 349,
    originalPrice: 599,
    duration: '45 mins',
    rating: 4.76,
    reviewCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=700&q=80',
    includes: ['Printhead nozzle flushing', 'Paper feed roller cleaning', 'WiFi network setup', 'Test print color balance check'],
  },

  // Cleaning
  {
    id: 'srv-clean-fullhome',
    categoryId: 'cleaning',
    name: 'Complete Home Deep Cleaning',
    tagline: 'Intensive scrubbing, vacuuming & disinfection',
    description: 'Deep mechanized floor scrubbing, window pane degreasing, bathroom descaling, balcony washing, and hospital-grade sanitization.',
    price: 3499,
    originalPrice: 4999,
    duration: '4-5 hours',
    rating: 4.91,
    reviewCount: 2150,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80',
    popularBadge: 'Popular',
    warranty: '100% satisfaction promise',
    includes: ['Mechanized single-disc floor scrub', 'Cabinet interior & exterior wipe', 'Fan, exhaust & light descaling', 'High-pressure bathroom steam clean'],
  },
  {
    id: 'srv-clean-kitchen',
    categoryId: 'cleaning',
    name: 'Modular Kitchen Degreasing',
    tagline: 'Oil & chimney grime elimination',
    description: 'Heavy grease breakdown on kitchen tiles, chimney exterior, gas stove burners, slab counter-tops, and stainless steel sink polishing.',
    price: 1299,
    originalPrice: 1799,
    duration: '2.5 hours',
    rating: 4.85,
    reviewCount: 1320,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&q=80',
    includes: ['Food-grade degreasing spray', 'Chimney outer wash & filter wash', 'Wall tile joint scrubbing', 'Sink descaling & sanitization'],
  },
  {
    id: 'srv-clean-bathroom',
    categoryId: 'cleaning',
    name: 'Bathroom Stain & Limescale Removal',
    tagline: 'Hard water tile descaling & mirror sparkle',
    description: 'Removal of stubborn yellowish hard-water deposits from ceramic tiles, glass shower partitions, chrome taps, and WC sanitization.',
    price: 499,
    originalPrice: 799,
    duration: '60 mins',
    rating: 4.88,
    reviewCount: 3400,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&q=80',
    popularBadge: 'Most Booked',
    includes: ['Anti-bacterial tile buffing', 'Chrome tap & shower descaling', 'WC & washbasin stain clear', 'Mirror polishing'],
  },
  {
    id: 'srv-clean-sofa',
    categoryId: 'cleaning',
    name: 'Sofa & Fabric Upholstery Shampooing',
    tagline: 'Injection-extraction vacuum wash',
    description: 'Deep fiber stain extraction and industrial vacuuming to suck out mite allergens, food stains, and pet hair.',
    price: 799,
    originalPrice: 1199,
    duration: '90 mins',
    rating: 4.82,
    reviewCount: 980,
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80',
    includes: ['Dry allergen suctioning', 'Foam shampoo agitation', 'Wet water-extraction vacuum', 'Deodorizing freshness spray'],
  },

  // Home Repairs
  {
    id: 'srv-rep-fan',
    categoryId: 'home-repairs',
    name: 'Ceiling Fan Installation & Repair',
    tagline: 'Fast mounting, capacitor swap & wobble fix',
    description: 'Safety check, secure bracket anchoring, step regulator setup, capacitor change, and silent running verification.',
    price: 199,
    originalPrice: 349,
    duration: '30 mins',
    rating: 4.89,
    reviewCount: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&q=80',
    popularBadge: 'Budget Pick',
    includes: ['Wiring continuity check', 'Safety blade balancing', 'Capacitor diagnostic', '30-day rework warranty'],
  },
  {
    id: 'srv-rep-switchboard',
    categoryId: 'home-repairs',
    name: 'Switchboard & MCB Fuse Replacement',
    tagline: 'Short-circuit fix & modular switch fitting',
    description: 'Resolution of sparking switches, faulty MCB trip breakers, high-power AC/Geyser point installations with proper earthing.',
    price: 249,
    originalPrice: 399,
    duration: '35 mins',
    rating: 4.83,
    reviewCount: 1890,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&q=80',
    includes: ['Insulated tools handling', 'Earthing check with tester', 'Load distribution inspection', 'Clean wall fitment'],
  },
  {
    id: 'srv-rep-tap',
    categoryId: 'home-repairs',
    name: 'Plumber: Tap Leakage & Flush Tank Repair',
    tagline: 'Stop water dripping & syphon replacement',
    description: 'Fix dripping mixer taps, spindle replacement, concealed flush valve leakage, and waste pipe clogs.',
    price: 229,
    originalPrice: 349,
    duration: '40 mins',
    rating: 4.76,
    reviewCount: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=700&q=80',
    popularBadge: 'Instant 60m',
    includes: ['Thread tape sealing', 'Washer & spindle check', 'Pressure leak test', 'Clean work area guarantee'],
  },
  {
    id: 'srv-rep-lock',
    categoryId: 'home-repairs',
    name: 'Carpenter: Door Lock & Hinge Fitting',
    tagline: 'Main door deadbolt, handles & alignment',
    description: 'Chiseling, mortise lock installation, cylinder replacement, screeching door adjustment, and wardrobe magnetic catchers.',
    price: 349,
    originalPrice: 499,
    duration: '45 mins',
    rating: 4.74,
    reviewCount: 1120,
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=700&q=80',
    includes: ['Precision router cut', 'Heavy duty screw fitting', 'Smooth lock rotation test', 'No wood splintering'],
  },
  {
    id: 'srv-rep-drain',
    categoryId: 'home-repairs',
    name: 'Severe Drain Blockage Clear',
    tagline: 'Kitchen sink & bathroom pipe snaking',
    description: 'High-torque drain auger snake clearing of grease, hair clogs, and soap buildup without breaking pipes.',
    price: 399,
    originalPrice: 599,
    duration: '45 mins',
    rating: 4.81,
    reviewCount: 1670,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=80',
    includes: ['Auger cable clearance', 'Enzyme drain flush', 'Odor neutralization', 'Flow rate test'],
  },

  // Women's Salon
  {
    id: 'srv-sal-facial',
    categoryId: 'salon-women',
    name: 'O3+ Bridal Glow Facial & Clean-up',
    tagline: 'Instant radiance, dark spot reduction & peel',
    description: 'Multi-stage facial with ultrasonic scrubber, enzymatic peeling, soothing whitening massage mask, and antioxidant serum boost.',
    price: 1499,
    originalPrice: 2299,
    duration: '75 mins',
    rating: 4.93,
    reviewCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&q=80',
    popularBadge: 'Top Rated',
    includes: ['Dead skin exfoliation', 'Blackhead vacuum extraction', 'Hydrating gel massage', 'O3+ brightening seal mask'],
  },
  {
    id: 'srv-sal-waxing',
    categoryId: 'salon-women',
    name: 'Rica Liposoluble Waxing (Full Body)',
    tagline: 'Painless, gentle on sensitive skin',
    description: 'Italian Rica wax formulated for smooth post-wax sheen without redness or rashes. Includes full arms, full legs & underarms.',
    price: 1199,
    originalPrice: 1699,
    duration: '60 mins',
    rating: 4.89,
    reviewCount: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9a89607?w=700&q=80',
    includes: ['Pre-wax soothing lotion', 'Hygienic single-use strips', 'Rica aloe vera wax', 'Post-wax calming oil'],
  },
  {
    id: 'srv-sal-pedi',
    categoryId: 'salon-women',
    name: 'Rose Petal Deluxe Pedicure & Manicure',
    tagline: 'Warm soak, heel scrub & nail shaping',
    description: 'Aromatic essential oils foot soak, pumice callus removal, organic sugar scrub, relaxing reflexology foot massage and gel polish.',
    price: 899,
    originalPrice: 1299,
    duration: '60 mins',
    rating: 4.86,
    reviewCount: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=700&q=80',
    includes: ['Anti-septic warm foot soak', 'Cuticle trim & file', 'Walnut heel polish', 'Hydrating cream massage'],
  },
  {
    id: 'srv-sal-hairspa',
    categoryId: 'salon-women',
    name: "L'Oreal Anti-Frizz Hair Spa & Blowdry",
    tagline: 'Deep conditioning scalp massage & steam',
    description: 'Deep hair fiber nourishing treatment with ozone scalp steamer, argan moisture mask, relaxing neck massage, and blow-dry style.',
    price: 999,
    originalPrice: 1499,
    duration: '60 mins',
    rating: 4.84,
    reviewCount: 1190,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80',
    includes: ['Shampoo wash & detangle', 'Nutritive masque infusion', 'Micro-mist scalp steam', 'Silky serum blow-dry'],
  },

  // Men's Grooming
  {
    id: 'srv-men-haircut',
    categoryId: 'salon-men',
    name: "Men's Designer Haircut & Head Massage",
    tagline: 'Custom scissor styling & cooling mint oil',
    description: 'Precision scissor cut matched to face structure, hygienic disposable cape, neck shave, and 10-minute relaxing almond oil head massage.',
    price: 299,
    originalPrice: 449,
    duration: '35 mins',
    rating: 4.88,
    reviewCount: 4600,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&q=80',
    popularBadge: 'Bestseller',
    includes: ['Stylist consultation', 'Sterilized scissors & trimmer', 'Disposable cape & collar', '10-min pressure-point head massage'],
  },
  {
    id: 'srv-men-beard',
    categoryId: 'salon-men',
    name: 'Royal Beard Shaping & Hot Towel Wrap',
    tagline: 'Sharp razor lines & softening cedarwood oil',
    description: 'Hot towel steam wrap to soften stubble, foil shaver contouring, straight-razor cheek line, and nourishing beard butter.',
    price: 199,
    originalPrice: 299,
    duration: '25 mins',
    rating: 4.82,
    reviewCount: 2300,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=700&q=80',
    includes: ['Warm eucalyptus towel', 'Razor edge detailing', 'Aftershave astringent splash', 'Cedarwood beard shine oil'],
  },
  {
    id: 'srv-men-detox',
    categoryId: 'salon-men',
    name: 'Activated Charcoal De-Tan Face Treatment',
    tagline: 'Instant tan removal & blackhead peel',
    description: 'Detoxifying charcoal mask to pull pollution particles from facial pores, exfoliating walnut bead scrub, and cooling ice globe roll.',
    price: 499,
    originalPrice: 799,
    duration: '35 mins',
    rating: 4.85,
    reviewCount: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9a89607?w=700&q=80',
    includes: ['Deep pore cleanser', 'Charcoal peel-off mask', 'Aloe vera hydrator', 'Ice roller soothing massage'],
  },

  // Painting
  {
    id: 'srv-paint-room',
    categoryId: 'painting',
    name: '1 BHK / Single Room Express Painting',
    tagline: 'Laser quote, zero dust mechanization & Asian Paints',
    description: 'Complete room repainting with motorized sanding machines, 2 coats of Asian Paints Royale Luxury Emulsion, and pre-cleaning masking tape protection.',
    price: 4499,
    originalPrice: 6500,
    duration: '1-2 Days',
    rating: 4.92,
    reviewCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&q=80',
    popularBadge: '3-Year Warranty',
    warranty: '3-Year anti-peel warranty',
    includes: ['Furniture masking with drop sheets', 'Mechanized dust-free wall putty sanding', '1 coat primer + 2 coats premium emulsion', 'Post-service floor cleanup'],
  },
  {
    id: 'srv-paint-waterproof',
    categoryId: 'painting',
    name: 'Roof & Bathroom Damp Waterproofing',
    tagline: 'Moisture meter scan & Dr. Fixit chemical coat',
    description: 'Digital thermal imaging to locate water leakage source behind walls, polymer-modified cementitious coating, and anti-efflorescence barrier.',
    price: 2499,
    originalPrice: 3500,
    duration: '3-4 hours',
    rating: 4.87,
    reviewCount: 710,
    imageUrl: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=700&q=80',
    warranty: '5-Year leakproof guarantee',
    includes: ['Infrared moisture scan', 'Crack injection filling', '2 coats Dr. Fixit Damp Block', 'Water seepage warranty card'],
  },
  {
    id: 'srv-paint-balcony',
    categoryId: 'painting',
    name: 'Exterior Weatherproof Balcony Painting',
    tagline: 'Anti-fungal UV protected exterior coating',
    description: 'High-durability silicone emulsion paint designed to resist heavy monsoon rain, sunlight fading, and algae growth on exterior balcony walls.',
    price: 1899,
    originalPrice: 2600,
    duration: '4 hours',
    rating: 4.81,
    reviewCount: 430,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&q=80',
    includes: ['High pressure wall wash', 'Algae biocide treatment', 'UV reflective primer', 'Apex Ultima exterior coat'],
  },
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-101',
    name: 'Rajesh Verma',
    phone: '+91 98765 43210',
    email: 'rajesh.verma@servicewala.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    categoryIds: ['ac-appliances', 'home-repairs', 'gadgets-repair', 'printer-repair'],
    primarySkill: 'Senior HVAC & Electrical Specialist',
    rating: 4.92,
    ratingCount: 384,
    completedJobs: 412,
    status: 'online',
    kycStatus: 'verified',
    commissionRate: 15,
    walletBalance: 4680,
    totalEarnings: 82400,
    city: 'Bengaluru (Indiranagar / Koramangala)',
    joinedDate: 'Jan 2024',
  },
  {
    id: 'tech-102',
    name: 'Sunita Sharma',
    phone: '+91 98112 34567',
    email: 'sunita.sharma@servicewala.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    categoryIds: ['salon-women'],
    primarySkill: 'Certified Aesthetician & Bridal Stylist',
    rating: 4.96,
    ratingCount: 520,
    completedJobs: 560,
    status: 'online',
    kycStatus: 'verified',
    commissionRate: 18,
    walletBalance: 6150,
    totalEarnings: 114500,
    city: 'Bengaluru (Whitefield / Bellandur)',
    joinedDate: 'Nov 2023',
  },
  {
    id: 'tech-103',
    name: 'Amit Kumar',
    phone: '+91 99887 65432',
    email: 'amit.kumar@servicewala.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    categoryIds: ['home-repairs'],
    primarySkill: 'Master Plumber & Sanitization Lead',
    rating: 4.85,
    ratingCount: 290,
    completedJobs: 330,
    status: 'busy',
    kycStatus: 'verified',
    commissionRate: 15,
    walletBalance: 3200,
    totalEarnings: 64200,
    city: 'Bengaluru (HSR Layout / BTM)',
    joinedDate: 'Mar 2024',
    currentOrderId: 'SW-98124',
  },
  {
    id: 'tech-104',
    name: 'Pooja Patil',
    phone: '+91 97654 32109',
    email: 'pooja.patil@servicewala.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    categoryIds: ['cleaning'],
    primarySkill: 'Mechanized Deep Cleaning Supervisor',
    rating: 4.88,
    ratingCount: 410,
    completedJobs: 440,
    status: 'online',
    kycStatus: 'verified',
    commissionRate: 15,
    walletBalance: 5100,
    totalEarnings: 93800,
    city: 'Bengaluru (Jayanagar / JP Nagar)',
    joinedDate: 'Dec 2023',
  },
  {
    id: 'tech-105',
    name: 'Mohammad Imran',
    phone: '+91 98450 12345',
    email: 'imran.m@servicewala.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    categoryIds: ['salon-men'],
    primarySkill: 'Master Barber & Grooming Expert',
    rating: 4.91,
    ratingCount: 310,
    completedJobs: 345,
    status: 'online',
    kycStatus: 'verified',
    commissionRate: 18,
    walletBalance: 4120,
    totalEarnings: 71900,
    city: 'Bengaluru (Electronic City)',
    joinedDate: 'Feb 2024',
  },
  {
    id: 'tech-106',
    name: 'Vikramjit Singh',
    phone: '+91 98223 88990',
    email: 'vikram.singh@servicewala.in',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    categoryIds: ['painting'],
    primarySkill: 'Asian Paints Certified Contractor',
    rating: 4.84,
    ratingCount: 195,
    completedJobs: 210,
    status: 'offline',
    kycStatus: 'verified',
    commissionRate: 12,
    walletBalance: 7800,
    totalEarnings: 148000,
    city: 'Bengaluru (Hebbal / Yelahanka)',
    joinedDate: 'Jan 2024',
  },
];

export const INITIAL_ORDERS: BookingOrder[] = [
  {
    id: 'ord-1001',
    bookingNumber: 'SW-98124',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98201 12345',
    customerAddress: {
      street: 'Flat 402, Green Glen Glenmark Heights, Bellandur Outer Ring Rd',
      city: 'Bengaluru',
      pincode: '560103',
      landmark: 'Opposite Cloudnine Hospital',
    },
    items: [
      {
        serviceId: 'srv-rep-tap',
        name: 'Plumber: Tap Leakage & Flush Tank Repair',
        price: 229,
        quantity: 2,
      },
      {
        serviceId: 'srv-rep-fan',
        name: 'Ceiling Fan Installation & Repair',
        price: 199,
        quantity: 1,
      },
    ],
    totalAmount: 657,
    discountAmount: 50,
    finalAmount: 607,
    scheduledDate: 'Today',
    scheduledSlot: '04:00 PM - 05:00 PM',
    status: 'in_progress',
    assignedTechnicianId: 'tech-103',
    startOtp: '4821',
    endOtp: '7390',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: '2026-10-27T14:30:00Z',
    notes: 'Please bring spare ceramic tap spindle and tester.',
  },
  {
    id: 'ord-1002',
    bookingNumber: 'SW-98125',
    customerName: 'Karthik Raman',
    customerPhone: '+91 98860 54321',
    customerAddress: {
      street: 'Villa 14, Prestige Silver Oak, ECC Road, Whitefield',
      city: 'Bengaluru',
      pincode: '560066',
      landmark: 'Near ITPL Back Gate',
    },
    items: [
      {
        serviceId: 'srv-ac-deep',
        name: 'Power Jet AC Servicing',
        price: 599,
        quantity: 2,
      },
    ],
    totalAmount: 1198,
    discountAmount: 100,
    finalAmount: 1098,
    scheduledDate: 'Today',
    scheduledSlot: '05:30 PM - 06:30 PM',
    status: 'assigned',
    assignedTechnicianId: 'tech-101',
    startOtp: '1945',
    endOtp: '6218',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: '2026-10-27T15:10:00Z',
    notes: 'Both Split ACs in Master Bedroom and Guest Room.',
  },
  {
    id: 'ord-1003',
    bookingNumber: 'SW-98126',
    customerName: 'Meera Sengupta',
    customerPhone: '+91 97110 99887',
    customerAddress: {
      street: 'Apt 12B, Salarpuria Sattva Greenage, Hosur Main Road, Bommanahalli',
      city: 'Bengaluru',
      pincode: '560068',
      landmark: 'Tower 4, Entry Gate 2',
    },
    items: [
      {
        serviceId: 'srv-sal-facial',
        name: 'O3+ Bridal Glow Facial & Clean-up',
        price: 1499,
        quantity: 1,
      },
      {
        serviceId: 'srv-sal-waxing',
        name: 'Rica Liposoluble Waxing (Full Body)',
        price: 1199,
        quantity: 1,
      },
    ],
    totalAmount: 2698,
    discountAmount: 250,
    finalAmount: 2448,
    scheduledDate: 'Tomorrow',
    scheduledSlot: '11:00 AM - 12:30 PM',
    status: 'requested',
    startOtp: '8392',
    endOtp: '4176',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: '2026-10-27T15:40:00Z',
  },
  {
    id: 'ord-1004',
    bookingNumber: 'SW-98120',
    customerName: 'Aditya Swaminathan',
    customerPhone: '+91 99001 23456',
    customerAddress: {
      street: 'No. 88, 12th Main Road, 4th Block, Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
      landmark: 'Near Sony World Signal',
    },
    items: [
      {
        serviceId: 'srv-clean-bathroom',
        name: 'Bathroom Stain & Limescale Removal',
        price: 499,
        quantity: 2,
      },
    ],
    totalAmount: 998,
    discountAmount: 100,
    finalAmount: 898,
    scheduledDate: 'Yesterday',
    scheduledSlot: '10:00 AM - 11:30 AM',
    status: 'completed',
    assignedTechnicianId: 'tech-104',
    startOtp: '2356',
    endOtp: '9184',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: '2026-10-26T09:00:00Z',
    completedAt: '2026-10-26T11:45:00Z',
  },
];

export const SPOTLIGHT_OFFERS: SpotlightOffer[] = [
  {
    id: 'off-1',
    title: 'Festival Clean Home Sale',
    subtitle: 'Flat 25% OFF on Full Home & Kitchen Deep Scrub',
    badge: 'Limited Period',
    code: 'FESTIVAL25',
    discount: '25% OFF',
    bgGradient: ['#4F46E5', '#7C3AED'],
    targetCategory: 'cleaning',
  },
  {
    id: 'off-2',
    title: 'AC Summer Shield Pass',
    subtitle: 'Power Jet Wash + 30-Day Gas Leak Insurance at ₹599',
    badge: 'Bestseller',
    code: 'COOL599',
    discount: '₹300 SAVINGS',
    bgGradient: ['#0284C7', '#06B6D4'],
    targetCategory: 'ac-appliances',
  },
  {
    id: 'off-3',
    title: 'Salon Luxe Weekend',
    subtitle: 'Free Pedicure worth ₹899 with O3+ Facial',
    badge: 'Weekend Special',
    code: 'LUXEGLOW',
    discount: 'FREE GIFT',
    bgGradient: ['#DB2777', '#E11D48'],
    targetCategory: 'salon-women',
  },
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Priyanka Nambiar',
    role: 'Product Lead • Verified Customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    comment: 'The jet AC wash restored our 5-year-old Daikin unit to whisper-quiet ice cooling. The technician arrived punctually in uniform with a safety kit.',
    rating: 5,
    service: 'Power Jet AC Servicing',
  },
  {
    id: 'test-2',
    name: 'Rohan Mehra',
    role: 'Business Owner • Verified Customer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    comment: 'Booked an emergency plumber at 8:30 PM for a bathroom pipe leak. He was at my gate within 45 minutes and fixed the concealed valve cleanly.',
    rating: 5,
    service: 'Plumber: Tap & Tank Repair',
  },
  {
    id: 'test-3',
    name: 'Shweta Rao',
    role: 'Architect • Verified Customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    comment: 'Sunita arrived with single-use sterile salon kits. The O3+ facial was just as good as a 5-star salon at half the price without leaving my home.',
    rating: 5,
    service: 'O3+ Bridal Glow Facial',
  },
];
