/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function ClusterSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiKeyValue label="Is Cluster Safe">{yesOrNo(snapshot.getIn(['data', 'isClusterSafe']))}</KpiKeyValue>
    </KpiSection>
  );
}
