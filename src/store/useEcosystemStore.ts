import { create } from 'zustand';
import {
  BookingOrder,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_SERVICES,
  INITIAL_TECHNICIANS,
  OrderItem,
  ServiceCategory,
  ServiceItem,
  Technician,
} from '../data/mockEcosystemData';

export type PortalType = 'customer' | 'partner' | 'admin';

export interface EcosystemNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  targetPortal: PortalType;
  orderId?: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
}

const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  name: 'Saif Ali',
  phone: '+91 98765 43210',
  email: 'saif.ali@servicewala.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
};

interface EcosystemState {
  // Customer Profile
  customerProfile: CustomerProfile;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => void;

  // Selected Service Location
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;

  // Navigation & Portal Management
  activePortal: PortalType;
  currentPartnerId: string;
  setActivePortal: (portal: PortalType) => void;
  setCurrentPartnerId: (id: string) => void;

  // Catalog
  categories: ServiceCategory[];
  services: ServiceItem[];
  addCategory: (category: Omit<ServiceCategory, 'id' | 'serviceCount'>) => void;
  addService: (service: Omit<ServiceItem, 'id' | 'rating' | 'reviewCount'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Customer Cart & Checkout
  cart: { [serviceId: string]: number };
  appliedPromo: string | null;
  promoDiscountPercent: number;
  addToCart: (serviceId: string) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  createBooking: (data: {
    customerName: string;
    customerPhone: string;
    customerAddress: {
      street: string;
      city: string;
      pincode: string;
      landmark?: string;
    };
    scheduledDate: string;
    scheduledSlot: string;
    paymentMethod: 'online' | 'cash_on_delivery';
    notes?: string;
  }) => BookingOrder;

  // Bookings & Workflow
  orders: BookingOrder[];
  assignTechnician: (orderId: string, technicianId: string) => void;
  updateOrderStatus: (orderId: string, status: BookingOrder['status']) => void;
  partnerAcceptJob: (orderId: string, technicianId: string) => void;
  partnerStartJob: (orderId: string, enteredOtp: string) => { success: boolean; message: string };
  partnerCompleteJob: (orderId: string, enteredOtp: string) => { success: boolean; message: string };

  // Technicians
  technicians: Technician[];
  addTechnician: (tech: Omit<Technician, 'id' | 'completedJobs' | 'walletBalance' | 'totalEarnings' | 'rating' | 'ratingCount' | 'joinedDate'>) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  toggleTechnicianDuty: (technicianId: string) => void;
  requestWalletPayout: (technicianId: string, amount: number) => { success: boolean; message: string };

  // System Notifications
  notifications: EcosystemNotification[];
  addNotification: (notification: Omit<EcosystemNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Reset to default mock data
  resetEcosystem: () => void;
}

export const useEcosystemStore = create<EcosystemState>((set, get) => ({
  customerProfile: DEFAULT_CUSTOMER_PROFILE,
  updateCustomerProfile: (updates) =>
    set((state) => ({
      customerProfile: { ...state.customerProfile, ...updates },
    })),

  selectedLocation:
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('servicewala_selected_location') || 'Budge Budge'
      : 'Budge Budge',
  setSelectedLocation: (location: string) => {
    set({ selectedLocation: location });
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('servicewala_selected_location', location);
      } catch {}
    }
  },

  activePortal: 'customer',
  currentPartnerId: 'tech-101', // Default partner: Rajesh Verma
  setActivePortal: (portal) => set({ activePortal: portal }),
  setCurrentPartnerId: (id) => set({ currentPartnerId: id }),

  categories: INITIAL_CATEGORIES,
  services: INITIAL_SERVICES,

  addCategory: (categoryData) => {
    const id = `cat-${Date.now()}`;
    const newCategory: ServiceCategory = {
      ...categoryData,
      id,
      serviceCount: 0,
    };
    set((state) => ({
      categories: [...state.categories, newCategory],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'New Category Added',
          message: `Category "${newCategory.name}" is now live on the customer app.`,
          targetPortal: 'customer',
        },
        ...state.notifications,
      ],
    }));
  },

  addService: (serviceData) => {
    const id = `srv-${Date.now()}`;
    const newService: ServiceItem = {
      ...serviceData,
      id,
      rating: 5.0,
      reviewCount: 1,
    };

    set((state) => {
      const updatedCategories = state.categories.map((cat) =>
        cat.id === newService.categoryId ? { ...cat, serviceCount: cat.serviceCount + 1 } : cat
      );
      return {
        services: [newService, ...state.services],
        categories: updatedCategories,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: '✨ New Service Live',
            message: `"${newService.name}" is now visible to customers in category ${newService.categoryId}.`,
            targetPortal: 'customer',
          },
          ...state.notifications,
        ],
      };
    });
  },

  updateService: (id, updates) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteService: (id) => {
    set((state) => {
      const target = state.services.find((s) => s.id === id);
      const remaining = state.services.filter((s) => s.id !== id);
      const updatedCategories = state.categories.map((cat) =>
        target && cat.id === target.categoryId
          ? { ...cat, serviceCount: Math.max(0, cat.serviceCount - 1) }
          : cat
      );
      return {
        services: remaining,
        categories: updatedCategories,
      };
    });
  },

  // Cart
  cart: {
    'srv-ac-deep': 1,
  },
  appliedPromo: null,
  promoDiscountPercent: 0,

  addToCart: (serviceId) => {
    set((state) => ({
      cart: {
        ...state.cart,
        [serviceId]: (state.cart[serviceId] || 0) + 1,
      },
    }));
  },

  removeFromCart: (serviceId) => {
    set((state) => {
      const currentQty = state.cart[serviceId] || 0;
      if (currentQty <= 1) {
        const { [serviceId]: _, ...rest } = state.cart;
        return { cart: rest };
      }
      return {
        cart: {
          ...state.cart,
          [serviceId]: currentQty - 1,
        },
      };
    });
  },

  updateCartQuantity: (serviceId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const { [serviceId]: _, ...rest } = state.cart;
        return { cart: rest };
      }
      return {
        cart: {
          ...state.cart,
          [serviceId]: quantity,
        },
      };
    });
  },

  clearCart: () => set({ cart: {}, appliedPromo: null, promoDiscountPercent: 0 }),

  applyPromo: (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FESTIVAL25') {
      set({ appliedPromo: clean, promoDiscountPercent: 25 });
      return { success: true, message: '🎉 FESTIVAL25 applied! Flat 25% discount activated.' };
    }
    if (clean === 'COOL599' || clean === 'FIRST100') {
      set({ appliedPromo: clean, promoDiscountPercent: 15 });
      return { success: true, message: `🎉 ${clean} applied! 15% discount activated.` };
    }
    return { success: false, message: 'Invalid coupon code. Try FESTIVAL25 or COOL599.' };
  },

  removePromo: () => set({ appliedPromo: null, promoDiscountPercent: 0 }),

  createBooking: (bookingData) => {
    const state = get();
    const cartEntries = Object.entries(state.cart);
    const orderItems: OrderItem[] = cartEntries
      .map(([srvId, qty]) => {
        const srv = state.services.find((s) => s.id === srvId);
        if (!srv) return null;
        return {
          serviceId: srv.id,
          name: srv.name,
          price: srv.price,
          quantity: qty,
        };
      })
      .filter((item): item is OrderItem => item !== null);

    const subtotal = orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    const discountAmount = Math.round((subtotal * state.promoDiscountPercent) / 100);
    const finalAmount = Math.max(0, subtotal - discountAmount);

    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingNumber = `SW-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: BookingOrder = {
      id: `ord-${Date.now()}`,
      bookingNumber,
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      customerAddress: bookingData.customerAddress,
      items: orderItems,
      totalAmount: subtotal,
      discountAmount,
      finalAmount,
      scheduledDate: bookingData.scheduledDate,
      scheduledSlot: bookingData.scheduledSlot,
      status: 'requested',
      startOtp,
      endOtp,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentMethod === 'online' ? 'paid' : 'pending',
      createdAt: new Date().toISOString(),
      notes: bookingData.notes,
    };

    // Auto notify Admin & Partner
    const newNotifications: EcosystemNotification[] = [
      {
        id: `notif-${Date.now()}-1`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: '🔔 New Customer Booking Placed!',
        message: `${newOrder.customerName} booked ${orderItems.length} service(s) for ₹${finalAmount}. Booking: ${bookingNumber}`,
        targetPortal: 'admin',
        orderId: newOrder.id,
      },
      {
        id: `notif-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: '⚡ New Job Alert nearby!',
        message: `New booking ${bookingNumber} in ${bookingData.customerAddress.city} ready for acceptance!`,
        targetPortal: 'partner',
        orderId: newOrder.id,
      },
    ];

    set({
      orders: [newOrder, ...state.orders],
      cart: {},
      appliedPromo: null,
      promoDiscountPercent: 0,
      notifications: [...newNotifications, ...state.notifications],
    });

    return newOrder;
  },

  orders: INITIAL_ORDERS,

  assignTechnician: (orderId, technicianId) => {
    set((state) => {
      const tech = state.technicians.find((t) => t.id === technicianId);
      const updatedOrders = state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedTechnicianId: technicianId,
              status: 'assigned' as const,
            }
          : o
      );
      const updatedTechs = state.technicians.map((t) =>
        t.id === technicianId ? { ...t, status: 'busy' as const, currentOrderId: orderId } : t
      );

      const targetOrder = state.orders.find((o) => o.id === orderId);

      return {
        orders: updatedOrders,
        technicians: updatedTechs,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Job Assigned to Partner',
            message: `Booking ${targetOrder?.bookingNumber || ''} assigned to ${tech?.name || 'Technician'}.`,
            targetPortal: 'partner',
            orderId,
          },
          ...state.notifications,
        ],
      };
    });
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },

  partnerAcceptJob: (orderId, technicianId) => {
    set((state) => {
      const targetOrder = state.orders.find((o) => o.id === orderId);
      const tech = state.technicians.find((t) => t.id === technicianId);

      const updatedOrders = state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'assigned' as const,
              assignedTechnicianId: technicianId,
            }
          : o
      );

      const updatedTechs = state.technicians.map((t) =>
        t.id === technicianId ? { ...t, status: 'busy' as const, currentOrderId: orderId } : t
      );

      return {
        orders: updatedOrders,
        technicians: updatedTechs,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Partner Accepted Job',
            message: `${tech?.name || 'Technician'} accepted booking ${targetOrder?.bookingNumber}.`,
            targetPortal: 'admin',
            orderId,
          },
          ...state.notifications,
        ],
      };
    });
  },

  partnerStartJob: (orderId, enteredOtp) => {
    const state = get();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    if (order.startOtp !== enteredOtp.trim()) {
      return { success: false, message: `Incorrect Start OTP. Please ask customer for correct 4-digit start OTP.` };
    }

    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: 'in_progress' as const } : o)),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Job Started (In Progress)',
          message: `Booking ${order.bookingNumber} has been verified and work started on-site.`,
          targetPortal: 'customer',
          orderId,
        },
        ...state.notifications,
      ],
    }));

    return { success: true, message: 'OTP verified! Job is now In-Progress.' };
  },

  partnerCompleteJob: (orderId, enteredOtp) => {
    const state = get();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    if (order.endOtp !== enteredOtp.trim()) {
      return { success: false, message: 'Incorrect End OTP. Customer must provide completion OTP to seal job.' };
    }

    // Calculate Partner share
    const technician = state.technicians.find((t) => t.id === order.assignedTechnicianId);
    const commissionPercent = technician ? technician.commissionRate : 15;
    const platformFee = Math.round((order.finalAmount * commissionPercent) / 100);
    const partnerNetShare = order.finalAmount - platformFee;

    set((state) => {
      const updatedOrders = state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed' as const,
              paymentStatus: 'paid' as const,
              completedAt: new Date().toISOString(),
            }
          : o
      );

      const updatedTechs = state.technicians.map((t) => {
        if (t.id === order.assignedTechnicianId) {
          return {
            ...t,
            status: 'online' as const,
            currentOrderId: undefined,
            completedJobs: t.completedJobs + 1,
            walletBalance: t.walletBalance + partnerNetShare,
            totalEarnings: t.totalEarnings + partnerNetShare,
          };
        }
        return t;
      });

      return {
        orders: updatedOrders,
        technicians: updatedTechs,
        notifications: [
          {
            id: `notif-${Date.now()}-c`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: '🎉 Job Completed Successfully!',
            message: `Booking ${order.bookingNumber} completed. Net ₹${partnerNetShare} credited to Partner Wallet.`,
            targetPortal: 'partner',
            orderId,
          },
          {
            id: `notif-${Date.now()}-a`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Order Fulfilled',
            message: `Booking ${order.bookingNumber} was delivered. ₹${platformFee} platform commission realized.`,
            targetPortal: 'admin',
            orderId,
          },
          ...state.notifications,
        ],
      };
    });

    return {
      success: true,
      message: `Job completed! ₹${partnerNetShare} credited to partner wallet after ${commissionPercent}% platform commission.`,
    };
  },

  technicians: INITIAL_TECHNICIANS,

  addTechnician: (techData) => {
    const id = `tech-${Date.now()}`;
    const newTechnician: Technician = {
      ...techData,
      id,
      completedJobs: 0,
      walletBalance: 0,
      totalEarnings: 0,
      rating: 5.0,
      ratingCount: 1,
      joinedDate: 'Just now',
    };

    set((state) => ({
      technicians: [newTechnician, ...state.technicians],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'New Partner Onboarded',
          message: `${newTechnician.name} (${newTechnician.primarySkill}) is now active in the partner network.`,
          targetPortal: 'admin',
        },
        ...state.notifications,
      ],
    }));
  },

  updateTechnician: (id, updates) => {
    set((state) => ({
      technicians: state.technicians.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTechnician: (id) => {
    set((state) => ({
      technicians: state.technicians.filter((t) => t.id !== id),
    }));
  },

  toggleTechnicianDuty: (technicianId) => {
    set((state) => ({
      technicians: state.technicians.map((t) =>
        t.id === technicianId
          ? {
              ...t,
              status: t.status === 'online' ? 'offline' : 'online',
            }
          : t
      ),
    }));
  },

  requestWalletPayout: (technicianId, amount) => {
    const state = get();
    const tech = state.technicians.find((t) => t.id === technicianId);
    if (!tech) return { success: false, message: 'Technician not found.' };

    if (amount <= 0 || amount > tech.walletBalance) {
      return { success: false, message: 'Insufficient wallet balance for this payout.' };
    }

    set((state) => ({
      technicians: state.technicians.map((t) =>
        t.id === technicianId ? { ...t, walletBalance: t.walletBalance - amount } : t
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Bank Payout Dispatched',
          message: `₹${amount} dispatched via IMPS to ${tech.name}'s verified bank account.`,
          targetPortal: 'partner',
        },
        ...state.notifications,
      ],
    }));

    return { success: true, message: `₹${amount} transferred to registered bank account.` };
  },

  notifications: [
    {
      id: 'notif-init-1',
      timestamp: 'Just now',
      title: 'Ecosystem Online',
      message: 'Unified state active between Customer Web/App, Partner App, and Admin Panel.',
      targetPortal: 'customer',
    },
  ],

  addNotification: (notification) => {
    const newNotif: EcosystemNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAllNotifications: () => set({ notifications: [] }),

  resetEcosystem: () => {
    set({
      customerProfile: DEFAULT_CUSTOMER_PROFILE,
      categories: INITIAL_CATEGORIES,
      services: INITIAL_SERVICES,
      technicians: INITIAL_TECHNICIANS,
      orders: INITIAL_ORDERS,
      cart: { 'srv-ac-deep': 1 },
      appliedPromo: null,
      promoDiscountPercent: 0,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: 'Just now',
          title: 'Ecosystem Reset',
          message: 'All mock categories, services, technicians and orders restored to factory defaults.',
          targetPortal: 'admin',
        },
      ],
    });
  },
}));
