import { createContext } from "react"
import styled from "styled-components"

// https://poolors.com/4c1e81-0787a2-795a3f-e6cad4
export const THEME = {
  light: '#e6cad4',
  dark: '#795a3f',
  primary: '#4c1e81',
  secondary: '#0787a2'
}

export const AppTheme = createContext(THEME)

export const Credit = styled.p`
  color: green;
  margin: .1em;
  `

export const Debit = styled.p`
  color: red;
  margin: .1em;
`

export const Info = styled.div`
  display: flex;
  align-items: center;
  font-style: italic;
  opacity: .5;
  margin-top: .5em;
`

export function asMoney(value) {
  let num = +(value);
  let str = Math.ceil(num * 100) + "";
  return {
    dollar: str.slice(0, -2),
    full: `${ str.slice(0, -2) }.${ str.slice(-2) }`,
    ceil: () => +str.slice(0, -2) + 1
  }
}

export function getNextPayDate(basePayDate, date, inclusive) {
  let dayDiff = Math.floor((date.getTime() - basePayDate.getTime()) / 86400000) % 14;
  return !dayDiff && inclusive ? date.getDate() : date.getDate() + 14 - dayDiff;
}

export function getDebitBefore(bills, start, end, month) {
  return bills
    .filter(b => (+b.date >= start && +b.date <= end) && (!b.month || !b.month.length || b.month.includes(month)))
    .reduce((prev, curr) => +curr.debit + prev, 0)
}