/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-sap:dashboards.processType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.requestsStats.get('processType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.requestsWritten'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.requestsStats.get('requestsWritten');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.requestsRead'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.requestsStats.get('requestsRead');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'requestQueueList')
    };
  },
  function RequestQueue({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const requestsStat = data.get('raw_payload', []);
    const rows = requestsStat
      .keySeq()
      .toArray()
      .map(key => {
        const requestsStats = requestsStat.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          requestsStats
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
              formatter: number.compact,
              metrics: [
                'requestQueueList.' + row.key + '.requestsWaiting',
                'requestQueueList.' + row.key + '.maxRequestsWaiting',
                'requestQueueList.' + row.key + '.requestsWritten',
                'requestQueueList.' + row.key + '.requestsRead'
              ],
              labels: [
                t('in-sap:dashboards.requestsWaiting'),
                t('in-sap:dashboards.maxRequestsWaiting'),
                t('in-sap:dashboards.requestsWritten'),
                t('in-sap:dashboards.requestsRead')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.requestQueueInfo')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
