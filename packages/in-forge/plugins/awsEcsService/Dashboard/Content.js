/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function AwsEcsServiceDashboard() {
  return (
    <DashboardNotification type="info">
      <h3>{t('in-forge:plugins.awsEcsService.titleUnderConstruction')}</h3>
      {t('in-forge:plugins.awsEcsService.descriptionUnderConstruction')}
    </DashboardNotification>
  );
}
