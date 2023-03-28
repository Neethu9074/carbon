/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.pid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.workersLuaVm.get('pid');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.workersLuaVm.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.allocatedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.workersLuaVm.get('bytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'memoryWorkersLuaVmsBytes')
    };
  },
  function WorkerLuaVM({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const memoryWorkersLuaVmsByte = data.get('raw_payload');
    const rows = memoryWorkersLuaVmsByte
      .keySeq()
      .toArray()
      .map(key => {
        const workersLuaVm = memoryWorkersLuaVmsByte.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          workersLuaVm
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
              formatter: bytesTwoDecimalPlaces,
              metrics: ['memoryWorkersLuaVmsBytes.' + row.key + '.bytes'],
              labels: [t('in-forge:plugins.kongApigateway.allocatedBytes')],
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
        cardTitle={t('in-forge:plugins.kongApigateway.dashboard.workerLua')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);
