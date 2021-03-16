/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.cockroachDBNode.labelSQLConnections')}>
        <MetricValue snapshotId={snapshotId} metric="sql.conns" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBNode.labelSQLReads')}>
        <MetricValue snapshotId={snapshotId} metric="sql.select.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBNode.labelSQLWrites')}>
        <MetricValue snapshotId={snapshotId} metric="sql.write.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBNode.labelTotalRanges')}>
        <MetricValue snapshotId={snapshotId} metric="ranges.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBNode.labelUnderreplicatedRanges')}>
        <MetricValue snapshotId={snapshotId} metric="ranges.underreplicated.total" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.cockroachDBNode.labelUnavailableRanges')}>
        <MetricValue snapshotId={snapshotId} metric="ranges.unavailable.total" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
