/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zDb2.cicsExceptions.cicsId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zDb2.cicsExceptions.totalThreadUtilization'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `DB2_CICS_Exceptions.${row.key}.total_thread_utilization`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zDb2.cicsExceptions.poolThreadUtilization'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `DB2_CICS_Exceptions.${row.key}.pool_thread_utilization`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'CicsExceptionsRawData', props.timeConfig)
    };
  },
  function CicsExceptionsTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const cicsExceptions = data.get('raw_payload');
    if (cicsExceptions.size === 0) {
      return null;
    }

    const rows = cicsExceptions
      .map((cicsException, key) => {
        return {
          key,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zDb2.cicsExceptions.title', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'DB2_CICS_Exceptions.' + row.key + '.total_threads_maximum',
            'DB2_CICS_Exceptions.' + row.key + '.total_threads_inuse'
          ],
          labels: [
            t('in-forge:plugins.zDb2.cicsExceptions.totalThreadsMaximum'),
            t('in-forge:plugins.zDb2.cicsExceptions.totalThreadsInUse')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'DB2_CICS_Exceptions.' + row.key + '.pool_thread_maximum',
            'DB2_CICS_Exceptions.' + row.key + '.pool_threads_inuse',
            'DB2_CICS_Exceptions.' + row.key + '.pool_thread_waits'
          ],
          labels: [
            t('in-forge:plugins.zDb2.cicsExceptions.poolThreadMaximum'),
            t('in-forge:plugins.zDb2.cicsExceptions.poolThreadsInUse'),
            t('in-forge:plugins.zDb2.cicsExceptions.poolThreadWaits')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
