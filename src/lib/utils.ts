import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency in Mozambican Metical (MZN).
 * Includes two decimal places for cents.
 * @param amount The number to format.
 * @returns Formatted currency string (e.g., "1.234,56 MZN").
 */
export function formatCurrency(amount: number): string {
  // 1. Formata o número com separadores de milhar e decimal (pt-MZ)
  const formattedNumber = new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // 2. Adiciona a sigla MZN no final
  return `${formattedNumber} MZN`;
}