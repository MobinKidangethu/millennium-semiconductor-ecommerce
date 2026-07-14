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
      isDefault: true, label: 'Home'
    },
    {
      firstName: 'DevOn', lastName: 'Team',
      company: 'Devon Software Services (DevOn)',
      address1: 'Lumen Tech Park, 4th Floor, Sector 5',
      address2: 'HSR Layout',
      city: 'Bengaluru', zip: '560102', state: 'Karnataka',
      country: 'India', phone: '', po: '',
      isDefault: false, label: 'Office'
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

  billingSameAsShipping = signal<boolean>(true);
  billingAddress = signal<Address | null>(null);

  invoiceType = signal<'standard' | 'gst'>('gst');
  gstin = signal<string>('');

  paymentMethod = signal<string>('credit');
  cardHolder = signal<string>('');
  cardNumber = signal<string>('•••• •••• •••• 4242');
  cardExpiry = signal<string>('09 / 27');
  orderNumber = signal<string>('NXC-2025-084712');

  // UPI
  upiId = signal<string>('');

  // Wire transfer
  wireAcknowledged = signal<boolean>(false);

  // Net 30
  net30CompanyName = signal<string>('');
  net30TaxId = signal<string>('');
  net30MonthlyVolume = signal<string>('₹1,00,000 – ₹5,00,000');
  net30AuthorizedSigner = signal<string>('');
  net30Applied = signal<boolean>(false);
  net30CreditLimit = signal<number>(0);

  // Purchase Order
  poNumber = signal<string>('');
  poAuthorizedBy = signal<string>('');
  poFileName = signal<string>('');
  poAmountConfirmed = signal<boolean>(false);

  addSavedAddress(address: Address, setDefault: boolean) {
    this.savedAddresses.update(addresses => {
      const next = setDefault ? addresses.map(a => ({ ...a, isDefault: false })) : addresses;
      return [...next, { ...address, isDefault: setDefault }];
    });
  }
}