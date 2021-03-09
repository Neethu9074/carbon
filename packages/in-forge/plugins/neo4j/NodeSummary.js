/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { hitRate, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

import isAtLeastMinorVersion from './Neo4jVersion.js';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const version = snapshot.getIn(['data', 'version']);
  const hasTransactions = isAtLeastMinorVersion(version, 3, 3);

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.neo4j.usageRatio')}>
        <MetricValue snapshotId={snapshotId} metric="pageCache.usageRatio" formatter={hitRate.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.neo4j.hitRatio')}>
        <MetricValue snapshotId={snapshotId} metric="pageCache.hitRatio" formatter={hitRate.detailed} />
      </KpiKeyValue>

      {hasTransactions && (
        <KpiKeyValue label={t('in-forge:plugins.neo4j.lastTransactionId')}>
          <MetricValue snapshotId={snapshotId} metric="transactions.lastCommittedTxId" />
        </KpiKeyValue>
      )}

      {hasTransactions && (
        <KpiKeyValue label={t('in-forge:plugins.neo4j.peakConcurrentTransactions')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="transactions.peakConcurrentTransactions"
            formatter={number.compact}
          />
        </KpiKeyValue>
      )}
    </KpiSection>
  );
}
