import React from 'react';

import ServletsInWebAppTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ServletsInWebAppTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyMap } from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function WebAppsTable({ snapshot, timeframe }) {
  const webApps = snapshot.getIn(['data', 'webapps'], emptyMap).sort();
  if (webApps.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Web Apps">
      <ExpandableTable
        data={webApps}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot,
          timeframe
        }}
        createDetails={createDetails}
      />
    </DashboardSection>
  );
}

function getKey(webApp, webAppContext) {
  return webAppContext;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Context</th>
        <th>Name</th>
        <th>Session Timeout</th>
        <th>Number of Sessions</th>
      </tr>
    </thead>
  );
}

function createRow(webApp, webAppContext, context) {
  return [
    <td>{webAppContext}</td>,
    <td>{webApp.get('name')}</td>,
    <td>{webApp.get('session-timeout')}</td>,
    <Mtd metric={'sessions.' + webAppContext} snapshot={context.snapshot} />
  ];
}

function createDetails(webApp, webAppContext, context) {
  return (
    <div>
      <ServletsInWebAppTable webAppContext={webAppContext} snapshot={context.snapshot} timeframe={context.timeframe} />

      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          metrics: ['sessions.' + webAppContext],
          labels: ['Sessions'],
          type: 'line'
        }}
      />
    </div>
  );
}
