import styled from 'styled-components';

export const Spacer = styled.span`
  flex: 1;
`

export const WidgetContainer = styled.div`
  position: relative;
  background: white;
  box-shadow: lightgray 1px 1px 5px;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
`

export const ActionBar = styled.span`
  display: flex;
  flex-direction: row-reverse;
`

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  border-bottom: lightgray solid 1px;
  padding: 0px 5px;
  h2, p {
    margin: 0px;
  }
`

export const Row = styled.div`
  display:flex;
  justify-content: ${props => props.just };
  align-items: ${props => props.align };
`
export const Column = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: ${props => props.just };
  align-items: ${props => props.align };
`

export const RowCenter = styled.div`
  display: flex;
  align-items: center;
`

export const IndentRow = styled.div`
  display: flex;
  align-items: start;
  padding-left: 15px;
  padding-right: 10px;
  border-bottom: whitesmoke solid 1px;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  opacity: .5;
  & * {
    margin: 5px 0px;
  }
`

export const BottomAnchor = styled.div`
  position: fixed;
  bottom: .5em;
  right: .5em;
  z-index: 99;
`

export const ErrorText = styled.p`
  color: red;
`
export const LoadingContainer = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`

export const FabLoader = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
`
