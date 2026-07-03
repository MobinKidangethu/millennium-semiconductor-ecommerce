export interface ManufacturerInfo {
  name: string;
  founded: string;
  headquarters: string;
  employees: string;
  website: string;
  description: string;
}

export const MANUFACTURER_INFO: Record<string, ManufacturerInfo> = {
  'texas instruments': {
    name: 'Texas Instruments',
    founded: '1930 (as Geophysical Service Inc.; reorganized as TI in 1951)',
    headquarters: 'Dallas, Texas, USA',
    employees: '~34,000',
    website: 'https://www.ti.com',
    description: 'American semiconductor company focused on analog and embedded processing chips. TI engineer Jack Kilby invented the integrated circuit in 1958, and the company built the first commercial transistor radio in 1954.'
  },
  'stmicroelectronics': {
    name: 'STMicroelectronics',
    founded: '1987 (merger of SGS Microelettronica and Thomson Semiconducteurs)',
    headquarters: 'Plan-les-Ouates, Geneva, Switzerland',
    employees: '~49,600',
    website: 'https://www.st.com',
    description: "Europe's largest semiconductor company, designing and manufacturing ICs and discrete components for automotive, industrial, and consumer electronics applications worldwide."
  },
  'nxp': {
    name: 'NXP',
    founded: '2006 (spun off from Philips Semiconductors, with roots to 1953)',
    headquarters: 'Eindhoven, Netherlands',
    employees: '~34,000',
    website: 'https://www.nxp.com',
    description: 'Global leader in secure connectivity solutions for embedded applications, serving the automotive, industrial & IoT, mobile, and communications infrastructure markets.'
  },
  'infineon': {
    name: 'Infineon Technologies',
    founded: '1999 (spun off from Siemens)',
    headquarters: 'Neubiberg (Munich), Germany',
    employees: '~57,000',
    website: 'https://www.infineon.com',
    description: "Germany's largest chipmaker and a global leader in automotive semiconductors, power management, and security systems."
  },
  'analog devices': {
    name: 'Analog Devices',
    founded: '1965',
    headquarters: 'Wilmington, Massachusetts, USA',
    employees: '~29,000',
    website: 'https://www.analog.com',
    description: 'Leader in data conversion, signal processing, and power management technology, serving communications, industrial, automotive, and instrumentation markets.'
  },
  'microchip': {
    name: 'Microchip Technology',
    founded: '1989 (spun off from General Instrument)',
    headquarters: 'Chandler, Arizona, USA',
    employees: '~18,000',
    website: 'https://www.microchip.com',
    description: 'Provider of smart, connected, and secure embedded control solutions, including microcontrollers and analog, interface, and mixed-signal ICs.'
  },
  'renesas': {
    name: 'Renesas Electronics',
    founded: '2002/2010 (merger of Hitachi & Mitsubishi Electric semiconductor units, later joined by NEC Electronics)',
    headquarters: 'Tokyo, Japan',
    employees: '~21,600',
    website: 'https://www.renesas.com',
    description: 'Major Japanese supplier of automotive and industrial microcontrollers, ranked among the top global MCU makers.'
  },
  'vishay': {
    name: 'Vishay',
    founded: '1962 (Felix Zandman)',
    headquarters: 'Malvern, Pennsylvania, USA',
    employees: '~23,500',
    website: 'https://www.vishay.com',
    description: "One of the world's largest manufacturers of discrete semiconductors and passive components — diodes, MOSFETs, resistors, capacitors, and inductors."
  },
  'ixys': {
    name: 'IXYS',
    founded: '1983 in Silicon Valley; acquired by Littelfuse in 2018',
    headquarters: 'Formerly Milpitas, California, USA — now part of Littelfuse',
    employees: 'Combined with Littelfuse (~16,000)',
    website: 'https://www.littelfuse.com',
    description: 'Pioneer in power semiconductors, solid-state relays, and high-voltage ICs. Littelfuse acquired IXYS in 2018 for roughly $750M to expand its power semiconductor portfolio.'
  },
  'littelfuse': {
    name: 'Littelfuse',
    founded: '1927 (Edward V. Sundt, Chicago)',
    headquarters: 'Chicago / Rosemont, Illinois, USA',
    employees: '~16,000',
    website: 'https://www.littelfuse.com',
    description: 'Diversified industrial technology manufacturer specializing in circuit protection, power control, and sensing products for transportation, industrial, and electronics markets.'
  },
  'toshiba': {
    name: 'Toshiba',
    founded: '2017 (Toshiba Electronic Devices & Storage Corp.); parent Toshiba Corp. traces to 1875',
    headquarters: 'Kawasaki, Kanagawa, Japan',
    employees: '~17,000 (Electronic Devices & Storage division)',
    website: 'https://toshiba.semicon-storage.com',
    description: "Japanese electronics giant's semiconductor arm, focused on power devices, discrete components, sensors, and storage solutions for automotive, industrial, and consumer applications."
  },
  'qorvo': {
    name: 'Qorvo',
    founded: '2015 (merger of TriQuint Semiconductor and RF Micro Devices)',
    headquarters: 'Greensboro, North Carolina, USA',
    employees: '~8,000',
    website: 'https://www.qorvo.com',
    description: 'Global leader in RF solutions — filters, amplifiers, and power management ICs for mobile, infrastructure, defense/aerospace, and IoT markets.'
  }
};

export function findManufacturerInfo(name: string): ManufacturerInfo | null {
  const lower = name.toLowerCase();
  for (const key of Object.keys(MANUFACTURER_INFO)) {
    if (lower.includes(key) || key.includes(lower)) {
      return MANUFACTURER_INFO[key];
    }
  }
  return null;
}
