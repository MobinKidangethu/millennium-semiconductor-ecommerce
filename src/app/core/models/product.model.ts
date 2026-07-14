export interface Product {
  id: number;
  mouserPartNumber: string;
  manufacturerPartNumber: string;
  manufacturer: string;
  manufacturerLogo: string;
  title: string;
  description: string;
  datasheet: string;
  productUrl: string;
  availability: number;
  stockStatus: string;
  price: number;
  currency: string;
  rohs: boolean;
  rohsLabel: string;
  lifecycle: string;
  productType: string;
  technology: string;
  mountingStyle: string;
  package: string;
  image: string;
  quantity: number;
  category: string;
  stockType: string;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  phone: string;
  po: string;
  isDefault?: boolean;
  label?: string;
}

export interface ShippingMethod {
  id: string;
  label: string;
  days: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}