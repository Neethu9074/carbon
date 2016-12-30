import {combineLatest} from 'reactive-observables';
import React from 'react';

import HistoricMetricSparkChartWithLabel from 'in-charts/SparkChart/HistoricMetricSparkChartWithLabel';
import {
  zeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import ExpandableTable from 'in-components/ExpandableTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  }, function ClusterNodesTable({clusterNodes, timeframe}) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    return (
      <DashboardSection title='Cluster Nodes'>
        <ExpandableTable data={clusterNodes}
                         getKey={getKey}
                         createHeader={createHeader}
                         createRow={createRow}
                         context={{
                           timeframe
                         }} />
      </DashboardSection>
    );
  }
);


function getKey(node) {
  return node.get('id');
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Health</th>
        <th>Pid</th>
        <th>Version</th>
        <th>Messages In</th>
        <th>Network Processor</th>
        <th>Request Handler</th>
      </tr>
    </thead>
  );
}


function createRow(node, i, context) {
  const id = node.get('id');

  return [
    <td><AnnotatedHealthBar snapshotId={id} /></td>,
    <td>
      <SnapshotLink snapshotId={id}>
        {node.getIn(['data', 'pid'])}
      </SnapshotLink>
    </td>,
    <td>{node.getIn(['data', 'version'])}</td>,
    <td>
      <HistoricMetricSparkChartWithLabel width={200}
                                         height={30}
                                         timeframe={context.timeframe}
                                         snapshotId={id}
                                         metric='broker.messagesIn'
                                         formatter={zeroDecimalPlaces} />
    </td>,
    <td>
      <HistoricMetricSparkChartWithLabel width={200}
                                         height={30}
                                         timeframe={context.timeframe}
                                         snapshotId={id}
                                         metric='broker.networkProcessorIdle'
                                         formatter={percentageZeroDecimalPlaces} />
    </td>,
    <td>
      <HistoricMetricSparkChartWithLabel width={200}
                                         height={30}
                                         timeframe={context.timeframe}
                                         snapshotId={id}
                                         metric='broker.requestHandlerIdle'
                                         formatter={percentageZeroDecimalPlaces} />
    </td>
  ];
}
