/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function NutanixViewSwitcher() {
  return (
    <>
      <DashboardHeader icon="lib_nutanix" label={t('in-nutanix:nutanix')} title={t('in-nutanix:nutanix')} />
      <DashboardHeaderShadowModule />
    </>
  );
}
