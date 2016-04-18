import {combineLatest} from 'reactive-observables';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import HealthInfoBar from 'in-components/HealthInfoBar';
import {emptyList} from 'in-services/fixedImmutables';
import {timeframeShape} from 'in-stores/timeline';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';


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
            <th>Health</th>
            <th>Name</th>
            <th>Master Status</th>
            <th>Version</th>
            <th>Type</th>
            <th>Nr. of Indices</th>
            <th>Nr. of Shards</th>
            <th>Nr. of documents</th>
            <th>Size of Store</th>
          </tr>
        </thead>
        <tbody>
          {clusterNodes.map(node => {
            const data = node.get('data');
            const nodeId = node.get('id');
            return (
              <tr key={node.get('id')}>
                <td>
                  <HealthInfoBar snapshotId={nodeId} />
                </td>
                <td>{data.get('node.name')}</td>
                <td>{data.get('node.master')}</td>
                <td>{data.get('version')}</td>
                <td>{data.get('node.type')}</td>
                <td>
                  <HistoricMetricSparkChart width={200}
                                            height={30}
                                            timeframe={timeframe}
                                            snapshotId={nodeId}
                                            metric='indices.index_count' />
                </td>
                <td>
                  TODO
                </td>
                <td>
                  <HistoricMetricSparkChart width={200}
                                            height={30}
                                            timeframe={timeframe}
                                            snapshotId={nodeId}
                                            metric='indices.document_count' />
                </td>
                <Mtd metric={'size'}
                     snapshot={node} />
              </tr>
            );
          })}
        </tbody>
      </ResponsiveTable>
    );
  }
);

export default ClusterNodesTable;

ClusterNodesTable.PropTypes = {
  clusterSnapshotId: rpt.string.isRequired,
  timeframe: timeframeShape.isRequired,
  clusterNodes: rpt.array.isRequired
};
