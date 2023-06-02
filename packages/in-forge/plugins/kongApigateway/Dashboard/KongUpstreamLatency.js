/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { timeByMicroTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
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
        return row.latency.get('service');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyFiftyPercentile');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyPercentile');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyfivePercentile');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyninePercentile');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'kongUpstreamLatencyMsBucketService')
    };
  },
  function KongRequestLatency({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const kongUpstreamLatencyMsBucketService = data.get('raw_payload');
    const rows = kongUpstreamLatencyMsBucketService
      .keySeq()
      .toArray()
      .map(key => {
        const latency = kongUpstreamLatencyMsBucketService.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          latency
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
              formatter: timeByMicroTwoDecimalPlaces,
              metrics: [
                'kongUpstreamLatencyMsBucketService.' + row.key + '.kongLatencyFiftyPercentile',
                'kongUpstreamLatencyMsBucketService.' + row.key + '.kongLatencyNinetyPercentile',
                'kongUpstreamLatencyMsBucketService.' + row.key + '.kongLatencyNinetyfivePercentile',
                'kongUpstreamLatencyMsBucketService.' + row.key + '.kongLatencyNinetyninePercentile'
              ],
              labels: [
                t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
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
        cardTitle={t('in-forge:plugins.kongApigateway.upstreamLatency')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
