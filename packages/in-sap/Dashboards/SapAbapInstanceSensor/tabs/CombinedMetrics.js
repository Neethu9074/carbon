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
import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.combinedCpuTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.userStats.get('totalCpuTimePerUser');
      },
      getContent: millis.detailed
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'combinedMetrics', props.timeConfig)
    };
  },
  function UserList({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const userStat = data.get('raw_payload', []);
    const rows = userStat
      .keySeq()
      .toArray()
      .map(key => {
        const userStats = userStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          userStats
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <DashboardSection title={t('in-sap:dashboards.combinedCpuMetrics')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'combinedMetrics.' + row.key + '.totalResponseTimePerUser',
                  'combinedMetrics.' + row.key + '.totalCpuTimePerUser',
                  'combinedMetrics.' + row.key + '.totalQueueTimePerUser',
                  'combinedMetrics.' + row.key + '.totalRollWaitTimePerUser'
                ],

                labels: [
                  t('in-sap:dashboards.combinedResponseTime'),
                  t('in-sap:dashboards.combinedCpuTime'),
                  t('in-sap:dashboards.combinedQueueTime'),
                  t('in-sap:dashboards.combinedRollWaitTime')
                ],
                type: 'line',
                formatter: millis.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </div>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.combinedCpuMetrics')}
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);
