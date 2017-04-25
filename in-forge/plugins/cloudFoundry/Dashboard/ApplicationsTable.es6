import React from 'react';

import InstancesTable from 'in-forge/plugins/cloudFoundry/Dashboard/InstancesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Application',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.name');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.state');
      }
    }
  },
  {
    title: 'Disk quota',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.disk_quota');
      }
    }
  },
  {
    title: 'Memory limit',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.memory_limit');
      }
    }
  },
  {
    title: 'Instances',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.num_instances');
      }
    }
  },
  {
    title: 'Instances running',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.running_instances');
      }
    }
  },
  {
    title: 'Urls',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('applications_data.' + row.key + '.urls');
      }
    }
  }
];

export default function ApplicationsTable({ snapshot, timeframe }) {
  const apps = snapshot.getIn(['data', 'applications'], emptyList).toArray().sort();
  if (apps.length === 0) {
    return null;
  }

  const rows = apps.map(app => {
    return {
      key: app.get('id'),
      data: snapshot.get('data'),
      snapshot,
      timeframe
    };
  });

  return (
    <DashboardSection title={`Applications (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const appInstances = getInstancesForApplication(row.snapshot, row.key);

  if (appInstances.length === 0) {
    return null;
  }

  return <InstancesTable snapshot={row.snapshot} timeframe={row.timeframe} instances={appInstances} />;
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
