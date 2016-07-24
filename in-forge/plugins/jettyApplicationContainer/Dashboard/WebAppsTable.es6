import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function WebAppsTable({snapshot, timeframe}) {
  const webApps = snapshot.getIn(['data', 'webApps'], emptyList).filter(webApp => webApp.get('state') === 'STARTED');

  if (webApps.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Web Apps'>
      <ExpandableTable data={webApps}
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


function getKey(webApp) {
  return webApp.get('displayName');
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Web App</th>
        <th>Active Sessions</th>
      </tr>
    </thead>
  );
}


function createRow(webApp, i, context) {
  const webAppName = webApp.get('displayName');
  return ([
    <td>{webAppName}</td>,
    <Mtd metric={'webAppsSessionData.' + webAppName + '.sessions'}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(webApp, i, context) {
  const webAppName = webApp.get('displayName');
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80
             }}
             y1={{
               metrics: [
                 'webAppsSessionData.' + webAppName + '.sessions'
               ],
               labels: [
                 'Active Sessions'
               ],
               type: 'line'
             }} />
    </div>
  );
}
