import { IconButton } from "@material-ui/core"
import { useContext, useEffect, useState } from "react"
import { Card, Row, Spacer, CardHeader } from "solid-core/dist/components/styled"
import { addToUpdateQueue, deleteThing, initThing, loadAllByName, SaveState, setAttr } from "solid-core/dist/pods"
import styled from "styled-components"
import { accountStruct } from "../accounts/accountStruct"
import BucketForm from "./BucketForm"
import { bucketStruct } from "./bucketStruct"
import BucketView from "./BucketView"

const Buckets = ({ onUpdate }) => {

  const { updateQueue, queue, dataset, setDataset, setBuckets } = useContext(SaveState)

  const [isAdding, setIsAdding] = useState(false)
  const [show, setShow] = useState(false)
  const [buckets, updateBuckets] = useState([])
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    if (!dataset) return
    let bucketData = loadAllByName(dataset, 'bucket', bucketStruct);
    setBuckets(bucketData)
    updateBuckets(
      bucketData
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort(a => a.pinned ? -1 : 0)
    )
    setAccounts(loadAllByName(dataset, 'account', accountStruct))
  }, [dataset, setBuckets])

  async function addBucket(b) {
    setIsAdding(false)
    let { dataset, thing } = await initThing('bucket', b, bucketStruct)
    b = { ...b, thing }
    updateBuckets(b.pinned ? [b, ...buckets] : [...buckets, b])
    onUpdate([...buckets, b])
    setDataset(dataset)
  }

  async function deleteBucket(bucket) {
    let i = buckets.findIndex(b => b.thing.url === bucket.thing.url)
    await deleteThing(bucket.thing)
    updateBuckets([...buckets.slice(0, i), ...buckets.slice(i + 1)])
    onUpdate([...buckets.slice(0, i), ...buckets.slice(i + 1)])
  }

  function updateBucket(bucket, field, toggle) {
    let i = buckets.findIndex(b => b.thing.url === bucket.thing.url)
    return e => {
      let value = toggle ? !bucket[field] : e.target.value;
      let thing = setAttr(bucket.thing, bucketStruct[field], value)
      updateQueue(addToUpdateQueue(queue, thing))
      let updatedList = [...buckets.slice(0, i), { ...bucket, [field]: value, thing }, ...buckets.slice(i + 1)];
      if (toggle) updatedList = updatedList.sort(a => a.pinned ? -1 : 0)
      updateBuckets(updatedList)
      onUpdate(updatedList)
    }
  }

  function updateBalance(bucket, value) {
    let i = buckets.findIndex(b => b.thing.url === bucket.thing.url)
    let thing = setAttr(bucket.thing, bucketStruct.balance, value)
    updateQueue(addToUpdateQueue(queue, thing))
    updateBuckets(
      [...buckets.slice(0, i),
      { ...bucket, balance: value, thing },
      ...buckets.slice(i + 1)]
    )
    onUpdate(
      [...buckets.slice(0, i),
      { ...bucket, balance: value, thing },
      ...buckets.slice(i + 1)]
    )
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
        buckets.map(b => <BucketView key={ b.thing.url } bucket={ b } onUpdate={ updateBucket } accounts={ accounts } updateBalance={ updateBalance } onDelete={ deleteBucket } />)
      }
    </Container>
  )
}

export default Buckets;

const Container = styled.div`
  width: 90%;
`