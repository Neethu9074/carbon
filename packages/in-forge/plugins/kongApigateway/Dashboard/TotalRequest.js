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
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.totalRequests.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.totalRequests'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalRequests.get('totalRequests');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'nginxHttpCurrentConnections')
    };
  },
  function TotalRequest({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const kongNginxRequestsTotal = data.get('raw_payload');
    const rows = kongNginxRequestsTotal
      .keySeq()
      .toArray()
      .map(key => {
        const totalRequests = kongNginxRequestsTotal.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          totalRequests
        };
      });
    if (rows.length === 0) {
      return null;
    }
    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <div>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['kongNginxRequestsTotal.' + row.key + '.connections'],
              labels: [t('in-forge:plugins.kongApigateway.totalRequests')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.dashboard.totalRequests')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
