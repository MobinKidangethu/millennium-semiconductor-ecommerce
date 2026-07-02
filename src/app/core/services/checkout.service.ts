import { Injectable, signal } from '@angular/core';
import { Address, ShippingMethod } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  shippingAddress = signal<Address>({
    firstName: 'DevOn', lastName: 'Team',
    company: 'Devon Software Services (DevOn)',
    address1: 'Lower Ground Floor, 2A-West Tower, Embassy Tech Village',
    address2: 'Outer Ring Road, Devarabisanahalli, Varthur Hobli',
    city: 'Bengaluru', zip: '560087', state: 'Karnataka',
    country: 'India', phone: '', po: '',
    isDefault: true
  });

  savedAddresses = signal<Address[]>([
    {
      firstName: 'DevOn', lastName: 'Team',
      company: 'Devon Software Services (DevOn)',
      address1: 'Lower Ground Floor, 2A-West Tower, Embassy Tech Village',
      address2: 'Outer Ring Road, Devarabisanahalli, Varthur Hobli',
      city: 'Bengaluru', zip: '560087', state: 'Karnataka',
      country: 'India', phone: '', po: '',
      isDefault: true
    },
    {
      firstName: 'Robert', lastName: 'Chen', company: 'Acme Electronics Inc.',
      address1: '450 Serra Mall, Bldg 500', address2: '',
      city: 'Stanford', zip: '94305', state: 'California',
      country: 'United States', phone: '+1 (415) 555-0199', po: '',
      isDefault: false
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
    { id: 'standard',  label: 'Standard (5-7 Business Days)',  days: '5-7 Business Days',    price: 0    },
    { id: 'expedited', label: 'Expedited (2-3 Business Days)', days: '2-3 Business Days',    price: 1503 },
    { id: 'overnight', label: 'Overnight (Next Business Day)', days: 'Next Business Day',    price: 3507 }
  ];

  invoiceType = signal<'standard' | 'gst'>('gst');

  paymentMethod = signal<string>('credit');
  cardHolder = signal<string>('Robert Chen');
  cardNumber = signal<string>('•••• •••• •••• 4242');
  cardExpiry = signal<string>('09 / 27');
  orderNumber = signal<string>('NXC-2025-084712');
}