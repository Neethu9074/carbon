import React from 'react';

import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import Dialog from 'in-components/Dialog';

import locals from './SelectEventsButton.mless';

export default function SelectEventsButton() {
  return (
    <Button
      className={locals.selectButton}
      kind="action"
      onClick={() => setActiveDialog(<SelectEventsDialog />)}
      icon="lib_openclose_add_circle_outline"
    >
      Select Events
    </Button>
  );
}

function SelectEventsDialog() {
  return (
    <Dialog header="Select Events" onClose={close}>
      This is not implemented yet. Coming soon.
    </Dialog>
  );
}
