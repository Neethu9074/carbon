import React from 'react';

import { yesOrNo } from 'in-services/formatters/boolean';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';

export default function NodeSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiHeading>{snapshot.getIn(['label'])}</KpiHeading>

      <KpiKeyValue label="Is Local Member Safe">{yesOrNo(snapshot.getIn(['data', 'isLocalMemberSafe']))}</KpiKeyValue>

      <KpiKeyValue label="Is Cluster Safe">{yesOrNo(snapshot.getIn(['data', 'isClusterSafe']))}</KpiKeyValue>
    </KpiSection>
  );
}
