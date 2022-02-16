import { IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { CardHeader, Pane, Row, Spacer } from "solid-core/dist/components/styled";
import { initThing, loadByName, SaveState } from "solid-core/dist/pods";
import NoteForm from "./NoteForm";
import { notebookStruct } from './noteStruct'


const Notes = () => {

  const { dataset } = useContext(SaveState)
  const [notebook, updateNotes] = useState({ notes: [] });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!dataset) return;
    let data = loadByName(dataset, 'notes', notebookStruct);
    if (!data) {
      (async function () {
        debugger
        let data = await initThing('notes', { notes: [] }, notebookStruct)
        updateNotes(data)
      })()
    } else {
      updateNotes(data)
    }
  }, [dataset]);

  function addNote(note) {
    let updatedBook = { ...notebook, notes: [...notebook.notes, note] }
  }

  return (
    <Pane width="100%">
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