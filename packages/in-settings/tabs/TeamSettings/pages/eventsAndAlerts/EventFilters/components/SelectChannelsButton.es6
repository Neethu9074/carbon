import React from 'react';

import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import Dialog from 'in-components/Dialog';

import locals from './SelectChannelsButton.mless';

export default function NewChannelButton() {
  return (
    <Button
      className={locals.selectButton}
      kind="action"
      onClick={() => setActiveDialog(<NewChannelDialog />)}
      icon="lib_openclose_add_circle_outline"
    >
      Select Events
    </Button>
  );
}

function NewChannelDialog() {
  return (
    <Dialog header="Select Alert Channels" onClose={close}>
      This is not implemented yet. Coming soon.
    </Dialog>
  );
}
