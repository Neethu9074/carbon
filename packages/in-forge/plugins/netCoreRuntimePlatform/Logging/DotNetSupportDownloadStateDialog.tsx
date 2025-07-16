/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './DotNetSupportDownloadStateDialog.mless';

export function DotNetSupportDownloadStateDialog() {
  return (
    <Dialog
      title={t('in-forge:plugins.instanaAgent.dashboard.dotNetCollectSupportInformation')}
      onClose={close}
      className={locals.dialog}
    />
  );
}
