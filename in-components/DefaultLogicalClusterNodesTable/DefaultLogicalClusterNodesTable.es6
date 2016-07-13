import {combineLatest} from 'reactive-observables';
import React from 'react';

import {msTwoDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import HistoricMetricSparkChartWithLabel from 'in-charts/SparkChart/HistoricMetricSparkChartWithLabel';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import SnapshotLink from 'in-components/SnapshotLink';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';


export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))

        // throttle because of massive snapshot updates which would produce a rerender/call
        .throttle(1000)
    };
  }, function ClusterNodesTable({clusterNodes, timeframe}) {
    return (
      <ResponsiveTable>
        <thead>
          <tr>
            <th>Health</th>
            <th>Name</th>
            <th>Calls/s</th>
            <th>Erros</th>
            <th>Latency</th>
          </tr>
        </thead>
        <tbody>
          {!clusterNodes ? null : clusterNodes.map(node => {
            const id = node.get('id');
            return (
              <tr key={id}>
                <td>
                  <AnnotatedHealthBar snapshotId={id} />
                </td>
                <td>
                  <SnapshotLink snapshotId={id}>
                    {getLabel(node)}
                  </SnapshotLink>
                </td>
                <td>
                  <HistoricMetricSparkChartWithLabel width={200}
                                                     height={30}
                                                     timeframe={timeframe}
                                                     snapshotId={id}
                                                     metric='count'
                                                     formatter={twoDecimalPlaces} />
                </td>
                <td>
                  <HistoricMetricSparkChartWithLabel width={200}
                                                     height={30}
                                                     timeframe={timeframe}
                                                     snapshotId={id}
                                                     metric='duration.mean'
                                                     formatter={msTwoDecimalPlaces} />
                </td>
                <td>
                  <HistoricMetricSparkChartWithLabel width={200}
                                                     height={30}
                                                     timeframe={timeframe}
                                                     snapshotId={id}
                                                     metric='error_count'
                                                     formatter={msTwoDecimalPlaces} />
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
