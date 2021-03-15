/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { withSiPrefixZeroDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.elasticsearchCluster.nodes')}>
        <MetricValue snapshotId={snapshotId} metric="node_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchCluster.indices')}>
        <MetricValue snapshotId={snapshotId} metric="indices_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchCluster.activeShards')}>
        <MetricValue snapshotId={snapshotId} metric="active_shards_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchCluster.documents')}>
        <MetricValue snapshotId={snapshotId} metric="document_count" formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchCluster.storeSize')}>
        <MetricValue snapshotId={snapshotId} metric="store_size" formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
