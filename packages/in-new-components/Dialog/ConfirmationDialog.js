/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import Actions from 'in-new-components/Dialog/Actions';
import SaveButton from 'in-components/form/SaveButton';
import Dialog from 'in-new-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './commonDialog.mless';

export default function ConfirmationDialog({
  header,
  headerIcon,
  description,
  confirmButtonLabel = t('in-components:dialog.confirmationDialogLabelConfirm'),
  onSubmit,
  field,
  isSaving,
  errors,
  onClose = close
}) {
  return (
    <Dialog className={locals.dialog} titleIconType={headerIcon} title={header} onClose={onClose}>
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
    </Dialog>
  );
}
