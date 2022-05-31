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
import { getOpenstackHypervisorDashboard } from 'in-openstack/navigation/paths';
import { regionIdUrlParameter } from 'in-openstack/navigation/urlParameters';
import { number, percentage } from 'in-services/formatters/number';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { t } from 'in-i18n';

const pathSegment = '/openstack-hypervisors';
const matrixPrefix = 'hypervisor.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-vsphere:dashboards.name'),
    getContent(item) {
      const regionId = item.regionId;
      return <EntityLink label={item.label} href$={getOpenstackHypervisorDashboard(item.id, { regionId })} />;
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
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'cpuResources',
    label: t('in-openstack:cpuResources'),
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
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'memoryResources',
    label: t('in-openstack:memoryResources'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="memoryResources"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    // plugin: plugins.openstackHypervisor,
    title: t('in-vsphere:dashboards.noDataAvailable.vsphereHostTitle'),
    description: t('in-vsphere:dashboards.noDataAvailable.vsphereHostDescription')
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
