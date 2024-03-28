/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import PhysicalDashboardEntityLink from 'in-components/tables/sharedComponents/PhysicalDashboardEntityLink';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import getTuxedoIPCQueues from '../subscriptions/getTuxedoIPCQueues';
import { number, percentage } from 'in-services/formatters/number';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const pathSegment = '';
const matrixPrefix = '';

const columnDefinitions = [
  {
    id: 'id',
    label: t('in-forge:plugins.tuxedoIpcQueue.queueId'),
    getContent(item: any, props: any) {
      return <PhysicalDashboardEntityLink item={item} timeConfig={props.timeConfig} />;
    }
  },
  {
    id: 'qnum',
    label: t('in-forge:plugins.tuxedoIpcQueue.maxMessages'),
    sortable: true,
    defaultOrderDirection: 'DESC',
    getContent(item: any, props: any, columnId: any) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="qnum"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    },
    getTimeWindowAggregation() {
      return 'max';
    }
  },
  {
    id: 'senderServer',
    label: t('in-forge:plugins.tuxedoIpcQueue.senderServer'),
    getContent(item: any) {
      return <span>{get(item, ['senderServer'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'senderPID',
    label: t('in-forge:plugins.tuxedoIpcQueue.senderPID'),
    getContent(item: any) {
      return <span>{get(item, ['senderPID'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'receiverServer',
    label: t('in-forge:plugins.tuxedoIpcQueue.receiverServer'),
    getContent(item: any) {
      return <span>{get(item, ['receiverServer'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'receiverPID',
    label: t('in-forge:plugins.tuxedoIpcQueue.receiverPID'),
    getContent(item: any) {
      return <span>{get(item, ['receiverPID'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'usage',
    label: t('in-forge:plugins.tuxedoIpcQueue.usage'),
    sortable: true,
    getContent(item: any, props: any, columnId: any) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="usage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    },
    getTimeWindowAggregation() {
      return 'max';
    }
  },
  {
    id: 'cbytes',
    label: t('in-forge:plugins.tuxedoIpcQueue.usedBytes'),
    sortable: true,
    getContent(item: any, props: any, columnId: any) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cbytes"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    },
    getTimeWindowAggregation() {
      return 'max';
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'qnum',
  defaultOrderDirection: 'DESC',
  defaultPageSize: 10,
  pathSegment,
  matrixPrefix
});

export default function QueuesTableSorted({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  const [queuesCount, setQueuescount] = useState<number>(0);
  const result =
    useObservable(
      getTableData({ timeConfig, snapshotId }).filter((result: any) => {
        if (result && result.data) {
          setQueuescount(result.data.totalHits);
          return result.data.totalHits;
        }
      }),
      []
    ) ?? pendingResult;

  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      snapshotId={snapshot.get('id')}
      cardTitle={t('in-forge:plugins.tuxedoIpcQueue.queueWithCount', {
        len: result.progress.loading ? 0 : queuesCount
      })}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'qnum',
  orderDirection = 'DESC',
  timeConfig,
  snapshotId
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
  timeConfig: any;
  snapshotId: any;
}) {
  return getTuxedoIPCQueues({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      snapshotId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
