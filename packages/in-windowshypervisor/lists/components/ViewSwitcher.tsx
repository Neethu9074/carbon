/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function WindowsHypervisorViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_windows"
        label={t('in-windowshypervisor:windowshypervisor')}
        title={t('in-windowshypervisor:windowshypervisor')}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
