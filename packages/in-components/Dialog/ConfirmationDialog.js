import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button';

import locals from './ConfirmationDialog.mless';

export default function ConfirmationDialog({
  header,
  description,
  children,
  onClose = close,
  aButtonLabel = 'Cancel',
  onA = close,
  aButtonKind = 'secondary',
  bButtonLabel,
  onB = close,
  bButtonKind = 'danger',
  bButtonIcon
}) {
  return (
    <Dialog className={locals.content} title={header} onClose={onClose}>
      <p>{description}</p>

      {children}

      <div className={locals.footer}>
        <Button kind={aButtonKind} onClick={onA} autoFocus>
          {aButtonLabel}
        </Button>

        <Button kind={bButtonKind} onClick={onB} icon={bButtonIcon}>
          {bButtonLabel}
        </Button>
      </div>
    </Dialog>
  );
}
