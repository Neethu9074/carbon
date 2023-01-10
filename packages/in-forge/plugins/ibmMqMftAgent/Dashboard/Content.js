/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import DestinationTransferStatesTable from 'in-forge/plugins/ibmMqMftAgent/Dashboard/SourceTransferStatesTable';
import SourceTransferStatesTable from 'in-forge/plugins/ibmMqMftAgent/Dashboard/DestinationTransferStatesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqMftAgentDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftAgent.dashboard.runningTransfers')}>
          <MetricValue snapshotId={snapshotId} metric="runningTransfers" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftAgent.dashboard.totalCurrentTransfers')}>
          <MetricValue snapshotId={snapshotId} metric="totalCurrentTransfers" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <SourceTransferStatesTable snapshot={snapshot} />
      <DestinationTransferStatesTable snapshot={snapshot} />
    </div>
  );
}
