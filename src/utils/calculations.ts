import type { LineItem } from "@/types/invoice";

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateDiscount(
  subtotal: number,
  discountType: "percentage" | "fixed",
  discountRate: number,
  discountAmount: number,
): number {
  if (discountType === "fixed") {
    return Math.min(discountAmount, subtotal);
  }
  return subtotal * (discountRate / 100);
}

export function calculateTax(
  discountedSubtotal: number,
  taxRate: number,
): number {
  return discountedSubtotal * (taxRate / 100);
}

export function calculateTotal(
  discountedSubtotal: number,
  tax: number,
): number {
  return discountedSubtotal + tax;
}
