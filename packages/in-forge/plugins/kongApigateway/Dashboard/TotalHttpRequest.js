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
    title: t('in-forge:plugins.kongApigateway.service'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('service');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('route');
      },
     
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.code'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('code');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.source'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('source');
      },
    
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.consumer'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('consumer');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.noofrequests'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('request');
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
  function TotalHttpRequest({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const nginxHttpCurrentConnection = data.get('raw_payload');
    const rows = nginxHttpCurrentConnection
      .keySeq()
      .toArray()
      .map(key => {
        const totalConnection = nginxHttpCurrentConnection.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          totalConnection
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
              metrics: ['kongHttpRequestsTotal.request', 'kongHttpRequestsTotal.dynamic','kongHttpRequestsTotal.failed' ],
              labels: [t('in-forge:plugins.kongApigateway.totalHttpRequests')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.dashboard.kongHttpRequestsTotal')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
