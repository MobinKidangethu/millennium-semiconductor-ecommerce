import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { jsPDF } from 'jspdf';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { inr } from '../../core/utils/price.utils';
import { paymentMethodLabel } from '../../core/utils/payment.utils';

const SELLER_GSTIN = '29AACCM1234B1Z8';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink, DatePipe, Header, Footer, CheckoutStepper],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.scss']
})
export class Confirmation implements OnInit {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  private auth = inject(AuthService);
  private orderService = inject(OrderService);

  order!: Order;

  ngOnInit() {
    const shippingAddress = this.checkout.shippingAddress();
    const billingSameAsShipping = this.checkout.billingSameAsShipping();
    const billingAddress = billingSameAsShipping
      ? shippingAddress
      : (this.checkout.billingAddress() ?? shippingAddress);

    this.order = this.orderService.placeOrder({
      userEmail: this.auth.currentUser()?.email ?? 'guest',
      items: this.cart.items().map(i => ({ ...i })),
      subtotal: this.cart.subtotal(),
      tax: this.cart.tax(),
      total: this.cart.total(),
      shippingAddress,
      billingAddress,
      billingSameAsShipping,
      shippingMethodLabel: this.checkout.shippingMethod().label,
      paymentMethod: this.checkout.paymentMethod(),
      invoiceType: this.checkout.invoiceType(),
      gstin: this.checkout.gstin()
    });
    this.checkout.orderNumber.set(this.order.orderNumber);
    this.cart.clear();
  }

  get addr() { return this.order.shippingAddress; }
  get userEmail() { return this.order.userEmail; }
  get orderNumber() { return this.order.orderNumber; }
  get orderItems() { return this.order.items; }
  get orderSubtotal() { return this.order.subtotal; }
  get orderTax() { return this.order.tax; }
  get orderTotal() { return this.order.total; }

  formatINR(amount: number): string { return inr(amount); }

  paymentLabel(id: string): string { return paymentMethodLabel(id); }

  printConfirmation() {
    window.print();
  }

  downloadPdf() {
    const order = this.order;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    let y = 50;
    const isGst = order.invoiceType === 'gst';

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Millennium Semiconductors India Pvt. Ltd.', marginX, y);
    y += 20;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(isGst ? 'Tax Invoice (GST)' : 'Invoice', marginX, y);
    y += 24;

    doc.setFontSize(10);
    doc.text(`Invoice Number: ${isGst ? 'INV-GST-' : 'INV-'}${order.orderNumber}`, marginX, y); y += 14;
    doc.text(`Order Number: #${order.orderNumber}`, marginX, y); y += 14;
    doc.text(`Date Placed: ${new Date(order.placedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, marginX, y); y += 14;
    doc.text(`Payment Method: ${order.paymentMethod}`, marginX, y); y += 14;
    if (isGst) {
      doc.text(`Seller GSTIN: ${SELLER_GSTIN}`, marginX, y); y += 14;
      doc.text(`Buyer GSTIN: ${order.gstin || 'Not provided'}`, marginX, y); y += 14;
    }
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Billing Address', marginX, y); y += 14;
    doc.setFont('helvetica', 'normal');
    const billing = order.billingAddress;
    [
      `${billing.firstName} ${billing.lastName}`,
      billing.company,
      billing.address1,
      billing.address2,
      `${billing.city}, ${billing.state} ${billing.zip}`,
      billing.country
    ].filter(Boolean).forEach(line => { doc.text(line, marginX, y); y += 14; });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Part Number', marginX, y);
    if (isGst) doc.text('HSN/SAC', 260, y);
    doc.text('Qty', 330, y);
    doc.text('Unit Price', 380, y);
    doc.text('Total', 480, y);
    y += 6;
    doc.setLineWidth(0.5);
    doc.line(marginX, y, 540, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    for (const item of order.items) {
      doc.text(item.product.manufacturerPartNumber, marginX, y);
      if (isGst) doc.text(item.product.productType.slice(0, 18), 260, y);
      doc.text(String(item.qty), 330, y);
      doc.text(this.formatINR(item.product.price), 380, y);
      doc.text(this.formatINR(item.product.price * item.qty), 480, y);
      y += 16;
    }

    y += 4;
    doc.line(marginX, y, 540, y);
    y += 16;

    doc.text('Subtotal', 380, y);
    doc.text(this.formatINR(order.subtotal), 480, y); y += 14;

    if (isGst) {
      const half = +(order.tax / 2).toFixed(2);
      doc.text('CGST (9%)', 380, y);
      doc.text(this.formatINR(half), 480, y); y += 14;
      doc.text('SGST (9%)', 380, y);
      doc.text(this.formatINR(order.tax - half), 480, y); y += 14;
    } else {
      doc.text('GST (18%)', 380, y);
      doc.text(this.formatINR(order.tax), 480, y); y += 14;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Order Total', 380, y);
    doc.text(this.formatINR(order.total), 480, y);

    doc.save(`Millennium-${isGst ? 'GST-' : ''}Invoice-${order.orderNumber}.pdf`);
  }
}
