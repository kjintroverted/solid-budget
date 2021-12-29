import { IconButton, Input } from "@material-ui/core";
import { useState } from "react";
import { Card, Column, Divider, Row, Spacer, Subtitle } from "solid-core/dist/components/styled";
import { CardHeader, THEME } from "../../util";

const BucketView = ({ bucket, onUpdate, onDelete }) => {

  const [editMode, setEditMode] = useState(false)

  return (
    <Card>
      <Row>
        <Column>
          <CardHeader>{ bucket.name }</CardHeader>
          <Subtitle>{ bucket.account }</Subtitle>
        </Column>
        <Spacer />
        <IconButton onClick={ () => setEditMode(!editMode) } color="primary">
          <span className="material-icons">{ editMode ? 'close' : 'edit' }</span>
        </IconButton>
        {
          editMode ?
            <IconButton onClick={ () => onDelete(bucket) } color="secondary">
              <span className="material-icons">delete</span>
            </IconButton>
            : <IconButton onClick={ onUpdate(bucket, "pinned", true) } color="primary">
              <span className="material-icons">{ bucket.pinned ? 'star' : 'star_outline' }</span>
            </IconButton>
        }
      </Row>
      <Divider theme={ THEME } />
      <Row justify="flex-end">
        <Input
          value={ bucket.balance || 0 }
          onChange={ onUpdate(bucket, "balance") }
          style={ { width: "75px" } }
          type="number"
          placeholder="balance" />
      </Row>
    </Card>
  )
}

export default BucketView;