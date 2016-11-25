import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


const milliSecondsFormatter = milliSeconds => milliSeconds + ' ms';

export default function ServletsTable({webAppContext, snapshot, timeframe}) {
  const servlets = snapshot.getIn(['data', 'servlets', webAppContext], emptyList).sort();
  if (servlets.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={'Servlets of ' + webAppContext}>
      <ExpandableTable data={servlets}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe,
                         webAppContext
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
        <th>Avg Response Time</th>
        <th>Errors</th>
      </tr>
    </thead>
  );
}

function createRow(servlet, servletIndex, context) {
  const servletKey = context.webAppContext + '.' + servlet;

  return ([
    <td>{servlet}</td>,
    <Mtd metric={'servlets.' + servletKey + '.inv'}
         snapshot={context.snapshot} />,
    <Mtd metric={'servlets.' + servletKey + '.time'}
         snapshot={context.snapshot}
         formatter={milliSecondsFormatter} />,
    <Mtd metric={'servlets.' + servletKey + '.errors'}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(servlet, servletIndex, context) {
  const servletKey = context.webAppContext + '.' + servlet;

  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80,
             right: 40
           }}
           y1={{
             formatter: milliSecondsFormatter,
             metrics: [
               'servlets.' + servletKey + '.time'
             ],
             labels: [
               'Average Response Time'
             ],
             type: 'line'
           }}
           y2={{
             metrics: [
               'servlets.' + servletKey + '.inv',
               'servlets.' + servletKey + '.errors'
             ],
             labels: [
               'Request Count',
               'Errors'
             ],
             type: 'line'
           }} />
  );
}
