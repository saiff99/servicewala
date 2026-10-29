import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQS = [
  {
    id: 'faq-1',
    question: 'How quickly will a technician arrive at my doorstep?',
    answer:
      'Most standard repair bookings and emergency requests are dispatched within 45 to 60 minutes. Alternatively, you can schedule any convenient future date and time slot up to 7 days in advance.',
    category: 'Timing & Arrival',
  },
  {
    id: 'faq-2',
    question: 'Are all Servicewala technicians verified and certified?',
    answer:
      'Yes, 100%. Every professional undergoes a multi-layer onboarding evaluation including UIDAI biometric identity verification, local police clearance checks, and hands-on technical skill assessment.',
    category: 'Safety & Trust',
  },
  {
    id: 'faq-3',
    question: 'When do I have to pay, and what payment methods are accepted?',
    answer:
      'You only pay after the service is fully completed and tested to your satisfaction. We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash.',
    category: 'Payment & Pricing',
  },
  {
    id: 'faq-4',
    question: 'What does the 30-Day Servicewala Guarantee cover?',
    answer:
      'Our 30-Day Guarantee covers any re-occurring defect related to the completed repair. If the issue persists or resurfaces within 30 days, an expert will re-visit and resolve it with zero inspection or labour fees.',
    category: 'Warranty Protection',
  },
  {
    id: 'faq-5',
    question: 'Are replacement spare parts original and covered by brand warranty?',
    answer:
      'Absolutely. We source 100% genuine OEM spare parts directly from brand-authorized distributors for all 22+ supported brands. All fitted components include official manufacturer warranty documentation.',
    category: 'Genuine Spare Parts',
  },
];

export default function FaqSection() {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [hoveredFaqId, setHoveredFaqId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.faqHeaderWrap}>
        <View style={styles.faqHeaderPill}>
          <Ionicons name="help-circle" size={13} color="#2563EB" />
          <Text style={styles.faqHeaderPillText}>FREQUENTLY ASKED QUESTIONS</Text>
        </View>
        <Text style={styles.sectionTitle}>Got Questions? We’ve Got Answers</Text>
        <Text style={styles.faqSectionSub}>
          Everything you need to know about Servicewala doorstep repairs, transparent pricing, and 30-day warranty
        </Text>
      </View>

      <View style={styles.faqContainer}>
        {FAQS.map((faq) => {
          const isOpen = expandedFaqId === faq.id;
          const isHovered = hoveredFaqId === faq.id;
          return (
            <View
              key={faq.id}
              style={[
                styles.faqCard,
                isOpen && styles.faqCardOpen,
                isHovered && !isOpen && styles.faqCardHovered,
              ]}
            >
              <Pressable
                onPress={() => setExpandedFaqId(isOpen ? null : faq.id)}
                onHoverIn={() => setHoveredFaqId(faq.id)}
                onHoverOut={() => setHoveredFaqId(null)}
                style={styles.faqHeaderRow}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
              >
                <View style={styles.faqQuestionWrap}>
                  <View style={[styles.faqCategoryPill, isOpen && styles.faqCategoryPillOpen]}>
                    <Text style={[styles.faqCategoryText, isOpen && styles.faqCategoryTextOpen]}>
                      {faq.category}
                    </Text>
                  </View>
                  <Text style={[styles.faqQuestionText, isOpen && styles.faqQuestionTextOpen]}>
                    {faq.question}
                  </Text>
                </View>

                <View style={[styles.faqChevronWrap, isOpen && styles.faqChevronWrapOpen]}>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={isOpen ? '#FFFFFF' : '#64748B'}
                  />
                </View>
              </Pressable>

              {isOpen && (
                <View style={styles.faqBody}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    marginTop: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  faqHeaderWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  faqHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  faqHeaderPillText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  faqSectionSub: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 21,
    marginTop: 4,
  },
  faqContainer: {
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  faqCardOpen: {
    borderColor: '#93C5FD',
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  faqCardHovered: {
    borderColor: '#CBD5E1',
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.06,
  } as any,
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    cursor: 'pointer',
    gap: 16,
  } as any,
  faqQuestionWrap: {
    flex: 1,
  },
  faqCategoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  faqCategoryPillOpen: {
    backgroundColor: '#EFF6FF',
  },
  faqCategoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  faqCategoryTextOpen: {
    color: '#2563EB',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  faqQuestionTextOpen: {
    color: '#1E40AF',
  },
  faqChevronWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqChevronWrapOpen: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  faqBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFCFF',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
  },
});

