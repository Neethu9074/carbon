/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, seconds } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.protocol'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('protocol');
      }
    }
  },
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('taskType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('entryID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.account'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.mandt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('mandt');
      }
    }
  },
  {
    title: t('in-sap:dashboards.host'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('host');
      }
    }
  },
  {
    title: t('in-sap:dashboards.port'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.httpMetricStats.get('port');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'httpMetricsStats')
    };
  },
  function HttpMetricsStats({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const httpMetricStat = data.get('raw_payload', []);
    const rows = httpMetricStat
      .keySeq()
      .toArray()
      .map(key => {
        const httpMetricStats = httpMetricStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          httpMetricStats
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              formatter: seconds.compact,
              metrics: [
                'httpMetricsStats.' + row.key + '.callTime',
                'httpMetricsStats.' + row.key + '.executionTime',
                'httpMetricsStats.' + row.key + '.dataSendTime',
                'httpMetricsStats.' + row.key + '.dataReceiveTime',
                'httpMetricsStats.' + row.key + '.logonTime'
              ],
              labels: [
                t('in-sap:dashboards.callTime'),
                t('in-sap:dashboards.executionTime'),
                t('in-sap:dashboards.dataSendTime'),
                t('in-sap:dashboards.dataReceiveTime'),
                t('in-sap:dashboards.logonTime')
              ],
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['httpMetricsStats.' + row.key + '.counter'],
              labels: [t('in-sap:dashboards.counter')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.httpMetricsStats')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
