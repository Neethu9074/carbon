/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { percentageTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.name');
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.state');
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.host');
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titlePort'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.port');
      },
      getContent: number.compact
    }
  }
];

export default function InstancesTable({ snapshot, timeConfig, instances }) {
  const rows = instances.map(instance => {
    return {
      key: instance,
      snapshotId: snapshot.get('id'),
      data: snapshot.get('data'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cloudFoundry.dashboard.titleInstancesCount', { instancesCount: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Columize>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleCPU')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: percentageTwoDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['instances_metrics.' + row.key + '.cpu'],
            labels: [t('in-forge:plugins.cloudFoundry.dashboard.titleCPU')],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleMemory')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesZeroDecimalPlaces,
            metrics: ['instances_metrics.' + row.key + '.disk', 'instances_metrics.' + row.key + '.memory'],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.labelDisk'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelMemory')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
