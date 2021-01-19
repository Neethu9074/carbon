/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  muSecondsToMillisTwoDecimalPlaces,
  muSecondsToMillisZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  twoDecimalPlaces,
  number
} from 'in-services/formatters/number';
import KeyspacesTable from 'in-forge/plugins/cassandraNode/Dashboard/KeyspacesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { capitalize } from 'in-services/formatters/string';
import MetricValue from 'in-components/MetricValue';

export default function CassandraDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Read Requests">
          <MetricValue snapshotId={snapshotId} metric="clientrequests.read.count" />
        </KpiKeyValue>
        <KpiKeyValue label="Read Latency">
          <MetricValue
            snapshotId={snapshotId}
            metric="clientrequests.read.mean"
            formatter={muSecondsToMillisZeroDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label="Write Requests">
          <MetricValue snapshotId={snapshotId} metric="clientrequests.write.count" />
        </KpiKeyValue>
        <KpiKeyValue label="Write Latency">
          <MetricValue
            snapshotId={snapshotId}
            metric="clientrequests.write.mean"
            formatter={muSecondsToMillisZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['clientrequests.read.count'],
            labels: ['Reads'],
            type: 'line',
            formatter: number.detailed
          }}
          y2={{
            min: 0,
            metrics: ['clientrequests.write.count'],
            labels: ['Writes'],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {['read', 'write'].map(op => (
        <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies'} key={op}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: muSecondsToMillisTwoDecimalPlaces,
              metrics: [
                'clientrequests.' + op + '.mean',
                'clientrequests.' + op + '.50',
                'clientrequests.' + op + '.95',
                'clientrequests.' + op + '.99'
              ],
              labels: ['Mean', '50th Percentile', '95th Percentile', '99th Percentile'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ))}

      {['pending', 'blocked'].map(stage => (
        <DashboardSection title={capitalize(stage) + ' Requests in Threadpools (Stages)'} key={stage}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'stage.mutation.' + stage,
                'stage.read.' + stage,
                'stage.countermutation.' + stage,
                'stage.readrepair.' + stage,
                'stage.requestresponse.' + stage,
                'stage.memtableflushwriter.' + stage
              ],
              labels: [
                'Write (Mutation)',
                'Read',
                'Counter Mutation',
                'Read Repair',
                'Request/Response',
                'Memtable Flushwriter'
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ))}

      <DashboardSection title="Dropped Messages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'dropped.MUTATION',
              'dropped.READ',
              'dropped.COUNTER_MUTATION',
              'dropped.READ_REPAIR',
              'dropped.REQUEST_RESPONSE'
            ],
            labels: ['Write (Mutation)', 'Read', 'Counter Mutation', 'Read Repair', 'Request/Response'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <KeyspacesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title="Pending Compactions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['compaction.pending'],
            labels: ['Compactions'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Cache Hits">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['cache.counter.hit', 'cache.key.hit', 'cache.row.hit'],
            labels: ['Counter', 'Key', 'Row'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Bloom Filter">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['bloomFilterFalse'],
            labels: ['Miss Rate'],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
