import React from 'react';

import {
  percentageTwoDecimalPlaces,
  bytesTwoDecimalPlaces,
  msTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import HistoricMetricSparkChartWithLabel from 'in-charts/SparkChart/HistoricMetricSparkChartWithLabel';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import SnapshotLink from 'in-components/SnapshotLink';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';


export default connectTo(
  props => {
    return {
      nodes: props.dataStream
    };
  }, function LogicalEntityTable({nodes, title, timeframe}) {
    if (!nodes || nodes.length === 0) {
      return null;
    }
    return (
      <DashboardSection title={title}>
        <ResponsiveTable>
          <thead>
            <tr>
              <th>Health</th>
              <th>Name</th>
              <th>Calls/s</th>
              <th>Error Rate</th>
              <th>Instances</th>
              <th>Latency</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(node => {
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
                    <HistoricMetricSparkChartWithLabel width={100}
                                                       height={30}
                                                       timeframe={timeframe}
                                                       snapshotId={id}
                                                       metric='count'
                                                       formatter={zeroDecimalPlaces} />
                  </td>
                  <td>
                    <HistoricMetricSparkChartWithLabel width={100}
                                                       height={30}
                                                       timeframe={timeframe}
                                                       snapshotId={id}
                                                       metric='duration.mean'
                                                       formatter={msTwoDecimalPlaces} />
                  </td>
                  <td>
                    <HistoricMetricSparkChartWithLabel width={100}
                                                       height={30}
                                                       timeframe={timeframe}
                                                       snapshotId={id}
                                                       metric='error_rate'
                                                       formatter={percentageTwoDecimalPlaces} />
                  </td>
                  <td>
                    <HistoricMetricSparkChartWithLabel width={100}
                                                       height={30}
                                                       timeframe={timeframe}
                                                       snapshotId={id}
                                                       metric='instances'
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
      </DashboardSection>
    );
  }
);
