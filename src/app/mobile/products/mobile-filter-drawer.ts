import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface MobileFilterState {
  manufacturers: string[];
  productTypes: string[];
  mountingStyles: string[];
  selectedManufacturers: Set<string>;
  selectedProductTypes: Set<string>;
  selectedMountingStyles: Set<string>;
  inStockOnly: boolean;
  rohsOnly: boolean;
  priceMin: number;
  priceMax: number;
  globalMaxPrice: number;
}

@Component({
  selector: 'app-mobile-filter-drawer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="m-filter__backdrop" (click)="close.emit()"></div>
    <div class="m-filter">
      <div class="m-filter__header">
        <button (click)="close.emit()" class="m-filter__x">✕</button>
        <h2>Refine Results</h2>
        <button class="m-filter__clear" (click)="clearAll.emit()">Clear All</button>
      </div>

      <div class="m-filter__body">
        <label class="m-filter__checkbox">
          <input type="checkbox" [checked]="state().inStockOnly" (change)="toggleInStock.emit()" />
          In Stock Only
        </label>
        <label class="m-filter__checkbox">
          <input type="checkbox" [checked]="state().rohsOnly" (change)="toggleRohs.emit()" />
          RoHS Compliant
        </label>

        <div class="m-filter__section-header">PRICE RANGE</div>
        <div class="m-filter__price-row">
          <input type="number" [ngModel]="state().priceMin" (ngModelChange)="priceMinChange.emit($event)" />
          <span>—</span>
          <input type="number" [ngModel]="state().priceMax" (ngModelChange)="priceMaxChange.emit($event)" />
        </div>

        <div class="m-filter__section-header">MANUFACTURER</div>
        <div class="m-filter__list">
          @for (m of state().manufacturers; track m) {
            <label class="m-filter__row">
              <input type="checkbox" [checked]="state().selectedManufacturers.has(m)" (change)="toggleManufacturer.emit(m)" />
              <span>{{ m }}</span>
            </label>
          }
        </div>

        <div class="m-filter__section-header">PRODUCT TYPE</div>
        <div class="m-filter__list">
          @for (t of state().productTypes; track t) {
            <label class="m-filter__row">
              <input type="checkbox" [checked]="state().selectedProductTypes.has(t)" (change)="toggleProductType.emit(t)" />
              <span>{{ t }}</span>
            </label>
          }
        </div>

        <div class="m-filter__section-header">MOUNTING STYLE</div>
        <div class="m-filter__list">
          @for (s of state().mountingStyles; track s) {
            <label class="m-filter__row">
              <input type="checkbox" [checked]="state().selectedMountingStyles.has(s)" (change)="toggleMountingStyle.emit(s)" />
              <span>{{ s }}</span>
            </label>
          }
        </div>
      </div>

      <button class="m-filter__apply" (click)="close.emit()">Apply Filter</button>
    </div>
  `,
  styles: [`
    .m-filter__backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90; }
    .m-filter { position: fixed; inset: 0; background: #fff; z-index: 91; display: flex; flex-direction: column; }
    .m-filter__header { display: flex; align-items: center; gap: 14px; padding: 18px 16px; border-bottom: 1px solid #eee; }
    .m-filter__header h2 { flex: 1; font-size: 18px; font-weight: 800; margin: 0; }
    .m-filter__x { background: none; border: none; font-size: 18px; }
    .m-filter__clear { background: none; border: none; color: var(--color-primary, #70284e); font-weight: 700; }
    .m-filter__body { flex: 1; overflow-y: auto; padding: 18px 16px; }
    .m-filter__checkbox { display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 15px; color: #1a1a2e; border-bottom: 1px solid #f5f5f5; }
    .m-filter__section-header { font-size: 12.5px; font-weight: 800; color: #333; letter-spacing: 0.5px; padding: 16px 0 10px; border-top: 1px solid #eee; margin-top: 6px; }
    .m-filter__price-row { display: flex; align-items: center; gap: 10px; }
    .m-filter__price-row input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px; font-size: 14px; }
    .m-filter__list { max-height: 200px; overflow-y: auto; }
    .m-filter__row { display: flex; align-items: center; gap: 12px; padding: 9px 0; font-size: 14.5px; color: #1a1a2e; }
    .m-filter__apply { background: var(--color-primary, #70284e); color: #fff; border: none; padding: 16px; font-weight: 700; font-size: 15px; margin: 12px 16px 18px; border-radius: 8px; }
  `]
})
export class MobileFilterDrawer {
  state = input.required<MobileFilterState>();
  close = output<void>();
  clearAll = output<void>();
  toggleInStock = output<void>();
  toggleRohs = output<void>();
  toggleManufacturer = output<string>();
  toggleProductType = output<string>();
  toggleMountingStyle = output<string>();
  priceMinChange = output<number>();
  priceMaxChange = output<number>();
}
