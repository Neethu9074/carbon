import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';

export default function ClusterSummary({snapshot}) {
  const data = snapshot.get('data');
  return (
    <KpiSection>
      <KpiHeading>{data.get('groupId')}</KpiHeading>
      <KpiKeyValue label='Nodes'>{data.get('nodeCount')}</KpiKeyValue>
    </KpiSection>
  );
}
