import React from 'react';

import {
  percentageZeroDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';

export default function InstancesTable({snapshot, timeframe, instances}) {
 if (instances.size === 0) {
   return null;
 }

  return (
    <DashboardSection title='Instances'>
      <ExpandableTable data={instances}
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

function getKey(instanceId) {
  return instanceId;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>State</th>
        <th>Host</th>
        <th>Port</th>
      </tr>
    </thead>
  );
}

function createRow(instanceId, i, context) {
  const data = context.snapshot.get('data');
  return ([
    <td>{data.get('instances_data.' + instanceId + '.name')}</td>,
    <td>{data.get('instances_data.' + instanceId + '.state')}</td>,
    <td>{data.get('instances_data.' + instanceId + '.host')}</td>,
    <td>{data.get('instances_data.' + instanceId + '.port')}</td>,
  ]);
}

function createDetails(instanceId, i, context) {
  return (
    <div>
      <DashboardSection title='Resources'>
        <SparkChartsSection snapshot={context.snapshot}
                            metrics={[
                              {
                                metric: 'instances_metrics.' + instanceId + '.cpu',
                                label: 'CPU',
                                formatter: percentageZeroDecimalPlaces
                              }, {
                                metric: 'instances_metrics.' + instanceId + '.disk',
                                label: 'Disk',
                                formatter: bytesZeroDecimalPlaces
                              }, {
                                metric: 'instances_metrics.' + instanceId + '.memory',
                                label: 'Memory',
                                formatter: bytesZeroDecimalPlaces
                              }
                            ]} />
      </DashboardSection>
    </div>
  );
}
