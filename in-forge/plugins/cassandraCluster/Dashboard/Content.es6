import React from 'react';

import {
  muSecondsToMillisZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import ClusterSummary from 'in-forge/plugins/cassandraCluster/ClusterSummary';
import KeyspacesTable from 'in-forge/plugins/cassandraCluster/Dashboard/KeyspacesTable.es6';
import ClusterNodesTable from 'in-forge/plugins/cassandraCluster/Dashboard/ClusterNodesTable.es6';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {capitalize} from 'in-services/formatters/string';


export default function CassandraClusterDashboard({snapshot, timeframe}) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot}/>

      <DashboardSection title='Overall Requests'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'clientrequests.read.count',
                             'clientrequests.write.count'
                           ],
                           labels: [
                             'Read',
                             'Write'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>

      {['read', 'write'].map(op =>
          <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies Average'}
                            key={op}>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             margins={{
                              left: 80
                             }}
                             y1={{
                             min: 0,
                             formatter: muSecondsToMillisZeroDecimalPlaces,
                             metrics: [
                               'clientrequests.' + op + '.mean',
                               'clientrequests.' + op + '.50',
                               'clientrequests.' + op + '.95',
                               'clientrequests.' + op + '.99'
                             ],
                             labels: [
                               'Mean',
                               '50th Percentile',
                               '95th Percentile',
                               '99th Percentile'
                             ],
                             type: 'line'
                           }}/>
          </DashboardSection>
      )}

      <DashboardSection title='Overall Disk Size'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           formatter: bytesZeroDecimalPlaces,
                           metrics: [
                             'overallDiskSize'
                           ],
                           labels: [
                             'Overall Disk Size'
                           ],
                           type: 'line'
                         }}/>
      </DashboardSection>
      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')}
                         timeframe={timeframe} />

      <KeyspacesTable snapshot={snapshot}
                    timeframe={timeframe} />
    </div>
  );
}
