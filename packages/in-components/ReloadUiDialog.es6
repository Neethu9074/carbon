import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';

export default function ReloadUiDialog({ onClose = close }) {
  return (
    <Dialog title="New User Interface Version Available" onClose={onClose}>
      <p>
        An error has occurred while trying to navigate beacuse the user interface version loaded within the browser is
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
