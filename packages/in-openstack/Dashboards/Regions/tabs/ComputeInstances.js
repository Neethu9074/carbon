/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getOpenstackInstances from 'in-openstack/subscriptions/getOpenstackInstances';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getOpenstackInstanceDashboard } from 'in-openstack/navigation/paths';
import { regionIdUrlParameter } from 'in-openstack/navigation/urlParameters';
import { bytes, number, percentage } from 'in-services/formatters/number';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/openstack-instances';
const matrixPrefix = 'instance.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-openstack:dashboards.name'),
    getContent(item, props) {
      const regionId = props.regionId;
      return <EntityLink label={item.label} href$={getOpenstackInstanceDashboard(item.id, { regionId })} />;
    }
  },
  {
    id: 'project',
    label: t('in-openstack:project'),
    getContent(item) {
      return item.openstackItem.project;
    }
  },
  {
    id: 'host',
    label: t('in-openstack:hostName'),
    getContent(item) {
      return item.openstackItem.host;
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
    id: 'totalCpu',
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
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'totalMemory',
    label: t('in-openstack:totalMemory'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="memoryResources"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytes.detailed}
        />
      );
    }
  },
  {
    id: 'user',
    label: t('in-openstack:user'),
    getContent(item) {
      return item.openstackItem.user;
    }
  },
  {
    id: 'flavor',
    label: t('in-openstack:flavor'),
    getContent(item) {
      return item.openstackItem.flavor;
    }
  },
  {
    id: 'availabilityZone',
    label: t('in-openstack:availabilityZone'),
    getContent(item) {
      return item.openstackItem.availabilityZone;
    }
  },
  {
    id: 'status',
    label: t('in-openstack:status'),
    getContent(item) {
      return item.openstackItem.status;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.openstackHypervisor,
    title: t('in-openstack:dashboards.noDataAvailable.instanceTitle'),
    description: t('in-openstack:dashboards.noDataAvailable.instanceDescription')
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
  return getOpenstackInstances({
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
