import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';

export default function ConfirmationDialog(
  {
    header,
    description,
    onClose = close,
    aButtonLabel = 'Cancel',
    onA = close,
    aButtonKind = 'secondary',
    bButtonLabel,
    onB = close,
    bButtonKind = 'danger'
  }
) {
  return (
    <Dialog header={header} onClose={onClose}>
      <p>
        {description}
      </p>

      <div>
        <Button kind={aButtonKind} onClick={onA} autoFocus>
          {aButtonLabel}
        </Button>
        {' '}
        <Button kind={bButtonKind} onClick={onB}>
          {bButtonLabel}
        </Button>
      </div>
    </Dialog>
  );
}
