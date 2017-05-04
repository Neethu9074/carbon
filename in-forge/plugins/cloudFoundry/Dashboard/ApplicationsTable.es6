import React from 'react';

import InstancesTable from 'in-forge/plugins/cloudFoundry/Dashboard/InstancesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Application',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.name']);
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.state']);
      }
    }
  },
  {
    title: 'Disk quota',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.disk_quota']);
      },
      getContent: number.detailed
    }
  },
  {
    title: 'Memory limit',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.memory_limit']);
      },
      getContent: number.detailed
    }
  },
  {
    title: 'Instances',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.num_instances']);
      },
      getContent: number.compact
    }
  },
  {
    title: 'Running instances',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.running_instances']);
      },
      getContent: number.compact
    }
  },
  {
    title: 'Urls',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.urls'], emptyList).join(', ');
      }
    }
  }
];

export default function ApplicationsTable({ snapshot, timeframe }) {
  const apps = snapshot.getIn(['data', 'applications'], emptyList).toArray();
  if (apps.length === 0) {
    return null;
  }

  const rows = apps.map(app => {
    return {
      key: app,
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
