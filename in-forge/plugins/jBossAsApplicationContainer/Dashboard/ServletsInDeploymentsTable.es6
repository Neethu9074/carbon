import React from 'react';

import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function ServletsTable({deploymentContext, snapshot, timeframe}) {
  const servlets = snapshot.getIn(['data', 'servlets'], emptyList).sort();

  if (servlets.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={'Servlets of ' + deploymentContext}>
      <ExpandableTable data={servlets}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe,
                         deploymentContext
                       }}
                       createDetails={createDetails}/>
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


function createRow(servletName, servletIndex, context) {
  const servletKey = context.deploymentContext + '.' + servletName;

  return ([
    <td>{servletName}</td>,

    <Mtd metric={'servlets.' + servletKey + '.requests'}
      snapshot={context.snapshot} />,
    <Mtd metric={'servlets.' + servletKey + '.avgResponseTime'}
      snapshot={context.snapshot} formatter={msZeroDecimalPlaces} />
  ]);
}


function createDetails(servlet, servletIndex, context) {
  return (
    <ChartWithLegend snapshot={context.snapshot}
           timeframe={context.timeframe}
           height={200}
           margins={{
             left: 80,
             right: 40
           }}
           y1={{
             formatter: msZeroDecimalPlaces,
             metrics: [
               'servlets.' + servlet + '.avgResponseTime'
             ],
             labels: [
               'Average Response Time'
             ],
             type: 'line'
           }}
           y2={{
             metrics: [
               'servlets.' + servlet + '.requests'
             ],
             labels: [
               'Requests'
             ],
             type: 'line'
           }}/>
  );
}
