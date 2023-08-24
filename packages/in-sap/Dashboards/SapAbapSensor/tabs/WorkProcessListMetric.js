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
    title: t('in-sap:dashboards.wpPID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.workprocessList.get('pid');
      }
    }
  },
  {
    title: t('in-sap:dashboards.workProcessStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.workprocessList.get('wpStatus');
      }
    }
  },
  {
    title: t('in-sap:dashboards.workProcessType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.workprocessList.get('wpType');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'workprocessList')
    };
  },
  function WorkProcessListMetric({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const wpList = data.get('raw_payload', []);
    const rows = wpList
      .keySeq()
      .toArray()
      .map(key => {
        const workprocessList = wpList.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          workprocessList
        };
      });

    function getDetails(row) {
      return (
        <div>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [
                'workprocessList.' + row.key + '.wpIStatus',
                'workprocessList.' + row.key + '.wpDumps',
                'workprocessList.' + row.key + '.wpIType',
                'workprocessList.' + row.key + '.wpRestart',
                'workprocessList.' + row.key + '.wpMutex'
              ],
              labels: [
                t('in-sap:dashboards.workProcessStatus'),
                t('in-sap:dashboards.workProcessDumps'),
                t('in-sap:dashboards.workProcessType'),
                t('in-sap:dashboards.workProcessRestart'),
                t('in-sap:dashboards.workProcessMutex')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
      );
    }
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.workProcessStats')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
