/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function UnmonitoredHostDashboard() {
  return (
    <DashboardNotification type="info">{t('in-forge:plugins.unmonitoredHost.infoNoEntityInfo')}</DashboardNotification>
  );
}
