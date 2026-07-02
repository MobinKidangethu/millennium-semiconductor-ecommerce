const IMAGE_DIR = 'assets/images/products/';

// Real product photos we have on hand. Used to give a visually varied set of
// images on the home page trending grid, independent of which exact part each
// card is (several trending parts share the same package photo otherwise).
export const PRODUCT_IMAGE_POOL: string[] = [
  'AIGBG15N120S7ATMA1.webp',
  '2KDFN27CA-M3H.webp',
  '3KDFN15CA-M3H.webp',
  'BZG03C62-HM3_A-08.webp',
  'FS01M5R12A7MA2BHPSA1.webp',
  'IMBG75R016M2HXTMA1.webp',
  'KBPE0480-M3P.webp',
  'SE50124-M3I.webp',
  'SS8PH102-M3I.webp',
  'VS-4C20ET07S2L-M3.webp',
].map(file => IMAGE_DIR + file);

export function pooledProductImage(index: number): string {
  return PRODUCT_IMAGE_POOL[index % PRODUCT_IMAGE_POOL.length];
}
