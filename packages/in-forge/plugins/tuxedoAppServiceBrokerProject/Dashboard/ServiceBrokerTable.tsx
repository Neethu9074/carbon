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
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const serviceBrokerCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.serviceBroker'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key;
    }
  }
};
const averageResponseTimeCol = {
  title: t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'svcBrokers.' + row.key + `.avgResTime`;
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
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'svcBrokers.' + row.key + `.throughput`;
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
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'svcBrokers.' + row.key + `.rsfu`;
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
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'svcBrokers.' + row.key + `.rqfu`;
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
  const serviceBrokerIds = snapshot.getIn(['data', 'serviceBrokerIds'], List());
  if (serviceBrokerIds.length === 0) {
    return null;
  }
  const rows = serviceBrokerIds.toArray().map((key: any) => {
    return {
      key: key,
      timeConfig,
      snapshotId,
      snapshot
    };
  });

  const cols = [serviceBrokerCol, averageResponseTimeCol, throughputCol, rsfuCol, rqfuCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoAppServiceBrokerProject.serviceBrokerWithCount', { len: rows.length })}
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
    <>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['svcBrokers.' + row.key + `.avgResTime`],
            labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime')],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['svcBrokers.' + row.key + `.throughput`],
            labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput')],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['svcBrokers.' + row.key + `.rsfu`],
            labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.rsfu')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            metrics: ['svcBrokers.' + row.key + `.rqfu`],
            labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.rqfu')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </Columize>
    </>
  );
}
