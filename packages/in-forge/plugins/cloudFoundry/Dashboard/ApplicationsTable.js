/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InstancesTable from 'in-forge/plugins/cloudFoundry/Dashboard/InstancesTable';
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

export default function ApplicationsTable({ snapshot, timeConfig }) {
  const apps = snapshot.getIn(['data', 'applications'], emptyList).toArray();
  if (apps.length === 0) {
    return null;
  }

  const rows = apps.map(app => {
    return {
      key: app,
      snapshot,
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={`Applications (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const appInstances = getInstancesForApplication(row.snapshot, row.key);

  if (appInstances.length === 0) {
    return null;
  }

  return <InstancesTable snapshot={row.snapshot} timeConfig={row.timeConfig} instances={appInstances} />;
}

function getInstancesForApplication(snapshot, appId) {
  const retList = [];
  const instances = snapshot.getIn(['data', 'instances'], emptyList).toArray();

  instances.forEach(function(instance) {
    if (instance.indexOf(appId) === 0) {
      retList.push(instance);
    }
  });
  return retList;
}
