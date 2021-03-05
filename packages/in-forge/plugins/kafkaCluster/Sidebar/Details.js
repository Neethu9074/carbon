/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { number, ms } from 'in-services/formatters/number';
import Info from '../Info';

export default function KafkaClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.kafkaCluster.kafkaCluster')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'broker.messagesIn',
            label: t('in-forge:plugins.kafkaCluster.brokersMsgIn'),
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'broker.partitionCount',
            label: t('in-forge:plugins.kafkaCluster.brokersPartitions'),
            formatter: number,
            aggregation: 'mean'
          },
          {
            metric: 'broker.totalTimeProduce',
            label: t('in-forge:plugins.kafkaCluster.prodLatency'),
            formatter: ms,
            aggregation: 'mean'
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
