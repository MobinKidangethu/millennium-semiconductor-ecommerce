import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';

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

const MANUFACTURERS = [
  'Texas Instruments', 'STMicroelectronics', 'NXP', 'Infineon',
  'Analog Devices', 'Microchip', 'Renesas', 'Vishay'
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

  trending = signal<Product[]>([]);
  categories = CATEGORIES;
  manufacturers = MANUFACTURERS;
  addedId = signal<number | null>(null);

  ngOnInit() {
    this.productService.getTrending().subscribe(p => this.trending.set(p));
  }

  addToCart(product: Product) {
    this.cartService.add(product);
    this.addedId.set(product.id);
    setTimeout(() => this.addedId.set(null), 1500);
  }

  formatPrice(p: Product): string {
    return `$${(p.price / 84).toFixed(2)}`;
  }
}