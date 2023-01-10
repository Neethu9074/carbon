/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import ItemsTable from 'in-forge/plugins/ibmMqMftTransfer/Dashboard/ItemsTable';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqMftTransferDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftTransfer.dashboard.bytesSent')}>
          <MetricValue snapshotId={snapshotId} metric="bytesSent" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <ItemsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
