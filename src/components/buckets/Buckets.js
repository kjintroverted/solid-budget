import { IconButton } from "@material-ui/core"
import { useState } from "react"
import { Card, Row, Spacer } from "solid-core/dist/components/styled"
import styled from "styled-components"
import { THEME } from "../../util"
import BucketForm from "./BucketForm"

const Buckets = ({ accounts }) => {

  const [isAdding, setIsAdding] = useState(false)

  return (
    <Container>
      <Row align="center">
        <h3 style={ { margin: 0 } } theme={ THEME }>Buckets</h3>
        <Spacer />
        <IconButton onClick={ () => setIsAdding(!isAdding) } color="primary">
          <span className="material-icons">{ isAdding ? 'close' : 'add' }</span>
        </IconButton>
      </Row>
      {
        isAdding &&
        <Card>
          <BucketForm accounts={ accounts } />
        </Card>
      }
    </Container>
  )
}

export default Buckets;

const Container = styled.div`
  width: 90%;
`