import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import productsJson from '../../../assets/data/products.json';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = productsJson as Product[];

  getAll(): Observable<Product[]> {
    return of(this.products);
  }

  getById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  getTrending(): Observable<Product[]> {
    return of(this.products.slice(0, 6));
  }

  getByCategory(cat: string): Observable<Product[]> {
    return of(this.products.filter(p => p.category === cat));
  }

  getManufacturers(): string[] {
    return [...new Set(this.products.map(p => p.manufacturer))].slice(0, 8);
  }
}