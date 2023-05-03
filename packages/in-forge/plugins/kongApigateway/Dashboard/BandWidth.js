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
      getContent: number.compact
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
    title: t('in-forge:plugins.kongApigateway.bytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalConnection.get('bytes');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'kongBandwidthBytes')
    };
  },
  function BandWidth({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const kongBandwidthBytes = data.get('raw_payload');
    const rows = kongBandwidthBytes
      .keySeq()
      .toArray()
      .map(key => {
        const BandWidth = kongBandwidthBytes.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          BandWidth
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
              metrics: ['nginxHttpCurrentConnections.' + row.key + '.connections'],
              labels: [t('in-forge:plugins.kongApigateway.kongbandwidth')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.kongBandwidth')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
