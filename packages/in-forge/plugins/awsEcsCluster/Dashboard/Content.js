/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function AwsEcsClusterDashboard() {
  return (
    <DashboardNotification type="info">
      <h3>{t('in-forge:plugins.awsEcsCluster.titleUnderConstruction')}</h3>
      {t('in-forge:plugins.awsEcsCluster.descriptionUnderConstruction')}
    </DashboardNotification>
  );
}
