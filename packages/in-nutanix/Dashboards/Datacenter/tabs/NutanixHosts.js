/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TableEntityCounter } from '@instana/legacy';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { datacenterIdUrlParameter } from 'in-nutanix/navigation/urlParameters';
import getNutanixHosts from 'in-nutanix/subscriptions/getNutanixHosts';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/nutanix-hosts';
const matrixPrefix = 'vhost.';

export const NutanixHostLink = ({ item }) => {
  const datacenterId = item.datacenterId;

  const getNutanixHostDashboard = useNutanixEntityLink('host', { datacenterId });

  return <EntityLink label={item.label} href={getNutanixHostDashboard(item.id)} icon="lib_linux" />;
};

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-nutanix:dashboards.name'),
    getContent(item) {
      return item.label;
    }
  },
  {
    id: 'vms',
    label: t('in-nutanix:dashboards.virtualMachines'),
    getContent(item) {
      return <TableEntityCounter icon="lib_nutanix_vm" count={item.noOfVms} />;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-nutanix:dashboards.cpuUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpuUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.detailed}
        />
      );
    }
  },
  {
    id: 'cpuTotal',
    label: t('in-nutanix:dashboards.noOfCpus'),
    sortable: true,
    getContent(item) {
      return <TableEntityCounter count={item.noOfCpus} />;
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-nutanix:dashboards.memoryUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="memoryUsage"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.detailed}
        />
      );
    }
  },
  {
    id: 'memTotal',
    label: t('in-nutanix:dashboards.noOfDisks'),
    sortable: true,
    getContent(item) {
      return <TableEntityCounter count={item.noOfDisks} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.NutanixHost,
    title: t('in-nutanix:dashboards.noDataAvailable.nutanixHostTitle'),
    description: t('in-nutanix:dashboards.noDataAvailable.nutanixHostDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function NutanixHosts(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} datacenterId={props.datacenterId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  datacenterId
}) {
  return getNutanixHosts({
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
      datacenterId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
