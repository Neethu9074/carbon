/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { consoleIdUrlParameter } from 'in-phmc/navigation/urlParameters';
import { percentage, number } from 'in-services/formatters/number';
import { useIbmpLparDashboard } from 'in-phmc/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import getLpars from 'in-phmc/subscriptions/getLpars';
import { t } from 'in-i18n';

const pathSegment = '/lpar';
const matrixPrefix = 'lpar.';

function EntityLinkLabel({ item, systemId, consoleId }) {
  const getIbmpLparDashboard = useIbmpLparDashboard();

  return <EntityLink label={item.label} href={getIbmpLparDashboard(item.id, { systemId, consoleId })} />;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-phmc:name'),
    getContent(item, props) {
      const systemId = props.systemId;
      const consoleId = props.consoleId;

      return <EntityLinkLabel item={item} systemId={systemId} consoleId={consoleId} />;
    }
  },
  {
    id: 'entitledProcUnitsPercentage',
    label: t('in-phmc:entitledProc'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="entitledProcUnitsPercentage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'logicalMem',
    label: t('in-phmc:memory'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="logicalMem"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'maxVirtualProcessors',
    label: t('in-phmc:maxVirtualProcessor'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="maxVirtualProcessors"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'mode',
    label: t('in-phmc:mode'),
    getContent(item) {
      return item.mode;
    }
  },
  {
    id: 'state',
    label: t('in-phmc:dashboards.state'),
    getContent(item) {
      return item.state;
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

export default function Partitions(props) {
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={props.timeConfig}
      consoleId={props.consoleId}
      systemId={props.systemId}
      sharedProcessorPoolId={props.sharedProcessorPoolId}
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
  systemId,
  sharedProcessorPoolId
}) {
  return getLpars({
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
      sharedProcessorPoolId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
