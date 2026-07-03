import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { inr } from '../../core/utils/price.utils';
import { categoryIconPath } from '../../core/utils/icon.utils';
import { manufacturerLogoPath, manufacturerLogoIsDark, manufacturerNameMatches } from '../../core/utils/manufacturer.utils';
import { findManufacturerInfo, ManufacturerInfo } from '../../core/data/manufacturer-info.data';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-manufacturer-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, Header, Footer],
  templateUrl: './manufacturer-detail.html',
  styleUrls: ['./manufacturer-detail.scss']
})
export class ManufacturerDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private theme = inject(ThemeService);

  name = signal<string>('');
  info = signal<ManufacturerInfo | null>(null);
  products = signal<Product[]>([]);
  addedId = signal<number | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const name = params['name'] || '';
      this.name.set(name);
      this.info.set(findManufacturerInfo(name));
      this.productService.getAll().subscribe(all => {
        this.products.set(all.filter(p => manufacturerNameMatches(p.manufacturer, name)));
      });
    });
  }

  get logo(): string | null {
    return manufacturerLogoPath(this.name());
  }

  get logoDark(): boolean {
    return manufacturerLogoIsDark(this.name());
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

  onImgError(event: Event, category: string) {
    (event.target as HTMLImageElement).src = this.categoryIcon(category);
  }
}
