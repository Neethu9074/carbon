import React, { Fragment } from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Dialog from 'in-components/Dialog';

import locals from './ConfirmationDialog.mless';

export default function ConfirmationDialog({
  header,
  description,
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
    <Dialog
      customHeaderClassName={locals.customHeader}
      contentWrapperClassName={locals.contentWrapper}
      contentClassName={locals.content}
      customHeader={
        <Fragment>
          <h1 className={locals.title}>{header}</h1>
          <SvgIcon className={locals.cancelIcon} type="lib_openclose_cancel" size="l" onClick={() => close()} />
        </Fragment>
      }
      onClose={onClose}
    >
      <p>{description}</p>

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
