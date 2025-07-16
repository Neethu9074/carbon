/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import getXenServerVMs from 'in-xenserver/subscriptions/getXenServerVMs';
import { useXenServerEntityLink } from 'in-xenserver/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { OrderDirection, TimeConfig } from 'in-types';
import Capitalize from 'in-components/Capitalize';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

export const VmLabel = (item: VMRowData) => {
  const hostId = item.hostId;

  const getXenServerVmDashboard: any = useXenServerEntityLink('vm', { hostId });

  return <EntityLink label={item.name} href={getXenServerVmDashboard(item.id)} icon={resolveIcon(item)} />;
};
export interface VMRowData {
  name: string;
  hostId: string;
  id: string;
  state: string;
  vcpu: number;
  vmId: string;
}
function resolveIcon(props: { name: string }) {
  const guestFullName = get(props, ['name'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-xenserver:dashboards.vm.name'),
    sortable: true,
    getContent(item: VMRowData) {
      return <VmLabel {...item} />;
    }
  },
  {
    id: 'state',
    label: t('in-xenserver:dashboards.vm.state'),
    sortable: true,
    getContent(item: VMRowData) {
      return <Capitalize>{get(item, ['state'], valueMissingPlaceholder)}</Capitalize>;
    }
  },
  {
    id: 'vcpu',
    label: t('in-xenserver:dashboards.vm.vcpu'),
    getContent(item: VMRowData) {
      return item.vcpu || valueMissingPlaceholder;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.xenServerVM,
    title: t('in-xenserver:noMonitoringDataFound'),
    description: t('in-xenserver:noMonitoringDataFound')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function XenServerVirtualMachines(props: { timeConfig: any; hostId: any }) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={props.hostId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig,
  hostId
}: {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: OrderDirection;
  timeConfig: TimeConfig;
  hostId: string;
}) {
  return getXenServerVMs({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      name: query,
      hostId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
