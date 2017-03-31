import { combineLatest } from 'reactive-observables';
import React from 'react';

import HistoricMetricSparkChartWithLabel from 'in-charts/SparkChart/HistoricMetricSparkChartWithLabel';
import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import ExpandableTable from 'in-components/ExpandableTable';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ClusterNodesTable({ clusterNodes, timeframe }) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    return (
      <DashboardSection title="Cluster Nodes">
        <ExpandableTable
          data={clusterNodes}
          getKey={getKey}
          createHeader={createHeader}
          createRow={createRow}
          context={{
            timeframe
          }}
        />
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
        <th>Name</th>
        <th>Version</th>
        <th>Nr. of Keyspaces</th>
        <th>Size of Store</th>
      </tr>
    </thead>
  );
}

function createRow(node, i, context) {
  const id = node.get('id');

  return [
    <td><AnnotatedHealthBar snapshotId={id} /></td>,
    <td>
      <HierarchicalLink snapshotId={id} calculateHierarchy kind="dark">
        {node.getIn(['data', 'clusterName'])}-{node.getIn(['data', 'hostId'])}
      </HierarchicalLink>
    </td>,
    <td>{node.getIn(['data', 'version'])}</td>,
    <td>
      <HistoricMetricSparkChartWithLabel
        width={200}
        height={30}
        timeframe={context.timeframe}
        snapshotId={id}
        metric="keyspaceCount"
        formatter={zeroDecimalPlaces}
      />
    </td>,
    <Mtd metric={'overallDiskSize'} snapshot={node} formatter={bytesTwoDecimalPlaces} />
  ];
}
