import { CartItem, Address } from './product.model';

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  orderNumber: string;
  userEmail: string;
  placedAt: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  billingSameAsShipping: boolean;
  shippingMethodLabel: string;
  paymentMethod: string;
  invoiceType: 'standard' | 'gst';
  gstin: string;
  status: OrderStatus;
}
