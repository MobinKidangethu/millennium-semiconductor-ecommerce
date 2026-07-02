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
  'vishay': { file: 'vishay.png' }
};

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
