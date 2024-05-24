/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, percentage } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function KafkaConnectTaskDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kafkaConnectTask.partitionCount')}>
          <MetricValue snapshotId={snapshotId} metric="partitionCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kafkaConnectTask.runningRatio')}>
          <MetricValue snapshotId={snapshotId} metric="runningRatio" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kafkaConnectTask.pauseRatio')}>
          <MetricValue snapshotId={snapshotId} metric="pauseRatio" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
