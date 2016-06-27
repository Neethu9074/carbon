import React from 'react';

import {KpiSummary, KpiHeading, KpiKeyValue} from 'in-components/KpiSummary';

export default function ClusterSummary({snapshot}) {
  const data = snapshot.get('data');
  return (
    <KpiSummary>
      <KpiHeading>{data.get('groupId')}</KpiHeading>
      <KpiKeyValue label='Nodes'>{data.get('nodeCount')}</KpiKeyValue>
    </KpiSummary>
  );
}
