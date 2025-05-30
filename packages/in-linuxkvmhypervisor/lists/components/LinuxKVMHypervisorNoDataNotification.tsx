/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function LinuxKVMHypervisorNoDataNotification() {
  return (
    <EntityPageMainNotification
      icon="lib_linux"
      title={t('in-linuxkvmhypervisor:noMonitoringDataFound')}
      explanation={noop}
    />
  );
}
