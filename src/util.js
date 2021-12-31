import { createContext } from "react"

// https://poolors.com/4c1e81-0787a2-795a3f-e6cad4
export const THEME = {
  light: '#e6cad4',
  dark: '#795a3f',
  primary: '#4c1e81',
  secondary: '#0787a2'
}

export const AppTheme = createContext(THEME)

export function getNextPayDate(basePayDate, date, inclusive) {
  let dayDiff = Math.floor((date.getTime() - basePayDate.getTime()) / 86400000) % 14;
  return !dayDiff && inclusive ? date.getDate() : date.getDate() + 14 - dayDiff;
}

export function getDebitBefore(bills, date, month) {
  return bills
    .filter(b => (+b.date <= date) && (!b.month || b.month === month))
    .reduce((prev, curr) => +curr.debit + prev, 0)
}