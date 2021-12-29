import { IconButton, Input } from "@material-ui/core"
import { useContext, useEffect, useState } from "react"
import { Divider, Card, Column, Row, Spacer, Subtitle } from "solid-core/dist/components/styled"
import { addToUpdateQueue, initThing, SaveState, setAttr } from "solid-core/dist/pods"
import styled from "styled-components"
import { CardHeader, THEME } from "../../util"
import BucketForm from "./BucketForm"
import { bucketStruct } from "./bucketStruct"

const Buckets = ({ accounts, bucketData }) => {

  const { updateQueue, queue } = useContext(SaveState)

  const [isAdding, setIsAdding] = useState(false)
  const [show, setShow] = useState(true)
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

  function updateBucket(bucket, field, toggle) {
    let i = buckets.findIndex(b => b.thing.url === bucket.thing.url)
    return e => {
      let value = toggle ? !bucket[field] : e.target.value;
      let thing = setAttr(bucket.thing, bucketStruct[field], value)
      updateQueue(addToUpdateQueue(queue, thing))
      updateBuckets(
        [...buckets.slice(0, i), { ...bucket, [field]: value, thing }, ...buckets.slice(i + 1)]
          .sort(a => a.pinned ? -1 : 0)
      )
    }
  }

  return (
    <Container>
      <Row align="center">
        <CardHeader>{ buckets.length } Buckets</CardHeader>
        <Spacer />
        <IconButton onClick={ () => setShow(!show) } color="primary">
          <span className="material-icons">{ show ? 'visibility_off' : 'visibility' }</span>
        </IconButton>
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
        show &&
        buckets.map(b => (
          <Card key={ b.thing.url }>
            <Row>
              <Column>
                <CardHeader>{ b.name }</CardHeader>
                <Subtitle>{ b.account }</Subtitle>
              </Column>
              <Spacer />
              <IconButton onClick={ updateBucket(b, "pinned", true) } color="primary">
                <span className="material-icons">{ b.pinned ? 'star' : 'star_outline' }</span>
              </IconButton>
            </Row>
            <Divider theme={ THEME } />
            <Row justify="flex-end">
              <Input
                value={ b.balance || 0 }
                onChange={ updateBucket(b, "balance") }
                style={ { width: "75px" } }
                type="number"
                placeholder="balance" />
            </Row>
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