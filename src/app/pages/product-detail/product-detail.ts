import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, Header, Footer],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  activeTab = signal('specs');
  quantity = signal(1);
  added = signal(false);
  activeImage = signal(0);

  priceBreaks = [
    { qty: '1-9', price: 0 },
    { qty: '10-24', price: 0 },
    { qty: '25-99', price: 0 },
    { qty: '100-499', price: 0 },
    { qty: '500+', price: 0 }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.productService.getById(id).subscribe(p => {
        if (p) {
          this.product.set(p);
          const usd = p.price / 84;
          this.priceBreaks = [
            { qty: '1-9', price: +usd.toFixed(2) },
            { qty: '10-24', price: +(usd * 0.95).toFixed(2) },
            { qty: '25-99', price: +(usd * 0.90).toFixed(2) },
            { qty: '100-499', price: +(usd * 0.85).toFixed(2) },
            { qty: '500+', price: +(usd * 0.78).toFixed(2) }
          ];
        }
      });
      this.productService.getTrending().subscribe(prods =>
        this.related.set(prods.filter(p => p.id !== id).slice(0, 5))
      );
    });
  }

  get usdPrice(): string {
    const p = this.product();
    return p ? `$${(p.price / 84).toFixed(2)}` : '';
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.add(p, this.quantity());
      this.added.set(true);
      setTimeout(() => this.added.set(false), 2000);
    }
  }

  changeQty(delta: number) {
    const newQty = Math.max(1, this.quantity() + delta);
    this.quantity.set(newQty);
  }
}