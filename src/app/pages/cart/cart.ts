import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { BackorderBadge } from '../../shared/backorder-badge/backorder-badge';
import { inr } from '../../core/utils/price.utils';
import { categoryIconPath, iconPath } from '../../core/utils/icon.utils';
import { ThemeService } from '../../core/services/theme.service';

interface InvoiceOption {
  id: 'standard' | 'gst';
  label: string;
  bullets: string[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Footer, CheckoutStepper, BackorderBadge],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private theme = inject(ThemeService);
  couponCode = signal('');
  couponApplied = signal(false);

  invoiceEditing = signal(false);

  invoiceOptions: InvoiceOption[] = [
    { id: 'standard', label: 'Standard Invoice', bullets: ['Credit Card or USD', 'Business Invoice (USD only)'] },
    { id: 'gst', label: 'GST Business Invoice (INR only)', bullets: ['Must have valid GSTIN.', 'Credit cards NOT accepted.'] }
  ];

  get currentInvoiceLabel(): string {
    return this.invoiceOptions.find(o => o.id === this.checkout.invoiceType())?.label ?? '';
  }

  selectInvoiceType(id: 'standard' | 'gst') {
    this.checkout.invoiceType.set(id);
    this.invoiceEditing.set(false);
  }

  updateQty(id: number, qty: number) { this.cart.updateQty(id, qty); }
  remove(id: number) { this.cart.remove(id); }

  onQtyInput(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1) {
      this.updateQty(id, val);
    } else {
      const current = this.cart.items().find(i => i.product.id === id)?.qty ?? 1;
      input.value = String(current);
    }
  }

  applyCoupon() {
    if (this.couponCode().length > 0) this.couponApplied.set(true);
  }

  formatINR(amount: number): string { return inr(amount); }

  categoryIcon(category: string): string { return categoryIconPath(category, this.theme.theme()); }

  icon(name: string): string { return iconPath(name, this.theme.theme()); }

  // Free shipping threshold ₹4175 (≈$50 equivalent)
  get shipping(): string { return this.cart.subtotal() > 4175 ? 'FREE' : '₹350'; }
}