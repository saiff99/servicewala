import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEcosystemStore } from '../../src/store/useEcosystemStore';
import { THEME, currencyFormatter } from '../../src/constants/theme';

export default function CheckoutScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.desktopMin;

  const {
    cart,
    services,
    addToCart,
    removeFromCart,
    appliedPromo,
    promoDiscountPercent,
    applyPromo,
    removePromo,
    createBooking,
  } = useEcosystemStore();

  // Wizard Step: 1 = Review Cart, 2 = Address, 3 = Schedule, 4 = Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Promo input
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Address State
  const [customerName, setCustomerName] = useState('Ananya Deshmukh');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 12345');
  const [flatNo, setFlatNo] = useState('Flat 402, Green Glen Heights');
  const [street, setStreet] = useState('Bellandur Outer Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [landmark, setLandmark] = useState('Opposite Cloudnine Hospital');
  const [addressTag, setAddressTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Schedule State
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('04:00 PM - 05:30 PM');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash_on_delivery'>('online');

  // Cart item calculations
  const cartEntries = Object.entries(cart);
  const cartItems = cartEntries
    .map(([sId, qty]) => {
      const s = services.find((item) => item.id === sId);
      return s ? { service: s, quantity: qty } : null;
    })
    .filter((item): item is { service: (typeof services)[0]; quantity: number } => item !== null);

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.service.price * curr.quantity, 0);
  const discountAmount = Math.round((subtotal * promoDiscountPercent) / 100);
  const safetyFee = subtotal > 0 ? 49 : 0;
  const taxes = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal - discountAmount + safetyFee + taxes);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage(res.message);
  };

  const handleConfirmBooking = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add services first.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !flatNo.trim()) {
      alert('Please fill in your delivery contact details and address.');
      setCurrentStep(2);
      return;
    }

    const fullAddress = {
      street: `${flatNo}, ${street} (${addressTag})`,
      city,
      pincode,
      landmark,
    };

    createBooking({
      customerName,
      customerPhone,
      customerAddress: fullAddress,
      scheduledDate: selectedDate,
      scheduledSlot: selectedSlot,
      paymentMethod,
      notes: `Preferred contact: ${customerPhone}. Landmark: ${landmark}`,
    });

    // Navigate to Bookings tracker
    router.push('/(customer)/bookings');
  };

  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="cart-outline" size={48} color="#94A3B8" />
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySub}>
          Explore our wide range of home services and add items to your cart.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(customer)')}
          style={styles.exploreBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.exploreBtnText}>Browse Services</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
      {/* STEPPER HEADER */}
      <View style={styles.stepperHeader}>
        <View style={styles.stepperInner}>
          <TouchableOpacity onPress={() => router.push('/(customer)')} style={styles.backLink}>
            <Ionicons name="arrow-back" size={18} color="#475569" />
            <Text style={styles.backLinkText}>Catalog</Text>
          </TouchableOpacity>

          <View style={styles.stepsRow}>
            {[
              { num: 1, label: 'Cart' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Slot' },
              { num: 4, label: 'Payment' },
            ].map((step, idx) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <TouchableOpacity
                  key={step.num}
                  onPress={() => {
                    if (isPast) setCurrentStep(step.num);
                  }}
                  style={styles.stepIndicator}
                  disabled={!isPast && !isActive}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && styles.stepCircleActive,
                      isPast && styles.stepCircleDone,
                    ]}
                  >
                    {isPast ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepNum,
                          isActive && styles.stepNumActive,
                          !isActive && !isPast && styles.stepNumFuture,
                        ]}
                      >
                        {step.num}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                      isPast && styles.stepLabelDone,
                    ]}
                  >
                    {step.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 2-COLUMN LAYOUT ON DESKTOP */}
      <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
        {/* LEFT COLUMN: ACTIVE STEP FORM */}
        <View style={styles.leftColumn}>
          {/* STEP 1: CART ITEMS */}
          {currentStep === 1 && (
            <View style={styles.stepCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="cart" size={20} color={THEME.colors.primary} />
                <Text style={styles.cardTitle}>Review Selected Services ({cartItems.length})</Text>
              </View>

              <View style={styles.cartList}>
                {cartItems.map(({ service, quantity }) => (
                  <View key={service.id} style={styles.cartItemRow}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{service.name}</Text>
                      <Text style={styles.cartItemDuration}>
                        {service.duration} • {currencyFormatter(service.price)} each
                      </Text>
                    </View>

                    <View style={styles.cartItemControls}>
                      <View style={styles.cartQtyPill}>
                        <TouchableOpacity
                          onPress={() => removeFromCart(service.id)}
                          style={styles.cartQtyBtn}
                        >
                          <Ionicons name="remove" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.cartQtyText}>{quantity}</Text>
                        <TouchableOpacity
                          onPress={() => addToCart(service.id)}
                          style={styles.cartQtyBtn}
                        >
                          <Ionicons name="add" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.cartItemTotal}>
                        {currencyFormatter(service.price * quantity)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Coupon Bar */}
              <View style={styles.couponContainer}>
                <View style={styles.couponInputRow}>
                  <Ionicons name="pricetag-outline" size={18} color="#4F46E5" />
                  <TextInput
                    value={promoInput}
                    onChangeText={setPromoInput}
                    placeholder="Enter Coupon (e.g. FESTIVAL25, COOL599)"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="characters"
                    style={styles.couponInput}
                  />
                  <TouchableOpacity onPress={handleApplyPromo} style={styles.applyCouponBtn}>
                    <Text style={styles.applyCouponBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {appliedPromo && (
                  <View style={styles.appliedPromoBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.appliedPromoText}>
                      {"'" + appliedPromo + "'"} applied ({promoDiscountPercent}% savings)
                    </Text>
                    <TouchableOpacity onPress={removePromo} style={styles.removePromoBtn}>
                      <Ionicons name="close-circle" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}

                {promoMessage && !appliedPromo && (
                  <Text style={styles.promoErrorText}>{promoMessage}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setCurrentStep(2)}
                style={styles.nextStepBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.nextStepBtnText}>Proceed to Address</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: ADDRESS */}
          {currentStep === 2 && (
            <View style={styles.stepCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="location" size={20} color={THEME.colors.primary} />
                <Text style={styles.cardTitle}>Service Delivery Address</Text>
              </View>

              <View style={styles.addressTagRow}>
                {(['Home', 'Work', 'Other'] as const).map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setAddressTag(tag)}
                    style={[
                      styles.tagChip,
                      addressTag === tag && styles.tagChipActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        tag === 'Home' ? 'home' : tag === 'Work' ? 'briefcase' : 'location'
                      }
                      size={14}
                      color={addressTag === tag ? '#FFFFFF' : '#475569'}
                    />
                    <Text
                      style={[
                        styles.tagChipText,
                        addressTag === tag && styles.tagChipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Customer Full Name</Text>
                  <TextInput
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Your Name"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Mobile Phone (+91)</Text>
                  <TextInput
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                    placeholder="+91 Phone"
                    keyboardType="phone-pad"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>House / Flat / Building Name</Text>
                <TextInput
                  value={flatNo}
                  onChangeText={setFlatNo}
                  placeholder="e.g. Flat 402, Green Glen Heights"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Street / Area / Locality</Text>
                <TextInput
                  value={street}
                  onChangeText={setStreet}
                  placeholder="e.g. Bellandur Outer Ring Road"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>City</Text>
                  <TextInput
                    value={city}
                    onChangeText={setCity}
                    placeholder="Bengaluru"
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.fieldLabel}>Pincode</Text>
                  <TextInput
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="560103"
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Landmark (Optional)</Text>
                <TextInput
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholder="e.g. Near Cloudnine Hospital"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.wizardBtnRow}>
                <TouchableOpacity
                  onPress={() => setCurrentStep(1)}
                  style={styles.prevStepBtn}
                >
                  <Ionicons name="arrow-back" size={16} color="#475569" />
                  <Text style={styles.prevStepBtnText}>Back to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCurrentStep(3)}
                  style={styles.nextStepBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextStepBtnText}>Choose Slot</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: SCHEDULE & SLOT */}
          {currentStep === 3 && (
            <View style={styles.stepCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={20} color={THEME.colors.primary} />
                <Text style={styles.cardTitle}>Choose Date & Arrival Slot</Text>
              </View>

              <Text style={styles.slotSectionHeading}>Select Date</Text>
              <View style={styles.dateSelectorRow}>
                {['Today', 'Tomorrow', 'Day After Tomorrow'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDate(day)}
                    style={[
                      styles.datePill,
                      selectedDate === day && styles.datePillActive,
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={selectedDate === day ? '#FFFFFF' : '#475569'}
                    />
                    <Text
                      style={[
                        styles.datePillText,
                        selectedDate === day && styles.datePillTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.slotSectionHeading}>Available Doorstep Arrival Slots</Text>
              <View style={styles.slotsGrid}>
                {[
                  '09:00 AM - 10:30 AM',
                  '11:30 AM - 01:00 PM',
                  '02:30 PM - 04:00 PM',
                  '04:00 PM - 05:30 PM',
                  '06:00 PM - 07:30 PM',
                  '07:30 PM - 09:00 PM',
                ].map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      onPress={() => setSelectedSlot(slot)}
                      style={[
                        styles.slotCard,
                        isSelected && styles.slotCardActive,
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={isSelected ? THEME.colors.primary : '#64748B'}
                      />
                      <Text
                        style={[
                          styles.slotCardText,
                          isSelected && styles.slotCardTextActive,
                        ]}
                      >
                        {slot}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color={THEME.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.wizardBtnRow}>
                <TouchableOpacity
                  onPress={() => setCurrentStep(2)}
                  style={styles.prevStepBtn}
                >
                  <Ionicons name="arrow-back" size={16} color="#475569" />
                  <Text style={styles.prevStepBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCurrentStep(4)}
                  style={styles.nextStepBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextStepBtnText}>Proceed to Payment</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4: PAYMENT */}
          {currentStep === 4 && (
            <View style={styles.stepCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="card" size={20} color={THEME.colors.primary} />
                <Text style={styles.cardTitle}>Select Payment Mode</Text>
              </View>

              <View style={styles.paymentOptionsList}>
                {/* Online Payment */}
                <TouchableOpacity
                  onPress={() => setPaymentMethod('online')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'online' && styles.paymentOptionCardActive,
                  ]}
                >
                  <View style={styles.paymentLeft}>
                    <View
                      style={[
                        styles.radioCircle,
                        paymentMethod === 'online' && styles.radioCircleActive,
                      ]}
                    >
                      {paymentMethod === 'online' && <View style={styles.radioInner} />}
                    </View>
                    <View>
                      <View style={styles.payOptionTitleRow}>
                        <Text style={styles.payOptionTitle}>Online Payment (UPI, Cards, NetBanking)</Text>
                        <View style={styles.recommendedPill}>
                          <Text style={styles.recommendedText}>INSTANT CONFIRM</Text>
                        </View>
                      </View>
                      <Text style={styles.payOptionSub}>
                        Google Pay, PhonePe, Paytm, HDFC, ICICI, SBI cards
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Cash / UPI on Delivery */}
                <TouchableOpacity
                  onPress={() => setPaymentMethod('cash_on_delivery')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'cash_on_delivery' && styles.paymentOptionCardActive,
                  ]}
                >
                  <View style={styles.paymentLeft}>
                    <View
                      style={[
                        styles.radioCircle,
                        paymentMethod === 'cash_on_delivery' && styles.radioCircleActive,
                      ]}
                    >
                      {paymentMethod === 'cash_on_delivery' && <View style={styles.radioInner} />}
                    </View>
                    <View>
                      <Text style={styles.payOptionTitle}>Pay After Service Completion</Text>
                      <Text style={styles.payOptionSub}>
                        Pay via UPI QR code or Cash directly to the verified technician on site
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.otpNoticeBox}>
                <Ionicons name="lock-closed" size={18} color="#4F46E5" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.otpNoticeTitle}>Secure OTP Protection System</Text>
                  <Text style={styles.otpNoticeText}>
                    Upon booking, you will receive a 4-digit **Start OTP** and **End OTP**. Share the
                    Start OTP only after the professional arrives at your door, and the End OTP only
                    when work is completed.
                  </Text>
                </View>
              </View>

              <View style={styles.wizardBtnRow}>
                <TouchableOpacity
                  onPress={() => setCurrentStep(3)}
                  style={styles.prevStepBtn}
                >
                  <Ionicons name="arrow-back" size={16} color="#475569" />
                  <Text style={styles.prevStepBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirmBooking}
                  style={styles.confirmBookingBtn}
                  activeOpacity={0.88}
                >
                  <Ionicons name="flash" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmBookingText}>
                    Confirm & Book for {currencyFormatter(grandTotal)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        <View style={styles.rightColumn}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Bill Breakdown</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Services Subtotal</Text>
              <Text style={styles.summaryValue}>{currencyFormatter(subtotal)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelDiscount}>Promo Discount ({promoDiscountPercent}%)</Text>
                <Text style={styles.summaryValueDiscount}>- {currencyFormatter(discountAmount)}</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <View style={styles.labelWithTooltip}>
                <Text style={styles.summaryLabel}>Safety & Hygiene Fee</Text>
              </View>
              <Text style={styles.summaryValue}>{currencyFormatter(safetyFee)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxes & GST (5%)</Text>
              <Text style={styles.summaryValue}>{currencyFormatter(taxes)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.totalSavingsTag}>
                  Total saved: {currencyFormatter(discountAmount + 300)}
                </Text>
              </View>
              <Text style={styles.grandTotalValue}>{currencyFormatter(grandTotal)}</Text>
            </View>

            {/* Quick Guarantees */}
            <View style={styles.guaranteeBox}>
              <View style={styles.guaranteeItem}>
                <Ionicons name="checkmark-done-circle" size={16} color="#10B981" />
                <Text style={styles.guaranteeText}>Free cancellation up to 2 hours before slot</Text>
              </View>
              <View style={styles.guaranteeItem}>
                <Ionicons name="shield-checkmark" size={16} color="#4F46E5" />
                <Text style={styles.guaranteeText}>30-Day post-service rework warranty</Text>
              </View>
            </View>
          </View>
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
    paddingBottom: 40,
  },
  stepperHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  stepperInner: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backLinkText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: THEME.colors.primary,
  },
  stepCircleDone: {
    backgroundColor: '#10B981',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '800',
  },
  stepNumActive: {
    color: '#FFFFFF',
  },
  stepNumFuture: {
    color: '#64748B',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stepLabelActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  stepLabelDone: {
    color: '#10B981',
  },
  mainLayout: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 24,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: '100%',
    maxWidth: 380,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cartList: {
    gap: 14,
    marginBottom: 20,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  cartItemDuration: {
    fontSize: 12,
    color: '#64748B',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartQtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    padding: 2,
  },
  cartQtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cartQtyText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 6,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 64,
    textAlign: 'right',
  },
  couponContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    height: 40,
  },
  applyCouponBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyCouponBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  appliedPromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  appliedPromoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  removePromoBtn: {
    padding: 2,
  },
  promoErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  addressTagRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  tagChipActive: {
    backgroundColor: THEME.colors.primary,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  tagChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  formRow: {
    flexDirection: 'row',
    gap: 14,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  slotSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 6,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  datePillActive: {
    backgroundColor: THEME.colors.primary,
  },
  datePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  datePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  slotCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  slotCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: THEME.colors.primary,
  },
  slotCardText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  slotCardTextActive: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  paymentOptionsList: {
    gap: 12,
    marginBottom: 20,
  },
  paymentOptionCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  paymentOptionCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#EEF2FF',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleActive: {
    borderColor: THEME.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.primary,
  },
  payOptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  payOptionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  recommendedPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  otpNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  otpNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  otpNoticeText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  wizardBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  prevStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    backgroundColor: '#F1F5F9',
  },
  prevStepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  nextStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  nextStepBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  confirmBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...THEME.shadows.floating,
  },
  confirmBookingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...THEME.shadows.subtle,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#475569',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryLabelDiscount: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
  },
  summaryValueDiscount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
  labelWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalSavingsTag: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  guaranteeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
