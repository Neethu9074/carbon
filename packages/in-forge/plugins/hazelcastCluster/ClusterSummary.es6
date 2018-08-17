import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function ClusterSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiHeading>{snapshot.getIn(['label'])}</KpiHeading>

      <KpiKeyValue label="Is Cluster Safe">{yesOrNo(snapshot.getIn(['data', 'isClusterSafe']))}</KpiKeyValue>
    </KpiSection>
  );
}
