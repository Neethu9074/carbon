/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { bytes } from 'in-services/formatters/number';
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
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.latency.get('route');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.50thPercentile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyFiftyPercentile');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.90thPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyPercentile');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.95thPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyFivePercentile');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.99thPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyninePercentile');
      },
      getContent: bytes.compact
    }
  },

];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'kongLatencymsBucketRoute')
    };
  },
  function Latency({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const kongLatencymsBucketRoute = data.get('raw_payload');
    const rows = kongLatencymsBucketRoute
      .keySeq()
      .toArray()
      .map(key => {
        const latency = kongLatencymsBucketRoute.get(key);
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
              formatter: bytes.compact,
              metrics: ['kong_kong_latency_ms_bucket_route' + row.key + '.service'],
              labels: [t('in-forge:plugins.kongApigateway.latencyPerService')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
           <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytes.compact,
              metrics: ['kong_kong_latency_ms_bucket_route' + row.key + '.route'],
              labels: [t('in-forge:plugins.kongApigateway.latencyPerRoute')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.latency')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
