/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button';

export default function ReloadUiDialog({ onClose = close }) {
  return (
    <Dialog title="New User Interface Version Available" onClose={onClose}>
      <p>
        An error has occurred while trying to navigate because the user interface version loaded within the browser is
        out of date.
      </p>
      <p>Please reload the browser window to get the latest version and continue.</p>
      <Button
        kind="primaryv2"
        onClick={() => {
          window.location.reload();
        }}
        autoFocus
      >
        Reload
      </Button>
    </Dialog>
  );
}
