import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CardHeader, Pane, Row, Spacer } from "solid-core/dist/components/styled";
import NoteForm from "./NoteForm";


const Notes = () => {

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // LOAD NOTES
  }, []);

  return (
    <Pane width="500px">
      <Row align="center">
        <CardHeader>Notes</CardHeader>
        <Spacer />
        <IconButton onClick={ () => setIsAdding(!isAdding) } color="primary">
          <span className="material-icons">{ isAdding ? 'close' : 'add' }</span>
        </IconButton>
      </Row>
      {
        isAdding && <NoteForm onSubmit={ console.log } />
      }
    </Pane>
  )
}

export default Notes;