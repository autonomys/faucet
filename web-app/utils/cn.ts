import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * ClassName Util Function that combines twMerge and clsx
 * @param classes
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes))
}
