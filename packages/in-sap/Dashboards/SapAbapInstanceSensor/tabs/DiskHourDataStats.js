/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.diskName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.diskStats.get('diskName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.diskStats.get('type');
      }
    }
  },
  {
    title: t('in-sap:dashboards.subType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.diskStats.get('subType');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'diskHourDataStats')
    };
  },
  function DiskHourDataStats({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const diskStat = data.get('raw_payload', []);
    const rows = diskStat
      .keySeq()
      .toArray()
      .map(key => {
        const diskStats = diskStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          diskStats
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Columize>
            <DashboardSection title={t('in-sap:dashboards.performanceStats')}>
              <Chart
                snapshotId={row.snapshotId}
                timeConfig={row.timeConfig}
                y1={{
                  min: 0,
                  metrics: [
                    'diskHourDataStats.' + row.key + '.avgQueueLength',
                    'diskHourDataStats.' + row.key + '.response'
                  ],
                  labels: [t('in-sap:dashboards.avgQueueLength'), t('in-sap:dashboards.response')],
                  type: 'line',
                  formatter: number.compact
                }}
                y2={{
                  min: 0,
                  metrics: ['diskHourDataStats.' + row.key + '.avgWaitTime'],
                  labels: [t('in-sap:dashboards.avgWaitTime')],
                  type: 'line',
                  formatter: seconds.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <DashboardSection title={t('in-sap:dashboards.diskOperations')}>
              <Chart
                snapshotId={row.snapshotId}
                timeConfig={row.timeConfig}
                y1={{
                  min: 0,
                  metrics: [
                    'diskHourDataStats.' + row.key + '.mbPerHour',
                    'diskHourDataStats.' + row.key + '.operationsPerHour'
                  ],
                  labels: [t('in-sap:dashboards.mbPerHour'), t('in-sap:dashboards.operationsPerHour')],
                  type: 'line',
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </div>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.diskHourDataStats')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
