/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { SubtraceConfigForm } from 'in-applications/Forms/SubtraceConfiguration/SubtraceConfigForm';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';

export default function CreateSubtraceDialog() {
  return (
    <Dialog
      title={t('in-applications:subtraces.newSubtrace')}
      titleIconType="lib_openclose_add_box"
      onClose={close}
      withoutBodyPadding
    >
      <SubtraceConfigForm />
    </Dialog>
  );
}
