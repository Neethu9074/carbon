/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SupportLogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/SupportLogStreamer';
import { close } from 'in-components/DialogPresenter/store';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './SupportDownloadStateDialog.mless';

export function SupportDownloadStateDialog({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <Dialog
      title={t('in-forge:plugins.instanaAgent.dashboard.collectSupportInformation')}
      onClose={close}
      className={locals.dialog}
    >
      <SupportLogStreamer snapshot={snapshot} />
    </Dialog>
  );
}
