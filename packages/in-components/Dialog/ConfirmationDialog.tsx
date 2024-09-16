/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';
import { Item } from 'formalistic';

import { ButtonKinds } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import SaveButton from 'in-components/form/SaveButton';
import { Error } from 'in-types';
import { t } from 'in-i18n';

import locals from './commonDialog.mless';

export interface Props {
  header: string | ReactElement;
  headerIcon?: string;
  description?: string | ReactElement;
  confirmButtonLabel?: string;
  secondaryButtonLabel?: string;
  confirmButtonKind?: keyof typeof ButtonKinds;
  onSubmit: () => void;
  field?: Item;
  isSaving?: boolean;
  errors?: Error[];
  /** if true, adds the autoFocus attribute on the Button element, this should only be used here, while no form input field exists. */
  confirmButtonAutoFocus?: boolean;
  onClose?: () => void;
}

export default function ConfirmationDialog({
  header,
  headerIcon,
  description,
  confirmButtonLabel = t('in-components:dialog.confirmationDialogLabelConfirm'),
  confirmButtonKind = 'danger',
  onSubmit,
  field,
  isSaving,
  errors,
  secondaryButtonLabel = t('in-components:dialog.secondaryDialogLabelCancel'),
  confirmButtonAutoFocus,
  onClose = close
}: Props) {
  const customButtons = (
    <>
      <CancelButton onClick={onClose} isSaving={isSaving}>
        {secondaryButtonLabel}
      </CancelButton>

      <SaveButton form={field} isSaving={isSaving} kind={confirmButtonKind} autoFocus={confirmButtonAutoFocus}>
        {confirmButtonLabel}
      </SaveButton>
    </>
  );
  return (
    <BaseDialog
      title={header}
      headerIcon={headerIcon}
      onClose={onClose}
      onSubmit={onSubmit}
      customButtons={customButtons}
    >
      <ErroneousResultPresenter errors={errors} addBottomMargin />

      {description && <p className={locals.description}>{description}</p>}
    </BaseDialog>
  );
}
