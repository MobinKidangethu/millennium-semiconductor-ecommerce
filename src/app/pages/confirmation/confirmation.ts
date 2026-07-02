import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { jsPDF } from 'jspdf';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { CheckoutStepper } from '../../shared/checkout-stepper/checkout-stepper';
import { inr } from '../../core/utils/price.utils';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink, Header, Footer, CheckoutStepper],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.scss']
})
export class Confirmation implements OnInit {
  cart = inject(CartService);
  checkout = inject(CheckoutService);

  orderItems: any[] = [];
  orderSubtotal = 0;
  orderTax = 0;
  orderTotal = 0;

  ngOnInit() {
    this.orderItems = this.cart.items().map(i => ({ ...i }));
    this.orderSubtotal = this.cart.subtotal();
    this.orderTax = this.cart.tax();
    this.orderTotal = this.cart.total();
    this.cart.clear();
  }

  get addr() { return this.checkout.shippingAddress(); }
  get orderNumber() { return this.checkout.orderNumber(); }

  formatINR(amount: number): string { return inr(amount); }

  printConfirmation() {
    window.print();
  }

  downloadPdf() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 40;
    let y = 50;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Millennium Semiconductors', marginX, y);
    y += 20;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Order Confirmation', marginX, y);
    y += 24;

    doc.setFontSize(10);
    doc.text(`Order Number: #${this.orderNumber}`, marginX, y); y += 14;
    doc.text(`Date Placed: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, marginX, y); y += 14;
    doc.text(`Payment Method: ${this.checkout.paymentMethod()}`, marginX, y); y += 20;

    doc.setFont('helvetica', 'bold');
    doc.text('Shipping Address', marginX, y); y += 14;
    doc.setFont('helvetica', 'normal');
    const addr = this.addr;
    [
      `${addr.firstName} ${addr.lastName}`,
      addr.company,
      addr.address1,
      addr.address2,
      `${addr.city}, ${addr.state} ${addr.zip}`,
      addr.country
    ].filter(Boolean).forEach(line => { doc.text(line, marginX, y); y += 14; });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Part Number', marginX, y);
    doc.text('Qty', 300, y);
    doc.text('Unit Price', 360, y);
    doc.text('Total', 460, y);
    y += 6;
    doc.setLineWidth(0.5);
    doc.line(marginX, y, 540, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    for (const item of this.orderItems) {
      doc.text(item.product.manufacturerPartNumber, marginX, y);
      doc.text(String(item.qty), 300, y);
      doc.text(this.formatINR(item.product.price), 360, y);
      doc.text(this.formatINR(item.product.price * item.qty), 460, y);
      y += 16;
    }

    y += 4;
    doc.line(marginX, y, 540, y);
    y += 16;

    doc.text('Subtotal', 360, y);
    doc.text(this.formatINR(this.orderSubtotal), 460, y); y += 14;
    doc.text('GST (18%)', 360, y);
    doc.text(this.formatINR(this.orderTax), 460, y); y += 14;
    doc.setFont('helvetica', 'bold');
    doc.text('Order Total', 360, y);
    doc.text(this.formatINR(this.orderTotal), 460, y);

    doc.save(`Millennium-Order-${this.orderNumber}.pdf`);
  }
}