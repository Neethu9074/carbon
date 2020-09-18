import React from 'react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button';

export default {
  title: 'Molecules/Dialogs/Behaviour',
  component: Dialog
};

export function MultipleDialogs() {
  return (
    <>
      <DialogPresenter />
      <Button onClick={() => addActiveDialog(<FirstDialog />)}>Open first dialog</Button>
    </>
  );
}

function FirstDialog() {
  return (
    <Dialog title="First Dialog" onClose={close}>
      <Button onClick={() => addActiveDialog(<SecondDialog />)}>Open second dialog</Button>
    </Dialog>
  );
}

function SecondDialog() {
  return (
    <Dialog title="Second Dialog" onClose={close}>
      <Button onClick={() => addActiveDialog(<ThirdDialog />)}>Open third dialog</Button>
    </Dialog>
  );
}

function ThirdDialog() {
  return (
    <Dialog title="Third Dialog" onClose={close}>
      nice to see you
    </Dialog>
  );
}
