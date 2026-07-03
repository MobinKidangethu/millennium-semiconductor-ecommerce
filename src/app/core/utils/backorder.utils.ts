export interface BackorderInfo {
  requestedQty: number;
  availableQty: number;
  dispatchQty: number;
  backorderedQty: number;
  isBackordered: boolean;
}

// When the ordered quantity exceeds on-hand stock, the order splits into
// what can ship immediately and what goes on back-order with the factory.
export function getBackorderInfo(availableQty: number, requestedQty: number): BackorderInfo {
  const dispatchQty = Math.max(0, Math.min(requestedQty, availableQty));
  const backorderedQty = Math.max(0, requestedQty - availableQty);
  return {
    requestedQty,
    availableQty,
    dispatchQty,
    backorderedQty,
    isBackordered: backorderedQty > 0
  };
}

// Deterministic per-product placeholder lead time (no real factory-feed in this demo).
export function factoryLeadTimeWeeks(productId: number): number {
  return 4 + (productId % 12);
}
