import React from 'react';

import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
      <th>All Requests</th>
      <th>Requests with Status Code 1xx</th>
      <th>Requests with Status Code 2xx</th>
      <th>Requests with Status Code 3xx</th>
      <th>Requests with Status Code 4xx</th>
      <th>Requests with Status Code 5xx</th>
      <th>Response Time of Latest Request</th>
    </tr>
    </thead>
  );
}


function createRow(statusCodes, endpoint, context) {
  const endpointMetricName = 'endpoint.' + endpoint;
  return ([
    <td>{endpoint}</td>,
    <Mtd metric={endpointMetricName}
         snapshot={context.snapshot} />,
    <Mtd metric={endpointMetricName + '.' + '1xx'}
         snapshot={context.snapshot} />,
    <Mtd metric={endpointMetricName + '.' + '2xx'}
         snapshot={context.snapshot} />,
    <Mtd metric={endpointMetricName + '.' + '3xx'}
         snapshot={context.snapshot} />,
    <Mtd metric={endpointMetricName + '.' + '4xx'}
         snapshot={context.snapshot} />,
    <Mtd metric={endpointMetricName + '.' + '5xx'}
         snapshot={context.snapshot} />,
    <Mtd metric={'gauge.response.' + endpoint}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(statusCodes, endpoint, context) {
  const endpointMetricName = 'endpoint.' + endpoint;
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
                     timeframe={context.timeframe}
                     key={endpoint}
                     margins={{
                      left: 80,
                      right: 80
                     }}
                     y1={{
                      metrics: [
                        endpointMetricName,
                        endpointMetricName + '.1xx',
                        endpointMetricName + '.2xx',
                        endpointMetricName + '.3xx',
                        endpointMetricName + '.4xx',
                        endpointMetricName + '.5xx'
                      ],
                      labels: [
                        'All Requests',
                        'Requests with Status Code 1xx',
                        'Requests with Status Code 2xx',
                        'Requests with Status Code 3xx',
                        'Requests with Status Code 4xx',
                        'Requests with Status Code 5xx'
                      ],
                      type: 'line'
                     }}
                     y2={{
                      formatter: msZeroDecimalPlaces,
                      metrics: [
                        'gauge.response.' + endpoint
                      ],
                      labels: [
                        'Response Time of Latest Request'
                      ],
                      type: 'line'
                     }} />
  );
}
