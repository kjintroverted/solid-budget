import { Button, IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { CardHeader, Pane, Row, Spacer } from "solid-core/dist/components/styled";
import { addToUpdateQueue, initThing, loadByName, SaveState, setAllAttr } from "solid-core/dist/pods";
import styled from "styled-components";
import { THEME } from "../../util";
import { accountStruct } from "../accounts/accountStruct";
import NoteForm, { ACTION_TYPES } from "./NoteForm";
import { notebookStruct } from './noteStruct'


const Notes = () => {

  const { dataset, updateQueue, queue } = useContext(SaveState)
  const [notebook, updateNotes] = useState({ notes: [] });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!dataset) return;
    let data = loadByName(dataset, 'notes', notebookStruct);
    if (!data) {
      debugger
      (async function () {
        let data = await initThing('notes', { notes: [] }, notebookStruct)
        updateNotes(data)
      })()
    } else {
      updateNotes(data)
    }
  }, [dataset]);

  function addNote(note) {
    let updatedBook = { ...notebook, notes: [...notebook.notes, note] }
    let thing = setAllAttr(updatedBook.thing, updatedBook);
    updateQueue(addToUpdateQueue(queue, thing))
    setIsAdding(false)
    updateNotes({ ...updatedBook, thing })
  }

  function removeNote(i) {
    let updatedBook = { ...notebook, notes: [...notebook.notes.slice(0, i), ...notebook.notes.slice(i + 1)] }
    let thing = setAllAttr(updatedBook.thing, updatedBook);
    updateQueue(addToUpdateQueue(queue, thing))
    updateNotes({ ...updatedBook, thing })
  }

  function updateAccount(accountURL, value) {
    console.log('UPDATING', accountURL, value);
    let account = loadByName(dataset, accountURL, accountStruct)
    account.value += value;
    let thing = setAllAttr(account.thing, account);
    updateQueue(addToUpdateQueue(queue, thing))
  }

  function complete(i) {
    return () => {
      let note = notebook.notes[i]
      if (note.actionType === ACTION_TYPES.UPDATE) {
        updateAccount(note.account, note.value)
      } else if (note.actionType === ACTION_TYPES.TRANSFER) {
        updateAccount(note.account, note.value * -1)
        updateAccount(note.target, note.value)
      }
      removeNote(i)
    }
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
        isAdding && <NoteForm onSubmit={ addNote } dataset={ dataset } />
      }
      {
        notebook.notes.map((note, i) => (
          <NoteCard key={ note.text }>
            <Row align='center'>
              { note.text }
              <Spacer />
              <Button color='secondary' onClick={ complete(i) }>{ note.actionType === ACTION_TYPES.NONE ? 'Done' : note.actionType }</Button>
            </Row>
          </NoteCard>
        ))
      }
    </Pane>
  )
}

export default Notes;

const NoteCard = styled.div`
  width: 90%;
  padding: .5em;
  border: solid 1px ${ THEME.secondary };
  border-radius: 3px;
  margin-bottom: .5em;
`