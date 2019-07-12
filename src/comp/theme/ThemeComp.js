import styled from 'styled-components';

export const Spacer = styled.span`
  flex: 1;
`

export const WidgetContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100px;
  background: white;
  box-shadow: lightgray 1px 1px 5px;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

export const ActionBar = styled.span`
  display: flex;
  flex-direction: row-reverse;
`

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  border-bottom: lightgray solid 1px;
  h2 {
    margin: 0px;
  }
`

export const Row = styled.div`display:flex`