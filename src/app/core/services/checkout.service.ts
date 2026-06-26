import { Injectable, signal } from '@angular/core';
import { Address, ShippingMethod } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  shippingAddress = signal<Address>({
    firstName: 'Robert', lastName: 'Chen',
    company: 'Acme Electronics Inc.',
    address1: '450 Serra Mall, Bldg 500', address2: '',
    city: 'Stanford', zip: '94305', state: 'California',
    country: 'United States', phone: '+1 (415) 555-0199', po: 'PO-2025-0042',
    isDefault: true
  });

  savedAddresses = signal<Address[]>([
    {
      firstName: 'Robert', lastName: 'Chen', company: 'Acme Electronics Inc.',
      address1: '450 Serra Mall, Bldg 500', address2: '',
      city: 'Stanford', zip: '94305', state: 'California',
      country: 'United States', phone: '+1 (415) 555-0199', po: '',
      isDefault: true
    },
    {
      firstName: 'Tommy', lastName: 'Oliver', company: '',
      address1: '1234 Mountain Pass', address2: '',
      city: 'Mountain View', zip: '94043', state: 'California',
      country: 'United States', phone: '', po: '', isDefault: false
    }
  ]);

  shippingMethod = signal<ShippingMethod>({
    id: 'standard', label: 'Standard (5-7 Business Days)', days: '5-7 Business Days', price: 0
  });

  shippingMethods: ShippingMethod[] = [
    { id: 'standard', label: 'Standard (5-7 Business Days)', days: '5-7 Business Days', price: 0 },
    { id: 'expedited', label: 'Expedited (2-3 Business Days)', days: '2-3 Business Days', price: 18 },
    { id: 'overnight', label: 'Overnight (Next Business Day)', days: 'Next Business Day', price: 42 }
  ];

  paymentMethod = signal<string>('credit');
  cardHolder = signal<string>('Robert Chen');
  cardNumber = signal<string>('•••• •••• •••• 4242');
  cardExpiry = signal<string>('09 / 27');
  orderNumber = signal<string>('NXC-2025-084712');
}