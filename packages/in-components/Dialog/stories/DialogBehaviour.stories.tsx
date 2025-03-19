/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import Dialog from 'in-components/Dialog/Dialog';

import locals from './DialogBehaviour.mless';

export default {
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
