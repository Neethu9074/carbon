/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { withSiPrefixZeroDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.elasticsearchNode.indices')}>
        <MetricValue snapshotId={snapshotId} metric="indices_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchNode.activeShards')}>
        <MetricValue
          snapshotId={snapshotId}
          metric="shards.node_active_shards"
          formatter={withSiPrefixZeroDecimalPlaces}
        />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchNode.documents')}>
        <MetricValue
          snapshotId={snapshotId}
          metric="indices.document_count"
          formatter={withSiPrefixThreeDecimalPlaces}
        />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.elasticsearchNode.storeSize')}>
        <MetricValue snapshotId={snapshotId} metric="indices.store_size" formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
