import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { inr } from '../../core/utils/price.utils';
import { categoryIconPath, iconPath } from '../../core/utils/icon.utils';
import { pooledProductImage } from '../../core/utils/product-image.utils';
import { ALL_MANUFACTURERS, manufacturerLogoPath, manufacturerLogoIsDark } from '../../core/utils/manufacturer.utils';
import { ThemeService } from '../../core/services/theme.service';

const CATEGORIES = [
  { name: 'Semiconductors', icon: '💻', sub: 'ICs, Transistors, Diodes', count: '1.2M parts' },
  { name: 'Circuit Protection', icon: '⚡', sub: 'Fuses, TVS Devices, Varistors', count: '84K parts' },
  { name: 'Connectors', icon: '🔌', sub: 'USB, RF, Board-to-Board', count: '320K parts' },
  { name: 'Electromechanical', icon: '⚙️', sub: 'Relays, Switches, Motors', count: '210K parts' },
  { name: 'Passive Components', icon: '📦', sub: 'Resistors, Capacitors, Inductors', count: '450K parts' },
  { name: 'RF & Wireless', icon: '📡', sub: 'Antennas, Modules, Transceivers', count: '90K parts' },
  { name: 'Sensors', icon: '🔬', sub: 'Temperature, Pressure, Motion', count: '160K parts' },
  { name: 'Power', icon: '🔋', sub: 'PSUs, Converters, Regulators', count: '180K parts' },
  { name: 'Memory & Storage', icon: '💾', sub: 'Flash, DRAM, EEPROM', count: '82K parts' },
  { name: 'LED Lighting', icon: '💡', sub: 'LEDs, Drivers', count: '75K parts' },
  { name: 'Thermal Management', icon: '🌡️', sub: 'Heatsinks, Fans, TIM', count: '53K parts' },
  { name: 'Tools & Supplies', icon: '🔧', sub: 'Soldering, Test Equipment', count: '48K parts' }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private theme = inject(ThemeService);

  trending = signal<Product[]>([]);
  categories = CATEGORIES;
  manufacturers = signal<string[]>([]);
  addedId = signal<number | null>(null);

  ngOnInit() {
    this.productService.getTrending().subscribe(p => this.trending.set(p));
    this.manufacturers.set(ALL_MANUFACTURERS);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
    this.addedId.set(product.id);
    setTimeout(() => this.addedId.set(null), 1500);
  }

  formatPrice(p: Product): string {
    return inr(p.price);
  }

  categoryIcon(category: string): string {
    return categoryIconPath(category, this.theme.theme());
  }

  trendingImage(index: number): string {
    return pooledProductImage(index);
  }

  onImgError(event: Event, category: string) {
    (event.target as HTMLImageElement).src = this.categoryIcon(category);
  }

  icon(name: string): string {
    return iconPath(name, this.theme.theme());
  }

  manufacturerLogo(name: string): string | null {
    return manufacturerLogoPath(name);
  }

  manufacturerLogoDark(name: string): boolean {
    return manufacturerLogoIsDark(name);
  }
}