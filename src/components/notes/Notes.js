import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CardHeader, Pane, Row, Spacer } from "solid-core/dist/components/styled";
import { loadThing } from "solid-core/dist/pods";
import NoteForm from "./NoteForm";
import { notebookStruct } from "./noteStruct";


const Notes = ({ data }) => {

  const [isAdding, setIsAdding] = useState(false);
  const [noteBook, updateNotes] = useState({ notes: [] })

  useEffect(() => {
    // LOAD NOTES
    if (!data) return
    loadThing(data.url, notebookStruct)
      .then(updateNotes)
  }, [data]);

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