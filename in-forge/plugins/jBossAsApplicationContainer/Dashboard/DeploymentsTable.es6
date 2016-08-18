import React from 'react';

import ServletsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ServletsInDeploymentsTable';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function DeploymentsTable({snapshot, timeframe}) {
  const deployments = snapshot.getIn(['data', 'deployments'], emptyMap)
                              .filter((c) => c.get('contextRoot')).sort();
  const isEAP = snapshot.getIn(['data', 'serverInfo', 'productName']) === 'EAP';

  if (!isEAP || deployments.size === 0) {
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


function getKey(indexName) {
  return indexName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Deployment</th>
        <th>Active Sessions</th>
      </tr>
    </thead>
  );
}


function createRow(deploymentName, deploymentContext, context) {
  return ([
    <td>{deploymentContext}</td>,

    <Mtd metric={'sessions.' + deploymentContext + '.activeSessions'}
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
               type: 'line'
             }} />
    </div>
  );
}
