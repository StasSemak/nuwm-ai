import clsx, { ClassValue } from "clsx";
import { twMerge } from "tw-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const localeString = date.toLocaleString();
  const localeStringTokenized = localeString.split(", ");
  const outputString = localeStringTokenized.join(" ");
  return outputString;
}
