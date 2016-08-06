import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import {
  twoDecimalPlaces,
  zeroDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function HttpServersTable({snapshot, timeframe}) {
  const servers = snapshot.getIn(['data', 'http'], emptyMap);

  if (servers.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='HTTP Servers'>
      <ExpandableTable data={servers}
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

function getKey(server, key) {
  return key;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Type</th>
        <th>Bind Address</th>
        <th>Port</th>
        <th>Requests / s</th>
        <th>Responses / s</th>
        <th>Response Time 50th</th>
        <th>Response Time 90th</th>
        <th>Response Time 95th</th>
        <th>Response Time 99th</th>
      </tr>
    </thead>
  );
}


function createRow(server, key, context) {
  return ([
    <td>{server.get('type')}</td>,

    <td>{server.getIn(['address', 'address'])}</td>,

    <td>{server.getIn(['address', 'port'])}</td>,

    <Mtd metric={'http.' + key + '.requests'}
         snapshot={context.snapshot}
         formatter={zeroDecimalPlaces}/>,

    <Mtd metric={'http.' + key + '.responses'}
         snapshot={context.snapshot}
         formatter={zeroDecimalPlaces}/>,

    <Mtd metric={'http.' + key + '.responseTime50'}
         snapshot={context.snapshot}
         formatter={msTwoDecimalPlaces}/>,

    <Mtd metric={'http.' + key + '.responseTime90'}
         snapshot={context.snapshot}
         formatter={msTwoDecimalPlaces}/>,

    <Mtd metric={'http.' + key + '.responseTime95'}
         snapshot={context.snapshot}
         formatter={msTwoDecimalPlaces}/>,

    <Mtd metric={'http.' + key + '.responseTime99'}
         snapshot={context.snapshot}
         formatter={msTwoDecimalPlaces}/>
  ]);
}


function createDetails(server, key, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80,
             right: 80
           }}
           y1={{
             min: 0,
             formatter: zeroDecimalPlaces,
             tooltipFormatter: twoDecimalPlaces,
             metrics: [
               'http.' + key + '.requests',
               'http.' + key + '.responses'
             ],
             labels: [
               'Requests / s',
               'Responses / s'
             ],
             type: 'line'
           }}
           y2={{
             min: 0,
             formatter: msTwoDecimalPlaces,
             tooltipFormatter: msZeroDecimalPlaces,
             metrics: [
               'http.' + key + '.responseTime50',
               'http.' + key + '.responseTime90',
               'http.' + key + '.responseTime95',
               'http.' + key + '.responseTime99'
             ],
             labels: [
               'Response Time 50th',
               'Response Time 90th',
               'Response Time 95th',
               'Response Time 99th'
             ],
             type: 'line'
           }}/>
  );
}
