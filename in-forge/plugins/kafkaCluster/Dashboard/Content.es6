import React from 'react';

import {
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ClusterSummary from 'in-forge/plugins/kafkaCluster/ClusterSummary';
import ClusterNodesTable from 'in-forge/plugins/kafkaCluster/Dashboard/ClusterNodesTable.es6';

export default function KafkaClusterDashboard({snapshot, timeframe}) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title='Average Request Latency vs Throughput'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40,
                 right: 40
               }}
               y1={{
                 formatter: twoDecimalPlaces,
                 tooltipFormatter: twoDecimalPlaces,
                 metrics: [
                   'broker.produceRequests',
                   'broker.fetchConsumerRequests',
                   'broker.fetchFollowerRequests'
                 ],
                 labels: [
                   'Produce Throughput',
                   'Fetch Consumer Throughput',
                   'Fetch Follower Throughput'
                 ],
                 type: 'line'
               }}
               y2={{
                 formatter: msZeroDecimalPlaces,
                 tooltipFormatter: msTwoDecimalPlaces,
                 metrics: [
                   'broker.totalTimeProduce',
                   'broker.totalTimeFetchConsumer',
                   'broker.totalTimeFetchFollower'
                 ],
                 labels: [
                   'Produce Latency',
                   'Fetch Consumer Latency',
                   'Fetch Follower Latency'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Average Broker Traffic'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40
               }}
               y1={{
                 formatter: bytesTwoDecimalPlaces,
                 tooltipFormatter: bytesTwoDecimalPlaces,
                 metrics: [
                   'broker.bytesIn',
                   'broker.bytesOut',
                   'broker.bytesRejected'
                 ],
                 labels: [
                   'In',
                   'Out',
                   'Rejected'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Broker Failures'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40
               }}
               y1={{
                 formatter: twoDecimalPlaces,
                 tooltipFormatter: twoDecimalPlaces,
                 metrics: [
                   'broker.failedFetch',
                   'broker.failedProduce'
                 ],
                 labels: [
                   'Fetch',
                   'Produce'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Broker state metrics'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40
               }}
               y1={{
                 formatter: twoDecimalPlaces,
                 tooltipFormatter: twoDecimalPlaces,
                 metrics: [
                   'broker.underReplicatedPartitions',
                   'broker.offlinePartitionsCount',
                   'broker.leaderElections',
                   'broker.uncleanLeaderElections',
                   'broker.isrShrinks',
                   'broker.isrExpansions',
                   'broker.activeControllerCount'
                 ],
                 labels: [
                   'Under-replicated Partitions',
                   'Offline Partitions',
                   'Leader Elections',
                   'Unclean Leader Elections',
                   'ISR Shrinks',
                   'ISR Expansions',
                   'Active controller count'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Average Idle Time Percentage'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40
               }}
               y1={{
                 formatter: percentageZeroDecimalPlaces,
                 tooltipFormatter: percentageZeroDecimalPlaces,
                 metrics: [
                   'broker.networkProcessorIdle',
                   'broker.requestHandlerIdle'
                 ],
                 labels: [
                   'Network Processor',
                   'Request Handler'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Broker Messages In'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40
               }}
               y1={{
                 formatter: twoDecimalPlaces,
                 tooltipFormatter: twoDecimalPlaces,
                 metrics: [
                   'broker.messagesIn'
                 ],
                 labels: [
                   '#'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Log Flushing'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
               timeframe={timeframe}
               margins={{
                 left: 40,
                 right: 40
               }}
               y1={{
                 formatter: msTwoDecimalPlaces,
                 tooltipFormatter: msTwoDecimalPlaces,
                 metrics: [
                   'logflush.mean'
                 ],
                 labels: [
                   'Mean'
                 ],
                 type: 'line'
               }}
               y2={{
                 formatter: msZeroDecimalPlaces,
                 tooltipFormatter: msZeroDecimalPlaces,
                 metrics: [
                   'logflush.inv'
                 ],
                 labels: [
                   'Flushes'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>

      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')}
                         timeframe={timeframe} />

    </div>
  );
}
