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
import SaveButton from 'in-components/form/SaveButton';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { Error } from 'in-types';
import { t } from 'in-i18n';

import locals from './commonDialog.mless';

export interface Props {
  header: string | ReactElement;
  headerIcon?: string;
  description?: string | ReactElement;
  confirmButtonLabel?: string;
  confirmButtonKind?: keyof typeof ButtonKinds;
  onSubmit: () => void;
  field?: Item;
  isSaving?: boolean;
  errors?: Error[];
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
  onClose = close
}: Props) {
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
          {/* @ts-expect-error There seems to be a typescript issue with ts4.4.4 here. The prop is available and later ts versions don't fail on it*/}
          <CancelButton onClick={onClose} isSaving={isSaving} autoFocus />
          <SaveButton form={field} isSaving={isSaving} kind={confirmButtonKind}>
            {confirmButtonLabel}
          </SaveButton>
        </Actions>
      </form>
    </Dialog>
  );
}
