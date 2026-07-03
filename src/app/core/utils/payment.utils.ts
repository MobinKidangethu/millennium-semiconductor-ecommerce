const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit: 'Credit / Debit Card',
  upi: 'UPI Payment',
  wire: 'Wire Transfer',
  net30: 'Net 30 Account',
  po: 'Purchase Order'
};

export function paymentMethodLabel(id: string): string {
  return PAYMENT_METHOD_LABELS[id] ?? id;
}
