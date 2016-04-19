import {combineLatest} from 'reactive-observables';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const rpt = React.PropTypes;


const ClusterNodesTable = connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptyList)
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(getSnapshot)))
        .throttle(1000)
    };
  }, function ClusterNodesTable({clusterNodes, timeframe}) {
    return (
      <ResponsiveTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Nr. of Indices</th>
            <th>Nr. of active shards</th>
            <th>Nr. of documents</th>
          </tr>
        </thead>
        <tbody>
          {clusterNodes.map(node =>
            <tr key={node.get('id')}>
              <td>{node.getIn(['data', 'node.name'])}</td>
              <td>
                <HistoricMetricSparkChart width={200}
                                          height={30}
                                          timeframe={timeframe}
                                          snapshotId={node.get('id')}
                                          metric='indices.index_count' />
              </td>
              <td>
                TODO
              </td>
              <td>
                <HistoricMetricSparkChart width={200}
                                          height={30}
                                          timeframe={timeframe}
                                          snapshotId={node.get('id')}
                                          metric='indices.document_count' />
              </td>
            </tr>
          )}
        </tbody>
      </ResponsiveTable>
    );
  }
);

export default ClusterNodesTable;

ClusterNodesTable.PropTypes = {
  clusterSnapshotId: rpt.string.isRequired,
  clusterNodes: rpt.array.isRequired,
  timeframe: timeframeShape.isRequired
};
