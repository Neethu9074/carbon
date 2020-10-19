import React from 'react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button';

import locals from './DialogBehaviour.mless';

export default {
  title: 'Molecules|Dialogs/Behaviour',
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
      <div className={locals.first}>
        <Button onClick={() => addActiveDialog(<SecondDialog />)}>Open second dialog</Button>
      </div>
    </Dialog>
  );
}

function SecondDialog() {
  return (
    <Dialog title="Second Dialog" onClose={close}>
      <div className={locals.second}>
        <Button onClick={() => addActiveDialog(<ThirdDialog />)}>Open third dialog</Button>
      </div>
    </Dialog>
  );
}

function ThirdDialog() {
  return (
    <Dialog title="Third Dialog" onClose={close}>
      <div className={locals.third}>nice to see you</div>
    </Dialog>
  );
}
