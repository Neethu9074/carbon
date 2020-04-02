import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import Actions from 'in-new-components/BigHeaderDialog/Actions';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import SaveButton from 'in-components/form/SaveButton';

import locals from './commonDialog.mless';

export default function ConfirmationDialog({
  header,
  headerIcon,
  description,
  confirmButtonLabel = 'Confirm',
  onSubmit,
  field,
  isSaving,
  errors,
  onClose = close
}) {
  return (
    <BigHeaderDialog className={locals.dialog} titleIconType={headerIcon} title={header} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ErroneousResultPresenter errors={errors} addBottomMargin />

        {description && <p className={locals.description}>{description}</p>}

        <Actions>
          <CancelButton onClick={close} isSaving={isSaving} autoFocus />
          <SaveButton form={field} isSaving={isSaving} kind="danger">
            {confirmButtonLabel}
          </SaveButton>
        </Actions>
      </form>
    </BigHeaderDialog>
  );
}
