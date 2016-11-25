import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function WebsitesTable({snapshot, timeframe}) {
  const webSites = snapshot.getIn(['data', 'allsites'], emptyList);

  if (webSites.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Websites'>
      <ExpandableTable data={webSites}
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


function getKey(name) {
  return name;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Current Connections</th>
        <th>Requests</th>
        <th>GET Requests</th>
        <th>POST Requests</th>
        <th>PUT Requests</th>
      </tr>
    </thead>
  );
}


function createRow(name, i, context) {
  return ([
    <td>{name}</td>,
    <Mtd metric={'siteperf.' + name + '.current_connections'}
         snapshot={context.snapshot} />,
    <Mtd metric={'siteperf.' + name + '.total_requests'}
         snapshot={context.snapshot} />,
    <Mtd metric={'siteperf.' + name + '.get_requests'}
         snapshot={context.snapshot} />,
    <Mtd metric={'siteperf.' + name + '.post_requests'}
         snapshot={context.snapshot} />,
    <Mtd metric={'siteperf.' + name + '.put_requests'}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(name, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 60
             }}
             y1={{
               metrics: ['siteperf.' + name + '.total_requests'],
               labels: ['Total number of requests'],
               type: 'line'
             }} />

      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80
             }}
             y1={{
               metrics: ['siteperf.' + name + '.current_connections'],
               labels: ['Current number of connections'],
               type: 'line'
             }} />

      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80,
               right: 80
             }}
             y1={{
               min: 0,
               metrics: [
                 'siteperf.' + name + '.get_requests',
                 'siteperf.' + name + '.post_requests',
                 'siteperf.' + name + '.put_requests'
               ],
               labels: [
                 'GET Requests',
                 'POST Requests',
                 'PUT Requests'
               ],
               type: 'line'
             }}
             y2={{
               min: 0,
               formatter: bytesTwoDecimalPlaces,
               metrics: [
                 'siteperf.' + name + '.bytes_sent',
                 'siteperf.' + name + '.bytes_received'
               ],
               labels: [
                 'Bytes sent',
                 'Bytes received'
               ],
               type: 'line'
             }} />
    </div>
  );
}
