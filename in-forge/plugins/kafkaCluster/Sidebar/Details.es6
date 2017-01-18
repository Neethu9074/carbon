import React from 'react';

import {
  twoDecimalPlaces,
  msZeroDecimalPlaces } from 'in-services/formatters/number';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function KafkaClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kafka Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'broker.messagesIn',
                              label: 'All Brokers Messages In',
                              formatter: twoDecimalPlaces
                            }
                          ]} />
      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'broker.partitionCount',
                              label: 'All Brokers Partition Count',
                              formatter: twoDecimalPlaces
                            }
                          ]} />

      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'broker.totalTimeProduce',
                              label: 'Average Produce Latency',
                              formatter: msZeroDecimalPlaces
                            }
                          ]} />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
