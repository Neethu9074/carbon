/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { withSiPrefixZeroDecimalPlaces, number, bytes } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.clickhouseCluster.dashboard.labelNodes')}>
        <MetricValue snapshotId={snapshotId} metric="nodeCount" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.clickhouseCluster.dashboard.labelRows')}>
        <MetricValue snapshotId={snapshotId} metric="rows" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.clickhouseCluster.dashboard.labelTotalDiskUsage')}>
        <MetricValue snapshotId={snapshotId} metric="bytes_on_disk" formatter={bytes.detailed} />
      </KpiKeyValue>
    </KpiSection>
  );
}
