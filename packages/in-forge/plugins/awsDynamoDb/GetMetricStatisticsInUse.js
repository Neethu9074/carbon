/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { t } from 'in-i18n';

export default function GetMetricStatisticsInUse({ snapshot }) {
  return (
    <div>
      {snapshot.getIn(['data', 'legacy_endpoint_used'], false) && (
        <DashboardNotification type="info">
          {t('in-forge:plugins.awsDynamoDb.notificationGetMetricStatistics')}
        </DashboardNotification>
      )}
    </div>
  );
}
