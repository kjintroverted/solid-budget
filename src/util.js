import styled from "styled-components"

// https://poolors.com/4c1e81-0787a2-795a3f-e6cad4
export const THEME = {
  light: '#e6cad4',
  dark: '#795a3f',
  primary: '#4c1e81',
  secondary: '#0787a2'
}

export const Divider = styled.hr`
  width: 100%;
  border-color: ${ props => props.theme ? props.theme.light : THEME.light };
  border-style: solid;
  border-bottom-width: ${ props => props.thin ? '0px' : '1px' }
`