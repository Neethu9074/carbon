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

// { console.log(ingressBytes,"kongApigateway.ingressBytes");}
const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.service'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.bandWidth.get('service');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.bandWidth.get('route');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.consumer'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.bandWidth.get('consumer');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.ingressBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.bandWidth.get('ingressBytes');
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.egressBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.bandWidth.get('egressBytes');
      },
      getContent: bytes.compact
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
        const bandWidth = kongBandwidthBytes.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          bandWidth
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
              metrics: [
                'kongBandwidthBytes.' + row.key + '.ingressBytes',
                'kongBandwidthBytes.' + row.key + '.egressBytes'
              ],
              labels: [t('in-forge:plugins.kongApigateway.ingress'), t('in-forge:plugins.kongApigateway.egress')],
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
