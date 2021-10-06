/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { t } from 'in-i18n';

export default function AzureQueueDashboard() {
  return (
    <DashboardNotification type="info">
      {t('in-forge:plugins.azure.dashboard.thereIsNoFurtherInformationAboutThisEntity')}
    </DashboardNotification>
  );
}