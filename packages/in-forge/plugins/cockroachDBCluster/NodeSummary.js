/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.cockroachDBCluster.labelSQLConnections')}>
        <MetricValue snapshotId={snapshotId} metric="sql.conns" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBCluster.labelSQLReads')}>
        <MetricValue snapshotId={snapshotId} metric="sql.select.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBCluster.labelSQLWrites')}>
        <MetricValue snapshotId={snapshotId} metric="sql.write.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBCluster.labelTotalRanges')}>
        <MetricValue snapshotId={snapshotId} metric="ranges.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBCluster.labelUnderreplicatedRanges')}>
        <MetricValue snapshotId={snapshotId} metric="ranges.underreplicated.total" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBCluster.labelUnavailableRanges')}>
        <MetricValue snapshotId={snapshotId} metric="ranges.unavailable.total" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
