import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toEur(amount: number) {
  const EUR = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  });
  return EUR.format(amount / 100);
}
