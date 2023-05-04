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
        return row.totalHttpRequest.get('service');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.totalHttpRequest.get('route');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.code'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.totalHttpRequest.get('code');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.source'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.totalHttpRequest.get('source');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.consumer'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.totalHttpRequest.get('consumer');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.totalNumberofRequests'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalHttpRequest.get('requests');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'kongHttpRequestsTotal')
    };
  },
  function TotalHttpRequest({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const kongHttpRequestsTotal = data.get('raw_payload');
    const rows = kongHttpRequestsTotal
      .keySeq()
      .toArray()
      .map(key => {
        const totalHttpRequest = kongHttpRequestsTotal.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          totalHttpRequest
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
              metrics: ['kongHttpRequestsTotal.' + row.key + '.requests'],
              labels: [t('in-forge:plugins.kongApigateway.totalNumberofRequests')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.totalHttpRequests')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
