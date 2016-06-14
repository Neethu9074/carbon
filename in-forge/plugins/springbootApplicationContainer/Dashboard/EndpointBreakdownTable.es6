import React from 'react';

import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function EndpointBreakdownTable({snapshot, timeframe}) {
  const endpointStatusCodesMap = snapshot.getIn(['data', 'endpointStatusCodesMap'], emptyMap).sort();

  if (endpointStatusCodesMap.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Endpoint Request/Response Breakdown'>
      <ExpandableTable data={endpointStatusCodesMap}
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


function getKey(statusCodes, endpoint) {
  return endpoint;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Request Count</th>
        <th>Last Response Time</th>
      </tr>
    </thead>
  );
}


function createRow(statusCodes, endpoint, context) {
  return ([
    <td>{endpoint}</td>,
    <Mtd metric={'endpoint.' + endpoint}
         snapshot={context.snapshot} />,
    <Mtd metric={'gauge.response.' + endpoint}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(statusCodes, endpoint, context) {
  const statusCodeRequestMetrics = statusCodes.map(statusCode => 'counter.status.' + statusCode + '.' + endpoint)
    .toArray();
  const statusCodeRequestLabels = statusCodes
    .map(statusCode => 'Requests with Status Code ' + statusCode).toArray();
  return (
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
                       key={endpoint}
             height={200}
             margins={{
               left: 80,
               right: 80
             }}
             y1={{
               metrics: statusCodeRequestMetrics,
               labels: statusCodeRequestLabels,
               type: 'line'
             }}
             y2={{
               formatter: msZeroDecimalPlaces,
               metrics: [
                 'gauge.response.' + endpoint
               ],
               labels: [
                 'Last Response Time'
               ],
               type: 'line'
             }}/>
  );
}
