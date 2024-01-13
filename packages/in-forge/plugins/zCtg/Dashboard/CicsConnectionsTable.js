/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zCtg.cicsConnections.cicsServer'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zCtg.cicsConnections.requestsExecutedPerMinute'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `CICSTG_CICS_TS_Region_Details.${row.key}.requests_executed_per_minute`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zCtg.cicsConnections.averageResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `CICSTG_CICS_TS_Region_Details.${row.key}.average_response_time`;
      },
      getContent: timeByMillisTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zCtg.cicsConnections.connectionFailuresPerMinute'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `CICSTG_CICS_TS_Region_Details.${row.key}.connection_failures_per_minute`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zCtg.cicsConnections.lostConnectionsPerMinute'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `CICSTG_CICS_TS_Region_Details.${row.key}.lost_connections_per_minute`;
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'CicstgCicsTsRegionDetailsRawData', props.timeConfig)
    };
  },
  function CicsConnectionsTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const cicsConnectionskeys = data.get('raw_payload');
    if (cicsConnectionskeys.size === 0) {
      return null;
    }

    const rows = cicsConnectionskeys
      .map((cicsConnectionskey, key) => {
        return {
          key,
          cicsConnectionskey,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table withoutPadding cardTitle={t('in-forge:plugins.zCtg.cicsConnections.title')} cols={cols} rows={rows} />
    );
  }
);
