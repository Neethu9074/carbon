/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getSharedProcessorPools from 'in-phmc/subscriptions/getSharedProcessorPools';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { consoleIdUrlParameter } from 'in-phmc/navigation/urlParameters';
import { number, percentage } from 'in-services/formatters/number';
import { getIbmpSppDashboard } from 'in-phmc/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { t } from 'in-i18n';

const pathSegment = '/spp';
const matrixPrefix = 'spp.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-phmc:name'),
    getContent(item, props) {
      const systemId = props.systemId;
      const consoleId = props.consoleId;
      return <EntityLink label={item.label} href$={getIbmpSppDashboard(item.id, { systemId, consoleId })} />;
    }
  },
  {
    id: 'totalEntitledProcUnits',
    label: t('in-phmc:entitledProcNum'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="totalEntitledProcUnits"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'assignedProcUnits',
    label: t('in-phmc:assignedProc'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="assignedProcUnits"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'utilizedProcUnitsPercentage',
    label: t('in-phmc:utilizedProc'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="utilizedProcUnitsPercent"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'availableProcUnitsPercentage',
    label: t('in-phmc:availableProc'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="availableProcUnitsPercent"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'currentReservedProcessingUnits',
    label: t('in-phmc:reservedProc'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="currentReservedProcUnits"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters, consoleIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function SharedProcessorPool(props) {
  const { timeConfig, system } = props;
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      // consoleId={props.consoleId}
      systemId={system.id}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  systemId
}) {
  return getSharedProcessorPools({
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
      systemId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
