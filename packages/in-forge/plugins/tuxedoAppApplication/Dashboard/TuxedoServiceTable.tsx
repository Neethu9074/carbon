/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getTuxedoServiceForApplication from '../subscriptions/getTuxedoServiceForApplication';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const tsLinkCol = {
  title: t('in-forge:plugins.tuxedoAppApplication.tsName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const averageResponseTimeCol = {
  title: t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return 'avgResTime';
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
      return row.key;
    },
    getMetricName() {
      return `throughput`;
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

  const tuxedoServices = useObservable(
    getTuxedoServiceForApplication({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(tuxedoService => getSnapshot(tuxedoService, timeConfig))).map(tuxedoServices =>
            success(tuxedoServices)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!tuxedoServices?.data) {
    return null;
  }

  const rows =
    tuxedoServices.data.map(tuxedoService => ({
      key: tuxedoService.get('id'),
      snapshot: tuxedoService,
      timeConfig
    })) || [];

  const cols = [tsLinkCol, averageResponseTimeCol, throughputCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoAppApplication.tuxedoServiceWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.key;
  const timeConfig = row.timeConfig;

  return (
    <Columize>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [`avgResTime`],
          labels: [t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime')],
          type: 'line',
          formatter: millis.detailed
        }}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [`throughput`],
          labels: [t('in-forge:plugins.tuxedoAppTuxedoService.throughput')],
          type: 'line',
          formatter: number.detailed
        }}
      />
    </Columize>
  );
}
