import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {
  msZeroDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function BackendsTable({snapshot, timeframe}) {
  const backends = snapshot.getIn(['data', 'backends'], emptyList);

  if (backends.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Backends (${backends.size})`}>
      <ExpandableTable data={backends}
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


function getKey(backendName) {
  return backendName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Backend Name</th>
        <th>Average Response Time</th>
        <th>Average Queue Time</th>
        <th>Queue Size</th>
        <th>Connection Errors</th>
        <th>Response Errors</th>
        <th>Connection Retries</th>
        <th>Denied Responses</th>
        <th>Re-Dispatched Requests</th>
      </tr>
    </thead>
  );
}


function createRow(backendName, i, context) {
  return ([
    <td>{backendName}</td>,
    <Mtd metric={'backendStats.' + backendName + '.avgResponseTime'}
         formatter={msZeroDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.avgQueueTime'}
         formatter={msZeroDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.queueSize'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.reqConnErrors'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.errorRes'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.connRetries'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.deniedRes'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'backendStats.' + backendName + '.reDispatchedReq'}
         snapshot={context.snapshot}/>
  ]);
}


function createDetails(backendName, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        formatter: msZeroDecimalPlaces,
                        metrics: [
                          'backendStats.' + backendName + '.avgResponseTime',
                          'backendStats.' + backendName + '.avgQueueTime'
                        ],
                        labels: [
                          'Average Response Time',
                          'Average Queue Time'
                        ],
                        type: 'line'
                      }}
                      y2={{
                        metrics: [
                          'backendStats.' + backendName + '.queueSize'
                        ],
                        labels: [
                          'Queue Size'
                        ],
                        type: 'line'
                      }}/>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        metrics: [
                          'backendStats.' + backendName + '.reqConnErrors',
                          'backendStats.' + backendName + '.errorRes'
                        ],
                        labels: [
                          'Connection Errors',
                          'Response Errors'
                        ],
                        type: 'line'
                      }}/>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        metrics: [
                          'backendStats.' + backendName + '.connRetries'
                        ],
                        labels: [
                          'Connection Retries'
                        ],
                        type: 'line'
                      }}/>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        metrics: [
                          'backendStats.' + backendName + '.deniedRes'
                        ],
                        labels: [
                          'Denied Responses'
                        ],
                        type: 'line'
                      }}/>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        metrics: [
                          'backendStats.' + backendName + '.reDispatchedReq'
                        ],
                        labels: [
                          'Re-Dispatched Requests'
                        ],
                        type: 'line'
                      }}/>
    </div>
  );
}
