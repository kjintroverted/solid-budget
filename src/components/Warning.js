import React, { useState } from 'react';
import { day } from '../util/helper';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const Warning = ({ lastUpdated = new Date(0) }) => {

  const [open, setOpen] = useState(true)

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const autoClose = 15000
  const now = new Date()

  if (now - lastUpdated < day * 2) {
    return (
      <Snackbar onClose={ handleClose } open={ open } autoHideDuration={ autoClose } >
        <Alert onClose={ handleClose } severity="success">
          Budget is up to date.
        </Alert>
      </Snackbar>
    )
  }

  return (
    <Snackbar onClose={ handleClose } open={ open } autoHideDuration={ autoClose } >
      <Alert onClose={ handleClose } severity={ now - lastUpdated > day * 5 ? 'error' : 'warning' }>
        Info displayed may be out dated. Last updated { Math.floor((now - lastUpdated) / day) } days ago.
      </Alert>
    </Snackbar>
  )
}

export default Warning;
