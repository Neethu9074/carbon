/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.sharedDictionary'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedDictionary.get('sharedDict');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedDictionary.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.totalCapacity'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedDictionary.get('totalBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.allocatedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedDictionary.get('allocatedBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.allocatedBytesPercent'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedDictionary.get('percentage');
      },
      getContent: percentage.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'memoryLuaSharedDictBytes')
    };
  },
  function SharedDictionary({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const memoryLuaSharedDictByte = data.get('raw_payload');
    const rows = memoryLuaSharedDictByte
      .keySeq()
      .toArray()
      .map(key => {
        const sharedDictionary = memoryLuaSharedDictByte.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          sharedDictionary
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
              formatter: percentage.detailed,
              metrics: ['memoryLuaSharedDictBytes.' + row.key + '.percentage'],
              labels: [t('in-forge:plugins.kongApigateway.allocatedBytesPercent')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.dashboard.sharedDictionaryAllocated')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
