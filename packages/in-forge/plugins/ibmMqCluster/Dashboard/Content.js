import React from 'react';

import QueueManagersTable from 'in-forge/plugins/ibmMqCluster/Dashboard/QueueManagersTable';
import ListenersTable from 'in-forge/plugins/ibmMqCluster/Dashboard/ListenersTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import TopicsTable from 'in-forge/plugins/ibmMqCluster/Dashboard/TopicsTable';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function IbmMqClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Messages In">
          <MetricValue snapshotId={snapshotId} metric="messagesIn" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Messages Out">
          <MetricValue snapshotId={snapshotId} metric="messagesOut" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <QueueManagersTable snapshot={snapshot} timeConfig={timeConfig} />
      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ListenersTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
