/**
 * Central price formatting — prices in products.json are already INR.
 */
export function inr(amount: number, decimals = 2): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

export function priceBreaksINR(basePrice: number) {
  return [
    { qty: '1–9',     minQty: 1,   price: +basePrice.toFixed(2) },
    { qty: '10–24',   minQty: 10,  price: +(basePrice * 0.95).toFixed(2) },
    { qty: '25–99',   minQty: 25,  price: +(basePrice * 0.90).toFixed(2) },
    { qty: '100–499', minQty: 100, price: +(basePrice * 0.85).toFixed(2) },
    { qty: '500+',    minQty: 500, price: +(basePrice * 0.78).toFixed(2) },
  ];
}
