import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const MANUFACTURERS = [
  { name: 'Adafruit', count: 42 },
  { name: 'Advanced Linear Devices', count: 128 },
  { name: 'Ampleon', count: 15 },
  { name: 'Analog Devices Inc.', count: 1240 },
  { name: 'APC-E', count: 3 },
];

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
        <button class="m-filter__clear" (click)="clearAll()">Clear All</button>
      </div>

      <div class="m-filter__body">
        <div class="m-filter__search-label">Search within results</div>
        <div class="m-filter__search-box">
          <span>🔍</span>
          <input [(ngModel)]="keyword" placeholder="Part No. / Keyword" />
        </div>

        @for (opt of quickFilters(); track opt.label) {
          <label class="m-filter__checkbox">
            <input type="checkbox" [(ngModel)]="opt.checked" />
            {{ opt.label }}
          </label>
        }

        <div class="m-filter__section-header">MANUFACTURER</div>
        <div class="m-filter__mfr-list">
          @for (m of manufacturers; track m.name) {
            <label class="m-filter__mfr-row">
              <span class="m-filter__mfr-check">
                <input type="checkbox" [(ngModel)]="selectedMfrs[m.name]" />
              </span>
              <span class="m-filter__mfr-name">{{ m.name }}</span>
              <span class="m-filter__mfr-count">{{ m.count }}</span>
            </label>
          }
        </div>

        <div class="m-filter__section-header">PRODUCT TYPE ⌄</div>
        <div class="m-filter__section-header">TECHNOLOGY ⌄</div>
      </div>

      <button class="m-filter__apply" (click)="apply.emit()">Apply Filter</button>
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
    .m-filter__search-label { font-size: 13.5px; font-weight: 700; color: #333; margin-bottom: 8px; }
    .m-filter__search-box { display: flex; align-items: center; gap: 10px; border: 1px solid #ddd; border-radius: 8px; padding: 11px 14px; margin-bottom: 18px; }
    .m-filter__search-box input { border: none; outline: none; flex: 1; font-size: 14px; }
    .m-filter__checkbox { display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 15px; color: #1a1a2e; border-bottom: 1px solid #f5f5f5; }
    .m-filter__section-header { font-size: 12.5px; font-weight: 800; color: #333; letter-spacing: 0.5px; padding: 16px 0 10px; border-top: 1px solid #eee; margin-top: 6px; }
    .m-filter__mfr-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; }
    .m-filter__mfr-name { flex: 1; font-size: 15px; color: #1a1a2e; }
    .m-filter__mfr-count { color: #888; font-size: 13px; }
    .m-filter__apply { background: var(--color-primary, #70284e); color: #fff; border: none; padding: 16px; font-weight: 700; font-size: 15px; margin: 12px 16px 18px; border-radius: 8px; }
  `]
})
export class MobileFilterDrawer {
  close = output<void>();
  apply = output<void>();
  keyword = '';
  manufacturers = MANUFACTURERS;
  selectedMfrs: Record<string, boolean> = { 'Adafruit': true };
  quickFilters = signal([
    { label: 'In Stock', checked: false },
    { label: 'Active', checked: false },
    { label: 'RoHS Compliant', checked: false },
    { label: 'Normally Stocked', checked: false },
    { label: 'New Products', checked: false },
  ]);

  clearAll() {
    this.keyword = '';
    this.selectedMfrs = {};
    this.quickFilters.update(list => list.map(f => ({ ...f, checked: false })));
  }
}
