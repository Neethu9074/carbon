/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
//@ts-expect-error
import Columize from 'in-sdk/components/dashboard/Columize';
import { number, millis } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const serverCol = {
  title: t('in-forge:plugins.tuxedoAppTuxedoService.server'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('--')[0];
    }
  }
};
const releaseCol = {
  title: t('in-forge:plugins.tuxedoAppTuxedoService.release'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('--')[1];
    }
  }
};
const hostCol = {
  title: t('in-forge:plugins.tuxedoAppTuxedoService.host'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('--')[2];
    }
  }
};
const averageResponseTimeCol = {
  title: t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'servers.' + row.key + `.avgResTime`;
    },
    getContent: millis.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const throughputCol = {
  title: t('in-forge:plugins.tuxedoAppTuxedoService.throughput'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'servers.' + row.key + `.throughput`;
    },
    getContent: number.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function QueuesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const tuxedoServerIds = snapshot.getIn(['data', 'serverIds'], List());
  if (tuxedoServerIds.length === 0) {
    return null;
  }
  const rows = tuxedoServerIds.toArray().map((key: any) => {
    return {
      key: key,
      timeConfig,
      snapshotId,
      snapshot
    };
  });

  const cols = [serverCol, releaseCol, hostCol, averageResponseTimeCol, throughputCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoServerWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <Columize>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['servers.' + row.key + `.avgResTime`],
          labels: [t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime')],
          type: 'line',
          formatter: millis.detailed
        }}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['servers.' + row.key + `.throughput`],
          labels: [t('in-forge:plugins.tuxedoAppTuxedoService.throughput')],
          type: 'line',
          formatter: number.detailed
        }}
      />
    </Columize>
  );
}
