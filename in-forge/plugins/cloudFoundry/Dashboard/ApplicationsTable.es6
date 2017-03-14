import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';

import InstancesTable from 'in-forge/plugins/cloudFoundry/Dashboard/InstancesTable';

export default function ApplicationsTable({snapshot, timeframe}) {
  const apps = snapshot.getIn(['data', 'applications'], emptyList).sort();

  if (apps.length === 0) {
    return null;
  }

  return (
    <DashboardSection title='Applications'>
      <ExpandableTable data={apps}
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

function getKey(appId) {
  return appId;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Application</th>
        <th>State</th>
        <th>Disk quota</th>
        <th>Memory limit</th>
        <th>Instances</th>
        <th>Instances running</th>
        <th>Urls</th>
      </tr>
    </thead>
  );
}

function createRow(appId, i, context) {
  const data = context.snapshot.get('data');
  return ([
    <td>{data.get('applications_data.' + appId + '.name')}</td>,
    <td>{data.get('applications_data.' + appId + '.state')}</td>,
    <td>{data.get('applications_data.' + appId + '.disk_quota')}</td>,
    <td>{data.get('applications_data.' + appId + '.memory_limit')}</td>,
    <td>{data.get('applications_data.' + appId + '.num_instances')}</td>,
    <td>{data.get('applications_data.' + appId + '.running_instances')}</td>,
    <td>{data.get('applications_data.' + appId + '.urls')}</td>
  ]);
}

function createDetails(appId, i, context) {
  const appInstances = getInstancesForApplication(context.snapshot, appId);

  if (appInstances.length === 0) {
   return null;
  }

  return (
      <InstancesTable snapshot={context.snapshot}
                      timeframe={context.timeframe}
                      instances={appInstances} />
  );
}

function getInstancesForApplication(snapshot, appId) {
  const retList = [];
  const instances = snapshot.getIn(['data', 'instances'], emptyList).sort();

  instances.forEach(function(instance) {
    if (instance.indexOf(appId) === 0) {
      retList.push(instance);
    }
  });
  return retList;
}
