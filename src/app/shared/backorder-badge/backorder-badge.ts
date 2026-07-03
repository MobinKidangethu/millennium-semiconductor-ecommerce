import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { BackorderInfo, getBackorderInfo, factoryLeadTimeWeeks } from '../../core/utils/backorder.utils';

@Component({
  selector: 'app-backorder-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backorder-badge.html',
  styleUrls: ['./backorder-badge.scss']
})
export class BackorderBadge {
  @Input({ required: true }) product!: Product;
  @Input() qty = 1;

  modalOpen = signal(false);

  get info(): BackorderInfo {
    return getBackorderInfo(this.product.availability, this.qty);
  }

  get leadTimeWeeks(): number {
    return factoryLeadTimeWeeks(this.product.id);
  }

  open() { this.modalOpen.set(true); }
  close() { this.modalOpen.set(false); }
}
