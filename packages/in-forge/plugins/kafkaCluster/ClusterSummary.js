/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.kafkaCluster.allBrokersMessagesIn')}>
        <MetricValue snapshotId={snapshotId} metric="broker.messagesIn" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.kafkaCluster.rejectedTraffic')}>
        <MetricValue snapshotId={snapshotId} metric="broker.bytesRejected" formatter={bytesTwoDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.kafkaCluster.fetchConsumerLatency')}>
        <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchConsumer" formatter={msZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.kafkaCluster.fetchFollowerLatency')}>
        <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchFollower" formatter={msZeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
