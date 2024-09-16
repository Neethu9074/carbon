/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { Props } from 'in-components/Dialog/Dialog';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ConfigDialog.mless';

interface ConfigDialogProps extends Pick<Props, 'title' | 'onClose'> {
  isSaving?: boolean;
  saveDisabled?: boolean;
  onSave: VoidFunction;
}

export default function ConfigDialog({
  children,
  title,
  isSaving,
  saveDisabled,
  onClose,
  onSave
}: React.PropsWithChildren<ConfigDialogProps>) {
  return (
    <Dialog title={title} onClose={onClose} withoutBodyPadding showOverflow>
      <div role="form" className={locals.dialogBody}>
        {children}
      </div>
      <FormFooter className={locals.formFooter}>
        <CancelButton onClick={onClose}>{t('in-service-levels:general.cancelButtonLabel')}</CancelButton>
        <SaveButton onClick={onSave} isSaving={isSaving} disabled={saveDisabled}>
          {t('in-service-levels:general.saveButtonLabel')}
        </SaveButton>
      </FormFooter>
    </Dialog>
  );
}
