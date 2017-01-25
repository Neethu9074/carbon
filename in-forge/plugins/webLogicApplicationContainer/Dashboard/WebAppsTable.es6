import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';
import {emptyMap} from 'in-services/fixedImmutables';
import {zeroDecimalPlaces} from 'in-services/formatters/number';

import ServletsInWebAppTable from './ServletsInWebAppTable';


export default function Table({snapshot, timeframe}) {
  const contextRootPaths = snapshot.getIn(['data', 'contextsToServlets'], emptyMap).keySeq().sort();

  if (contextRootPaths.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Web Deployments'>
      <ExpandableTable data={contextRootPaths}
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


function getKey(contextRootPath) {
  return contextRootPath;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Context Root</th>
        <th>Status</th>
        <th>Session Timeout</th>
        <th>Active Sessions</th>
      </tr>
    </thead>
  );
}


function createRow(contextRootPath, i,  context) {
  const data = context.snapshot.get('data');
  return ([
    <td>{contextRootPath}</td>,

    <td>{data.get('webApps.'+ contextRootPath +'.status')}</td>,

    <td>{data.get('webApps.'+ contextRootPath +'.sessionTimeout')}</td>,

    <Mtd metric={'webApps.' + contextRootPath + '.activeSessions'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />
  ]);
}


function createDetails(contextRootPath, i, context) {
  return (
    <div>
      <ServletsInWebAppTable contextRootPath={contextRootPath}
                             snapshot={context.snapshot}
                             timeframe={context.timeframe} />

      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'webApps.' + contextRootPath + '.activeSessions',
                           'webApps.' + contextRootPath + '.createdSessions'
                         ],
                         labels: [
                           'Active Sessions',
                           'Created Sessions'
                         ],
                         type: 'line',
                         min: 0
                       }} />
    </div>
  );
}
