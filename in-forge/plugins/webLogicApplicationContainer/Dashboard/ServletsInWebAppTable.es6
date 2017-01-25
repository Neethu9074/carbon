import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';
import {emptyList} from 'in-services/fixedImmutables';
import {msZeroDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';


export default function Table({contextRootPath, snapshot, timeframe}) {
  const servlets = snapshot.getIn(['data', 'contextsToServlets', contextRootPath], emptyList).sort();

  if (servlets.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={'Servlets of ' + contextRootPath}>
      <ExpandableTable data={servlets}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe,
                         contextRootPath
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
}


function getKey(servlet) {
  return servlet;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Servlet</th>
        <th>Requests</th>
        <th>Average Response Time</th>
      </tr>
    </thead>
  );
}


function createRow(servletName, i, context) {
  const servletKey = context.contextRootPath + '/' + servletName;
  return ([
    <td>{servletName}</td>,

    <Mtd metric={'servlets.' + servletKey + '.requests'}
      snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,

    <Mtd metric={'servlets.' + servletKey + '.avgResponseTime'}
      snapshot={context.snapshot} formatter={msZeroDecimalPlaces} />
  ]);
}


function createDetails(servletName, i, context) {
  const servletKey = context.contextRootPath + '/' + servletName;

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
                 'servlets.' + servletKey + '.avgResponseTime'
               ],
               labels: [
                 'Average Response Time'
               ],
               type: 'line'
             }} />
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80
             }}
             y1={{
               formatter: zeroDecimalPlaces,
               metrics: [
                 'servlets.' + servletKey + '.requests'
               ],
               labels: [
                 'Requests'
               ],
               type: 'line'
             }} />
    </div>
  );
}
