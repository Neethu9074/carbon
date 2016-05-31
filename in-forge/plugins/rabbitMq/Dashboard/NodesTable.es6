import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {Row, Col} from 'in-components/Grid';
import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

export default function NodesTable({snapshot, timeframe}) {
  const nodes = snapshot.getIn(['data', 'nodes'], emptyList).sort();

  if (nodes.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Nodes'>
      <ExpandableTable data={nodes}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
}


function getKey(nodeName) {
  return nodeName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Node</th>
      </tr>
    </thead>
  );
}


function createRow(nodeName) {
  return ([
    <td>{nodeName}</td>
  ]);
}


function createDetails(nodeName, i, context) {
  return (
    <Row>
      <Col cols={6}>
        <ChartWithLegend snapshot={context.snapshot}
              timeframe={context.timeframe}
              height={150}
              margins={{
                left: 80
              }}
              y1={{
                metrics: [
                  'node_map.' + nodeName + '.fd_used',
                  'node_map.' + nodeName + '.fd_total'
                ],
                labels: [
                  'Used file descriptors',
                  'Total file descriptors'
                ],
                type: 'line'
              }}/>
        <ChartWithLegend snapshot={context.snapshot}
              timeframe={context.timeframe}
              height={150}
              margins={{
                left: 80
              }}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: [
                  'node_map.' + nodeName + '.mem_used',
                  'node_map.' + nodeName + '.mem_limit'
                ],
                labels: [
                  'Used memory',
                  'Memory limit'
                ],
                type: 'line'
              }}/>
      </Col>
      <Col cols={6}>
        <ChartWithLegend snapshot={context.snapshot}
              timeframe={context.timeframe}
              height={150}
              margins={{
                left: 80
              }}
              y1={{
                metrics: [
                  'node_map.' + nodeName + '.proc_used',
                  'node_map.' + nodeName + '.proc_total'
                ],
                labels: [
                  'Erlang processes in use',
                  'Maximum number of Erlang processes'
                ],
                type: 'line'
              }}/>

        <ChartWithLegend snapshot={context.snapshot}
              timeframe={context.timeframe}
              height={150}
              margins={{
                left: 80
              }}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: [
                  'node_map.' + nodeName + '.disk_free',
                  'node_map.' + nodeName + '.disk_free_limit'
                ],
                labels: [
                  'Disk alarm threshold',
                  'Disk free space in bytes'
                ],
                type: 'line'
              }}/>
      </Col>
    </Row>
  );
}
