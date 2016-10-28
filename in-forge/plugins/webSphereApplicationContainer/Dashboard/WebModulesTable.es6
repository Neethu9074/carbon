import React from 'react';

import {zeroDecimalPlaces, msZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function WebModulesTable({snapshot, timeframe}) {
  const webModules = snapshot.getIn(['data', 'webModules'], emptyList).sort();
  if (webModules.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Web Modules'>
      <ExpandableTable data={webModules}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails}/>
    </DashboardSection>
  );
}

function getKey(webModule) {
  return webModule;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Number of Sessions</th>
        <th>Servlets Requests</th>
        <th>Servlets Average Response Time</th>
        <th>Servlets Errors</th>
      </tr>
    </thead>
  );
}

function createRow(webModule, i, context) {
  return ([
    <td>{webModule}</td>,
    <Mtd metric={'sessionManagers.' + webModule + '.activeCount'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'servlets.' + webModule + '.requests'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'servlets.' + webModule + '.avgResponseTime'}
         formatter={msZeroDecimalPlaces}
         snapshot={context.snapshot}/>,
    <Mtd metric={'servlets.' + webModule + '.errors'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot}/>
  ]);
}

function createDetails(webModule, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'sessionManagers.' + webModule + '.activeCount'
                         ],
                         labels: [
                           'Sessions'
                         ],
                         type: 'line'
                       }}/>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80,
                         right: 40
                       }}
                       y1={{
                         formatter: msZeroDecimalPlaces,
                         metrics: [
                           'servlets.' + webModule + '.avgResponseTime'
                         ],
                         labels: [
                           'Average Response Time'
                         ],
                         type: 'line'
                       }}
                       y2={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'servlets.' + webModule + '.requests',
                           'servlets.' + webModule + '.errors'
                         ],
                         labels: [
                           'Request Count',
                           'Errors'
                         ],
                         type: 'line'
                       }}/>
    </div>
  );
}
