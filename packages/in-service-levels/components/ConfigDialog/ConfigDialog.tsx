/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { MessageType } from 'in-components/MessageStack/MessageStack';
import { NavItem } from 'in-components/SideNav/SideNav';
import { Props } from 'in-components/Dialog/Dialog';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ConfigDialog.mless';

interface ConfigDialogProps extends Pick<Props, 'title' | 'onClose'> {
  navItems: Array<NavItem>;
  messages?: MessageType[];
  noHeader?: boolean;
  noDivider?: boolean;
  isSaving?: boolean;
  saveDisabled?: boolean;
  onSave: VoidFunction;
}

export default function ConfigDialog({
  title,
  navItems,
  messages,
  noHeader,
  noDivider,
  isSaving,
  saveDisabled,
  onClose,
  onSave
}: ConfigDialogProps) {
  return (
    <Dialog title={title} onClose={onClose} withoutBodyPadding showOverflow>
      <div role="form" className={locals.dialogBody}>
        <StepsContainer messages={messages} navItems={navItems} noHeader={noHeader} noDivider={noDivider} />
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
