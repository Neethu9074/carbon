import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyMap } from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function DataSourcesTable({ snapshot, timeframe }) {
  const datasources = snapshot.getIn(['data', 'datasource-config'], emptyMap);
  if (datasources.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Data Sources">
      <ExpandableTable
        data={datasources}
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

function getKey(connector, connectorName) {
  return connectorName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Context</th>
        <th>Url</th>
        <th>Active</th>
        <th>Max</th>
      </tr>
    </thead>
  );
}

function createRow(datasource, name, context) {
  return [
    <td>{datasource.getIn(['name'])}</td>,
    <td>{datasource.getIn(['context'])}</td>,
    <td>{datasource.getIn(['url'])}</td>,
    <Mtd metric={'datasources.' + name + '.active'} snapshot={context.snapshot} />,
    <td>{datasource.getIn(['max'], 'unlimited')}</td>
  ];
}

function createDetails(connector, name, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 80
      }}
      y1={{
        metrics: ['datasources.' + name + '.active'],
        labels: ['Active connections'],
        type: 'line'
      }}
    />
  );
}
