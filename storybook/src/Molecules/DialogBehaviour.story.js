import React from 'react';

import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';

export default {
  title: 'Molecules|Dialogs/Behaviour',
  component: Dialog
};

export function MultipleDialogs() {
  return (
    <>
      <DialogPresenter />

      <Button onClick={() => setActiveDialog(<FirstDialog />)}>Open first dialog</Button>
    </>
  );
}

function FirstDialog() {
  return (
    <Dialog title="First Dialog" onClose={close}>
      <Button onClick={() => setActiveDialog(<SecondDialog />)}>Open second dialog</Button>
    </Dialog>
  );
}

function SecondDialog() {
  return (
    <Dialog title="Second Dialog" onClose={close}>
      <Button onClick={() => setActiveDialog(<ThirdDialog />)}>Open third dialog</Button>
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
