/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';

export default function EditConfigDialog({ title, content }) {
  return (
    <Dialog title={title} onClose={close}>
      {content}
    </Dialog>
  );
}
