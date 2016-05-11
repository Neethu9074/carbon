import {combineLatest} from 'reactive-observables';
import React from 'react';

import HistoricMetricSparkChartWithLabel from 'in-charts/SparkChart/HistoricMetricSparkChartWithLabel';
import {
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import HealthInfoBar from 'in-components/HealthInfoBar';
import SnapshotLink from 'in-components/SnapshotLink';
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
            <th>Nr. of Active Shards</th>
            <th>Nr. of documents</th>
            <th>Size of Store</th>
          </tr>
        </thead>
        <tbody>
          {clusterNodes == null ? null : clusterNodes.map(node => {
            const id = node.get('id');
            let masterStatus;
            if (node.getIn(['data', 'node.master']) === 'true') {
              masterStatus = 'elected Master';
            } else if (node.getIn(['data', 'node.master_eligible']) === 'true') {
              masterStatus = 'Master-eligible';
            } else {
              masterStatus = 'not Master-eligible';
            }

            return (
              <tr key={id}>
                <td><HealthInfoBar snapshotId={id} /></td>
                <td>
                  <SnapshotLink snapshotId={id}>
                    {node.getIn(['data', 'node.name'])}
                  </SnapshotLink>
                </td>
                <td>{masterStatus}</td>
                <td>{node.getIn(['data', 'version'])}</td>
                <td>{node.getIn(['data', 'node.type'])}</td>
                <td>
                  <HistoricMetricSparkChartWithLabel width={200}
                                                     height={30}
                                                     timeframe={timeframe}
                                                     snapshotId={id}
                                                     metric='indices_count'
                                                     formatter={zeroDecimalPlaces} />
                </td>
                <td>
                  <HistoricMetricSparkChartWithLabel width={200}
                                                     height={30}
                                                     timeframe={timeframe}
                                                     snapshotId={id}
                                                     metric='shards.node_active_shards'
                                                     formatter={zeroDecimalPlaces} />
                </td>
                <td>
                  <HistoricMetricSparkChartWithLabel width={200}
                                                     height={30}
                                                     timeframe={timeframe}
                                                     snapshotId={id}
                                                     metric='indices.document_count'
                                                     formatter={zeroDecimalPlaces} />
                </td>
                <Mtd metric={'indices.store_size'}
                     snapshot={node}
                     formatter={bytesTwoDecimalPlaces}/>
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
