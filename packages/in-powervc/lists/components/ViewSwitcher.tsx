/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function PowervcViewSwitcher() {
  return (
    <>
      <DashboardHeader
        icon="lib_powervc"
        label={t('in-powervc:powervcRegions')}
        title={t('in-powervc:powervcRegions')}
      />
      <DashboardHeaderShadowModule />
    </>
  );
}
