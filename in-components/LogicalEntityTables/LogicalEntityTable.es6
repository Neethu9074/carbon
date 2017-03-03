import React from 'react';

import {
  percentageTwoDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import HistoricMetricSparkChartWithLabel from 'in-charts/SparkChart/HistoricMetricSparkChartWithLabel';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import ExpandableTable from 'in-components/ExpandableTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    nodes: props.dataStream
  };
}, function LogicalEntityTable({nodes, title, timeframe, createDetails}) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={title}>
      <ExpandableTable data={nodes}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         timeframe
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
});


function getKey(node) {
  return node.get('id');
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th width='102px'>Health</th>
        <th>Name</th>
        <th>Host</th>
        <th width='230px'>Calls/s</th>
        <th width='230px'>Latency</th>
        <th width='230px'>Error Rate</th>
      </tr>
    </thead>
  );
}

function createRow(node, i, {timeframe}) {
  const id = node.get('id');
  return [
    <td>
      <AnnotatedHealthBar snapshotId={id} />
    </td>,
    <td>
      <HierarchicalLink snapshotId={id}
                        calculateHierarchy
                        kind='dark'>
        {getLabel(node)}
      </HierarchicalLink>
    </td>,
    <Host nodeSnapshot={node} />,
    <td>
      <HistoricMetricSparkChartWithLabel width={100}
                                         height={30}
                                         timeframe={timeframe}
                                         snapshotId={id}
                                         metric='count'
                                         formatter={zeroDecimalPlaces} />
    </td>,
    <td>
      <HistoricMetricSparkChartWithLabel width={100}
                                         height={30}
                                         timeframe={timeframe}
                                         snapshotId={id}
                                         metric='duration.mean'
                                         formatter={msTwoDecimalPlaces} />
    </td>,
    <td>
      <HistoricMetricSparkChartWithLabel width={100}
                                         height={30}
                                         timeframe={timeframe}
                                         snapshotId={id}
                                         metric='error_rate'
                                         formatter={percentageTwoDecimalPlaces} />
    </td>
  ];
}


const Host = connectTo(props => {
  const hostSnapshot$ = getHostSnapshotId(props.nodeSnapshot)
    .flatMap(hostSnapshotId => {
      if (hostSnapshotId) {
        return getSnapshot(hostSnapshotId);
      }

      // maybe we have logic instances for which we need to navigate the cluster members one level deeper
      return getClusterMembers(props.nodeSnapshot.get('id'))
        .map(clusterMembers => clusterMembers.first())
        .flatMap(clusterMemberId => {
          if (clusterMemberId) {
            return getSnapshot(clusterMemberId)
              .flatMap(clusterMember => getHostSnapshotId(clusterMember));
          }
          return alwaysNull;
        })
        .flatMap(hostSnapshotId => {
          if (hostSnapshotId) {
            return getSnapshot(hostSnapshotId);
          }
          return alwaysNull;
        });
    });
  return {
    hostSnapshot: hostSnapshot$
  };
}, function Host({hostSnapshot}) {
  return (
    <td>
      {hostSnapshot ?
        <HierarchicalLink snapshotId={hostSnapshot.get('id')}
                          calculateHierarchy
                          kind='dark'>
          {getLabel(hostSnapshot)}
        </HierarchicalLink>
     : null}
    </td>
  );
});
