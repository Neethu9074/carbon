/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getOpenstackHypervisors from 'in-openstack/subscriptions/getOpenstackHypervisors';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useOpenstackHypervisorDashboard } from 'in-openstack/navigation/paths';
import { regionIdUrlParameter } from 'in-openstack/navigation/urlParameters';
import { megaBytes, number } from 'in-services/formatters/number';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { t } from 'in-i18n';

const pathSegment = '/openstack-hypervisors';
const matrixPrefix = 'hypervisor.';

function LabelContent({ label, id, regionId }) {
  const getOpenstackHypervisorDashboard = useOpenstackHypervisorDashboard();

  return <EntityLink label={label} href={getOpenstackHypervisorDashboard(id, { regionId })} />;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-openstack:name'),
    getContent(item, props) {
      const regionId = props.regionId;

      return <LabelContent label={item.label} id={item.id} regionId={regionId} />;
    }
  },
  {
    id: 'hostIP',
    label: t('in-openstack:hostIP'),
    getContent(item) {
      return item.openstackItem.hostIP;
    }
  },
  {
    id: 'type',
    label: t('in-openstack:type'),
    getContent(item) {
      return item.openstackItem.type;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-openstack:cpuUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpuUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  },
  {
    id: 'cpuResources',
    label: t('in-openstack:totalCpu'),
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
    label: t('in-openstack:memoryUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="memoryUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={megaBytes.compact}
        />
      );
    }
  },
  {
    id: 'memoryResources',
    label: t('in-openstack:totalMemory'),
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
    label: t('in-openstack:storageUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="storageUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.detailed}
        />
      );
    }
  },
  {
    id: 'storageResources',
    label: t('in-openstack:totalStorage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="storageResources"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.detailed}
        />
      );
    }
  },
  {
    id: 'instanceCount',
    label: t('in-openstack:instanceCount'),
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
    label: t('in-openstack:currentWorkload'),
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
    label: t('in-openstack:status'),
    sortable: true,
    getContent(item) {
      return item.openstackItem.status;
    }
  },
  {
    id: 'state',
    label: t('in-openstack:state'),
    getContent(item) {
      return item.openstackItem.state;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-openstack:dashboards.noDataAvailable.hypervisorTitle'),
    description: t('in-openstack:dashboards.noDataAvailable.hypervisorDescription')
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
  return getOpenstackHypervisors({
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
