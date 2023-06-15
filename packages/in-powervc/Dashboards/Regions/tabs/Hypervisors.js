/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import PowerVCHypervisorLabel from 'in-powervc/Dashboards/commonComponents/PowerVCHypervisorLabel';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { bytes, megaBytes, number, percentage } from 'in-services/formatters/number';
import getPowerVCHypervisors from 'in-powervc/subscriptions/getPowerVCHypervisors';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { regionIdUrlParameter } from 'in-powervc/navigation/urlParameters';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

const pathSegment = '/powervc-hypervisors';
const matrixPrefix = 'hypervisor.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-powervc:name'),
    getContent(item) {
      return <PowerVCHypervisorLabel item={item} />;
    }
  },
  {
    id: 'id',
    label: t('in-powervc:id'),
    getContent(item) {
      return item.powervcItem.id;
    }
  },
  {
    id: 'hostIP',
    label: t('in-powervc:hostIP'),
    getContent(item) {
      return item.powervcItem.hostIP;
    }
  },
  {
    id: 'type',
    label: t('in-powervc:type'),
    getContent(item) {
      return item.powervcItem.type;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-powervc:cpuUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpuUsage"
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
    id: 'memoryUsage',
    label: t('in-powervc:memoryUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="memoryUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
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
    id: 'storageUsage',
    label: t('in-powervc:storageUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="storageUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'storageResources',
    label: t('in-powervc:totalStorage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="storageResources"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytes.detailed}
        />
      );
    }
  },
  {
    id: 'instanceCount',
    label: t('in-powervc:instanceCount'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="instanceCount"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'currentWorkload',
    label: t('in-powervc:currentWorkload'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="currentWorkload"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'status',
    label: t('in-powervc:status'),
    sortable: true,
    getContent(item) {
      return item.powervcItem.status;
    }
  },
  {
    id: 'state',
    label: t('in-powervc:state'),
    getContent(item) {
      return item.powervcItem.state;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-powervc:dashboards.noDataAvailable.hypervisorTitle'),
    description: t('in-powervc:dashboards.noDataAvailable.hypervisorDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, regionIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Hypervisors(props) {
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
  return getPowerVCHypervisors({
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
