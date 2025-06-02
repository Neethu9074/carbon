/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function LinuxKVMHypervisorViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_linux"
        label={t('in-linuxkvmhypervisor:linuxkvmhypervisor')}
        title={t('in-linuxkvmhypervisor:linuxkvmhypervisor')}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
