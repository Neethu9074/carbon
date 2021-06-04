/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Range } from 'immutable';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudFoundry.instanceID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFoundry.percentCpuUtilization'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instances.${row.name}.cpu_utilization`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFoundry.cpuUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instances.${row.name}.app_cpu_usage`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFoundry.cpuEntitlement'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instances.${row.name}.app_cpu_entitlement`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CpuTable({ snapshot, timeConfig, instanceCount }) {
  if (!instanceCount || instanceCount < 1) {
    return null;
  }

  const rows = Range(1, instanceCount + 1)
    .toArray()
    .map(instanceNumber => {
      return {
        key: String(instanceNumber),
        name: String(instanceNumber),
        instanceNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudFoundry.titleCpu')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: percentage.detailed,
          metrics: ['instances.' + row.name + '.cpu_utilization'],
          labels: [t('in-forge:plugins.ibmCloudFoundry.percentCpuUtilization')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: millis.compact,
          metrics: ['instances.' + row.name + '.app_cpu_usage', 'instances.' + row.name + '.app_cpu_entitlement'],
          labels: [
            t('in-forge:plugins.ibmCloudFoundry.cpuUsage'),
            t('in-forge:plugins.ibmCloudFoundry.cpuEntitlement')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}
