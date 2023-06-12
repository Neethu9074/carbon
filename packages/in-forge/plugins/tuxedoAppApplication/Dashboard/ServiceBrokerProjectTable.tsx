/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getServiceBrokerProjectForApplication from '../subscriptions/getServiceBrokerProjectForApplication';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
//@ts-expect-error
import Columize from 'in-sdk/components/dashboard/Columize';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const sbpNameCol = {
  title: t('in-forge:plugins.tuxedoAppApplication.sbpName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};
const averageResponseTimeCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return `avgResTime`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const throughputCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput'),
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
const errorsCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.errors'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return `errors`;
    },
    getContent: number.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const rsfuCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.rsfu'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return `rsfu`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const rqfuCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.rqfu'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return `rqfu`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function QueuesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  const serviceBrokerProjects = useObservable(
    getServiceBrokerProjectForApplication({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(serviceBrokerProject => getSnapshot(serviceBrokerProject, timeConfig))).map(
            serviceBrokerProjects => success(serviceBrokerProjects)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!serviceBrokerProjects?.data) {
    return null;
  }

  const rows =
    serviceBrokerProjects.data.map(serviceBrokerProject => ({
      key: serviceBrokerProject.get('id'),
      snapshot: serviceBrokerProject,
      timeConfig
    })) || [];

  const cols = [sbpNameCol, averageResponseTimeCol, throughputCol, errorsCol, rsfuCol, rqfuCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoAppApplication.svcBrokerProjectWithCount', { len: rows.length })}
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
          labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime')],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [`throughput`],
          labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput')],
          type: 'line',
          formatter: number.detailed
        }}
      />
    </Columize>
  );
}
