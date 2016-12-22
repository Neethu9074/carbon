import React from 'react';

import ServletsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ServletsInDeploymentsTable';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {yesOrNo} from 'in-services/formatters/boolean';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function DeploymentsTable({snapshot, timeframe}) {
  const deployments = snapshot.getIn(['data', 'deployments'], emptyMap)
                              .filter(c => c.get('contextRoot'))
                              .sort();

  if (deployments.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Web Deployments'>
      <ExpandableTable data={deployments}
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


function getKey(deployment, runtimeName) {
  return runtimeName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Deployment</th>
        <th>Context Root</th>
        <th>Enabled</th>
        <th>Status</th>
        <th>Active Sessions</th>
      </tr>
    </thead>
  );
}


function createRow(deployment, runtimeName, context) {
  return ([
    <td>{runtimeName}</td>,

    <td>{deployment.get('contextRoot')}</td>,

    <td>{yesOrNo(deployment.get('enabled'))}</td>,

    <td>{deployment.get('status')}</td>,

    <Mtd metric={'sessions.' + runtimeName + '.activeSessions'}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(deploymentName, deploymentContext, context) {
  return (
    <div>
      <ServletsTable deploymentContext={deploymentContext}
                     snapshot={context.snapshot}
                     timeframe={context.timeframe} />

      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80
             }}
             y1={{
               metrics: [
                 'sessions.' + deploymentContext + '.activeSessions'
               ],
               labels: [
                 'Active Sessions'
               ],
               type: 'line',
               min: 0
             }} />
    </div>
  );
}
