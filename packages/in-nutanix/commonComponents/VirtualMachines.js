/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { TableEntityCounter } from '@instana/legacy';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { datacenterIdUrlParameter } from 'in-nutanix/navigation/urlParameters';
import { MemoryTotal } from 'in-nutanix/commonComponents/MemoryTotal';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import getNutanixVms from 'in-nutanix/subscriptions/getNutanixVms';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import Capitalize from 'in-components/Capitalize';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

export const VmLabel = ({ item }) => {
  const hostId = item.hostId;
  const datacenterId = item.datacenterId;

  const getNutanixVmDashboard = useNutanixEntityLink('vm', { hostId, datacenterId });

  return <EntityLink label={item.label} href={getNutanixVmDashboard(item.id)} icon={resolveIcon(item)} />;
};

const columnDefinitions = [
  {
    id: 'id',
    label: t('in-nutanix:name'),
    getContent(item) {
      return <Capitalize>{get(item, ['id'], valueMissingPlaceholder)}</Capitalize>;
    }
  },
  {
    id: 'type',
    label: t('in-nutanix:type'),
    sortable: true,
    getContent(item) {
      return <Capitalize>{get(item, ['machineType'], valueMissingPlaceholder)}</Capitalize>;
    }
  },
  {
    id: 'state',
    label: t('in-nutanix:dashboards.state'),
    sortable: true,
    getContent(item) {
      return <Capitalize>{get(item, ['state'], valueMissingPlaceholder)}</Capitalize>;
    }
  },
  {
    id: 'noOfCpus',
    label: t('in-nutanix:dashboards.noOfCpus'),
    sortable: true,
    getContent(item) {
      return <TableEntityCounter count={item.noOfCpus} />;
    }
  },
  {
    id: 'noOfCores',
    label: t('in-nutanix:dashboards.noOfCores'),
    getContent(item) {
      return <TableEntityCounter count={item.noOfCores} />;
    }
  },
  {
    id: 'memory',
    label: t('in-nutanix:memoryAllocated'),
    sortable: true,
    getContent(item) {
      return <MemoryTotal count={item.memory} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.nutanixVM,
    title: t('in-nutanix:dashboards.noDataAvailable.nutanixVMTitle'),
    description: t('in-nutanix:dashboards.noDataAvailable.nutanixVMDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function nutanixVirtualMachines(props) {
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={props.timeConfig}
      datacenterId={isWithinDatacenter(props) ? props.datacenterId : undefined}
      hostId={props.hostId}
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
  datacenterId,
  hostId
}) {
  return getNutanixVms({
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
      hostId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

function resolveIcon(props) {
  const guestFullName = get(props, ['guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}

function isWithinDatacenter(props) {
  const pathname = get(props, ['location', 'pathname'], '/nutanix/datacenter/vms');
  return pathname && pathname.toLowerCase().includes('datacenter');
}
