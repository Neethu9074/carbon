/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { timeByMillisZeroDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
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
    title: t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyFiftyPercentile');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyPercentile');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyfivePercentile');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.latency.get('kongLatencyNinetyninePercentile');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'kongKongLatencyMsBucketRoute')
    };
  },
  function KongKongLatencyRoute({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const kongKongLatencyMsBucketRoute = data.get('raw_payload');
    const rows = kongKongLatencyMsBucketRoute
      .keySeq()
      .toArray()
      .map(key => {
        const latency = kongKongLatencyMsBucketRoute.get(key);
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
              formatter: timeByMillisZeroDecimalPlaces,
              metrics: [
                'kongKongLatencyMsBucketRoute.' + row.key + '.kongLatencyFiftyPercentile',
                'kongKongLatencyMsBucketRoute.' + row.key + '.kongLatencyNinetyPercentile',
                'kongKongLatencyMsBucketRoute.' + row.key + '.kongLatencyNinetyfivePercentile',
                'kongKongLatencyMsBucketRoute.' + row.key + '.kongLatencyNinetyninePercentile'
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
        cardTitle={t('in-forge:plugins.kongApigateway.kongKonglatencyRoute')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
