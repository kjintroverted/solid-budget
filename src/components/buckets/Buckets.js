import { IconButton } from "@material-ui/core"
import { useEffect, useState } from "react"
import { Divider, Card, Column, Row, Spacer, Subtitle } from "solid-core/dist/components/styled"
import { initThing } from "solid-core/dist/pods"
import styled from "styled-components"
import { CardHeader, THEME } from "../../util"
import BucketForm from "./BucketForm"
import { bucketStruct } from "./bucketStruct"

const Buckets = ({ accounts, bucketData }) => {

  const [isAdding, setIsAdding] = useState(false)
  const [buckets, updateBuckets] = useState([])

  useEffect(() => {
    if (bucketData) updateBuckets(bucketData.sort(a => a.pinned ? -1 : 0))
  }, [bucketData])

  async function addBucket(b) {
    setIsAdding(false)
    let thing = await initThing('bucket', b, bucketStruct)
    b = { ...b, thing }
    updateBuckets(b.pinned ? [b, ...buckets] : [...buckets, b])
  }

  return (
    <Container>
      <Row align="center">
        <CardHeader>Buckets</CardHeader>
        <Spacer />
        <IconButton onClick={ () => setIsAdding(!isAdding) } color="primary">
          <span className="material-icons">{ isAdding ? 'close' : 'add' }</span>
        </IconButton>
      </Row>
      {
        isAdding &&
        <Card>
          <BucketForm accounts={ accounts } onSubmit={ addBucket } />
        </Card>
      }
      {
        buckets.map(b => (
          <Card key={ b.thing.url }>
            <Row>
              <Column>
                <CardHeader>{ b.name }</CardHeader>
                <Subtitle>{ b.account }</Subtitle>
              </Column>
              <Spacer />
              <IconButton color="primary">
                <span className="material-icons">{ b.pinned ? 'star' : 'star_outline' }</span>
              </IconButton>
            </Row>
            <Divider theme={ THEME } />
          </Card>
        ))
      }
    </Container>
  )
}

export default Buckets;

const Container = styled.div`
  width: 90%;
`