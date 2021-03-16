/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { t } from 'in-i18n';

export default function ClusterSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.solrCloudCluster.nodes')}>
        {snapshot.getIn(['data', 'nodeCount'])}
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.solrCloudCluster.collections')}>
        {snapshot.getIn(['data', 'collectionCount'])}
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.solrCloudCluster.shards')}>
        {snapshot.getIn(['data', 'shardCount'])}
      </KpiKeyValue>
    </KpiSection>
  );
}
