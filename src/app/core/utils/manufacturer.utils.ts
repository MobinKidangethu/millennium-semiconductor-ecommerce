interface ManufacturerLogo {
  file: string;
  dark?: boolean; // true when the logo is light-colored and needs a dark card background
}

const MANUFACTURER_LOGOS: Record<string, ManufacturerLogo> = {
  'texas instruments': { file: 'texas-instruments.webp' },
  'stmicroelectronics': { file: 'stmicroelectronics.svg' },
  'nxp': { file: 'nxp.svg' },
  'infineon': { file: 'infineon.svg' },
  'analog devices': { file: 'analog-devices.svg' },
  'microchip': { file: 'microchip.png', dark: true },
  'renesas': { file: 'renesas.svg', dark: true },
  'vishay': { file: 'vishay.png' },
  'ixys': { file: 'ixys.webp' },
  'littelfuse': { file: 'littlefuse.webp' },
  'toshiba': { file: 'toshiba.jpg' },
  'qorvo': { file: 'qorvo.png' }
};

// Every brand shown on the site — including ones with no products in the
// catalog yet. Selecting one of the product-less brands should still route
// to the product listing and show its empty state.
export const ALL_MANUFACTURERS: string[] = [
  'Texas Instruments',
  'STMicroelectronics',
  'NXP',
  'Infineon Technologies',
  'Analog Devices',
  'Microchip Technology',
  'Renesas Electronics',
  'Vishay',
  'IXYS',
  'Littelfuse',
  'Toshiba',
  'Qorvo'
];

function findLogo(manufacturer: string): ManufacturerLogo | null {
  const name = manufacturer.toLowerCase();
  for (const key of Object.keys(MANUFACTURER_LOGOS)) {
    if (name.includes(key) || key.includes(name)) {
      return MANUFACTURER_LOGOS[key];
    }
  }
  return null;
}

export function manufacturerLogoPath(manufacturer: string): string | null {
  const logo = findLogo(manufacturer);
  return logo ? `assets/logos/manufacturers/${logo.file}` : null;
}

export function manufacturerLogoIsDark(manufacturer: string): boolean {
  return !!findLogo(manufacturer)?.dark;
}

// Loose match used to line up a catalog manufacturer string (e.g. "Vishay
// Semiconductors") with the canonical brand name shown in the UI ("Vishay").
export function manufacturerNameMatches(productManufacturer: string, brandName: string): boolean {
  const a = productManufacturer.toLowerCase();
  const b = brandName.toLowerCase();
  return a.includes(b) || b.includes(a);
}
