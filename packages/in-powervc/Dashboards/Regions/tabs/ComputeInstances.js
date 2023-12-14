/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import PowerVCInstanceLabel from 'in-powervc/Dashboards/commonComponents/PowerVCInstanceLabel';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getPowerVCInstances from 'in-powervc/subscriptions/getPowerVCInstances';
import { megaBytes, number, percentage } from 'in-services/formatters/number';
import { regionIdUrlParameter } from 'in-powervc/navigation/urlParameters';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

const pathSegment = '/powervc-instances';
const matrixPrefix = 'instance.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-powervc:name'),
    getContent(item) {
      return <PowerVCInstanceLabel item={item} />;
    }
  },
  {
    id: 'hostName',
    label: t('in-powervc:hostName'),
    getContent(item) {
      return item.powervcItem.host;
    }
  },
  {
    id: 'IP',
    label: t('in-powervc:ip'),
    getContent(item) {
      return item.powervcItem.hostIP;
    }
  },
  {
    id: 'cpuUtilization',
    label: t('in-powervc:cpuUtilization'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpuUtilization"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'cpuResources',
    label: t('in-powervc:totalCpu'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpuResources"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'memoryResources',
    label: t('in-powervc:totalMemory'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="memoryResources"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={megaBytes.compact}
        />
      );
    }
  },
  {
    id: 'state',
    label: t('in-powervc:state'),
    getContent(item) {
      return item.powervcItem.state;
    }
  },
  {
    id: 'health',
    label: t('in-powervc:health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-powervc:dashboards.noDataAvailable.instanceTitle'),
    description: t('in-powervc:dashboards.noDataAvailable.instanceDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, regionIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function ComputeInstances(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} regionId={props.regionId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  regionId
}) {
  return getPowerVCInstances({
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
      regionId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
