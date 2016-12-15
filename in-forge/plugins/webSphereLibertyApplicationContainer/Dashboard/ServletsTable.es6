import React from 'react';

import {zeroDecimalPlaces, muSecondsToMillisTwoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap, emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function ServletsTable({snapshot, timeframe}) {
  const servlets = snapshot.getIn(['data', 'applications'], emptyMap).sort().map((appData, appName) => {
    return appData.get('servlets', emptyList).sort().map(servletName => {
      return {
        appName: appName,
        servletName: servletName
      };
    });
  }).flatten();
  if (servlets.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Servlets'>
      <ExpandableTable data={servlets}
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

function getKey(servlet) {
  return servlet.appName + '.' + servlet.servletName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>App Name</th>
        <th>Servlet Name</th>
        <th>Requests</th>
        <th>Average Response Time</th>
      </tr>
    </thead>
  );
}

function createRow(servlet, i, context) {
  return ([
    <td>{servlet.appName}</td>,
    <td>{servlet.servletName}</td>,
    <Mtd metric={'servlets.' + servlet.appName + '.' + servlet.servletName + '.requests'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'servlets.' + servlet.appName + '.' + servlet.servletName + '.avgResponseTime'}
         formatter={muSecondsToMillisTwoDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(servlet, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80,
                         right: 40
                       }}
                       y1={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'servlets.' + servlet.appName + '.' + servlet.servletName + '.requests'
                         ],
                         labels: [
                           'Requests'
                         ],
                         type: 'line'
                       }} />
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80,
                         right: 40
                       }}
                       y1={{
                         formatter: muSecondsToMillisTwoDecimalPlaces,
                         metrics: [
                           'servlets.' + servlet.appName + '.' + servlet.servletName + '.avgResponseTime'
                         ],
                         labels: [
                           'Average Response Time'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
