import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

const milliSecondsFormatter = milliSeconds => milliSeconds + ' ms';

export default function ServletsTable({webAppContext, snapshot}) {
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
                       context={{snapshot}}/>
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
  return ([
    <td>{servlet}</td>,
    <Mtd metric={'servlets.' + servlet + '.inv'}
         snapshot={context.snapshot} />,
    <Mtd metric={'servlets.' + servlet + '.time'}
         snapshot={context.snapshot}
         formatter={milliSecondsFormatter} />,
    <Mtd metric={'servlets.' + servlet + '.errors'}
         snapshot={context.snapshot} />
  ]);
}
