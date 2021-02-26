/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { withSiPrefixZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.cassandraCluster.labelAvailableNodes')}>
        <MetricValue snapshotId={snapshotId} metric="nodeCount" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.cassandraCluster.labelUnreachableNodes')}>
        <MetricValue snapshotId={snapshotId} metric="unreachableNodeCount" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.cassandraCluster.labelKeyspaces')}>
        <MetricValue snapshotId={snapshotId} metric="keyspaceCount" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.cassandraCluster.labelStoreSize')}>
        <MetricValue snapshotId={snapshotId} metric="overallDiskSize" formatter={bytesTwoDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
