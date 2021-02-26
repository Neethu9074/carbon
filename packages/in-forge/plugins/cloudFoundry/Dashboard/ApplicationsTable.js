/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import InstancesTable from 'in-forge/plugins/cloudFoundry/Dashboard/InstancesTable';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleApplication'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.name']);
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.state']);
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleDiskQuota'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.disk_quota']);
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleMemoryLimit'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.memory_limit']);
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleInstances'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.num_instances']);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleRunningInstances'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'applications_data.' + row.key + '.running_instances']);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleUrls'),
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
      cardTitle={t('in-forge:plugins.cloudFoundry.dashboard.titleApplicationsCount', {
        applicationsCount: rows.length
      })}
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
