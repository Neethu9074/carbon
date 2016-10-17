import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {
  percentageTwoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function FrontendsTable({snapshot, timeframe}) {
  const frontends = snapshot.getIn(['data', 'frontends'], emptyList);

  if (frontends.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Frontends (${frontends.size})`}>
      <ExpandableTable data={frontends}
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


function getKey(indexName) {
  return indexName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Frontend Name</th>
        <th>Requests</th>
        <th>Request Errors</th>
        <th>Denied Requests</th>
        <th>Sessions</th>
        <th>Session Usage</th>
        <th>Client Errors</th>
        <th>Server Errors</th>
        <th>Bytes Sent</th>
        <th>Bytes Received</th>
      </tr>
    </thead>
  );
}


function createRow(frontendName, i, context) {
  return ([
    <td>{frontendName}</td>,
    <Mtd metric={'frontendStats.' + frontendName + '.reqRate'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.reqErrors'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.deniedReq'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.sessionRate'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.sessionUtilization'}
         formatter={percentageTwoDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.clientErrors'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.serverErrors'}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.bytesSent'}
         formatter={bytesTwoDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'frontendStats.' + frontendName + '.bytesReceived'}
         formatter={bytesTwoDecimalPlaces}
         snapshot={context.snapshot}/>
  ]);
}


function createDetails(frontendName, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        metrics: [
                          'frontendStats.' + frontendName + '.reqRate',
                          'frontendStats.' + frontendName + '.reqErrors',
                          'frontendStats.' + frontendName + '.deniedReq'
                        ],
                        labels: [
                          'Requests',
                          'Request Errors',
                          'Denied Requests'
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
                          'frontendStats.' + frontendName + '.sessionRate'
                        ],
                        labels: [
                          'Sessions'
                        ],
                        type: 'line'
                      }}
                      y2={{
                        formatter: percentageTwoDecimalPlaces,
                        metrics: [
                          'frontendStats.' + frontendName + '.sessionUtilization'
                        ],
                        labels: [
                          'Session Usage'
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
                          'frontendStats.' + frontendName + '.clientErrors',
                          'frontendStats.' + frontendName + '.serverErrors'
                        ],
                        labels: [
                          'Client Errors',
                          'Server Errors'
                        ],
                        type: 'line'
                      }}/>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                      timeframe={context.timeframe}
                      margins={{
                        left: 80
                      }}
                      y1={{
                        formatter: bytesTwoDecimalPlaces,
                        metrics: [
                          'frontendStats.' + frontendName + '.bytesSent',
                          'frontendStats.' + frontendName + '.bytesReceived'
                        ],
                        labels: [
                          'Bytes Sent',
                          'Bytes Received'
                        ],
                        type: 'line'
                      }}/>
    </div>
  );
}
