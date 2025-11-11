import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency in Mozambican Metical (MZN), without cents.
 * @param amount The number to format.
 * @returns Formatted currency string (e.g., "1.234 MZN").
 */
export function formatCurrency(amount: number): string {
  // Arredonda o valor para o número inteiro mais próximo antes de formatar
  const roundedAmount = Math.round(amount);
  
  // 1. Formata o número sem separadores de milhar e decimal (pt-MZ)
  const formattedNumber = new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);
  
  // 2. Adiciona a sigla MZN no final
  return `${formattedNumber} MZN`;
}