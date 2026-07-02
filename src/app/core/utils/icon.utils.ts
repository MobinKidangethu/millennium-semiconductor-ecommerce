import { ThemeName } from '../services/theme.service';

const CATEGORY_ICON_MAP: Record<string, string> = {
  'Semiconductors': 'semiconductors',
  'Circuit Protection': 'circuit-protection',
  'Connectors': 'connectors',
  'Electromechanical': 'electromechanical',
  'Passive Components': 'passive-components',
  'RF & Wireless': 'rf-wireless',
  'Sensors': 'sensors',
  'Power': 'power',
  'Memory & Storage': 'memory-storage',
  'LED Lighting': 'led-lighting',
  'Thermal Management': 'thermal-management',
  'Tools & Supplies': 'tools-supplies'
};

// Icons that are pre-colored per-theme (maroon vs. blue variant on disk).
// Icons not in this set (e.g. white icons used on colored backgrounds) are
// theme-independent and live directly under assets/icons/.
const THEMED_ICONS = new Set([
  'shopping-cart', 'user', 'authorized-distributor', 'manufacturers',
  'products-in-stock', 'same-day-ship', 'shipping-available',
  'technical-support', 'volume-pricing'
]);

function themedBase(theme: ThemeName): string {
  return theme === 'blue' ? 'assets/icons/blue' : 'assets/icons';
}

export function categoryIconPath(category: string, theme: ThemeName = 'maroon'): string {
  const slug = CATEGORY_ICON_MAP[category] ?? 'semiconductors';
  return `${themedBase(theme)}/categories/${slug}.svg`;
}

export function iconPath(name: string, theme: ThemeName = 'maroon'): string {
  const base = THEMED_ICONS.has(name) ? themedBase(theme) : 'assets/icons';
  return `${base}/${name}.svg`;
}
