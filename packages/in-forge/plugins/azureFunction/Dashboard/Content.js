/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { t } from 'in-i18n';

export default function AzureFunctionDashboard() {
  return (
    <DashboardNotification type="info">
      {t('in-forge:plugins.azure.dashboard.thereIsNoFurtherInformationAboutThisEntity')}
    </DashboardNotification>
  );
}
