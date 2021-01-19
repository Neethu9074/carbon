/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';

export default function ClusterSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiKeyValue label="Nodes">{snapshot.getIn(['data', 'nodeCount'])}</KpiKeyValue>

      <KpiKeyValue label="Collections">{snapshot.getIn(['data', 'collectionCount'])}</KpiKeyValue>

      <KpiKeyValue label="Shards">{snapshot.getIn(['data', 'shardCount'])}</KpiKeyValue>
    </KpiSection>
  );
}
