/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import PhysicalDashboardEntityLink from 'in-components/tables/sharedComponents/PhysicalDashboardEntityLink';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getNutanixGuestHost from 'in-nutanix/subscriptions/getNutanixGuestHost';
import { t } from 'in-i18n';

const pathSegment = '/hosts';
const matrixPrefix = 'host.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-nutanix:dashboards.name'),
    sortable: false,
    getContent: (item, { timeConfig }) => <PhysicalDashboardEntityLink item={item} timeConfig={timeConfig} />
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Infrastructure(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} vmId={props.vmId} />;
}

function getTableData({ page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig, vmId }) {
  return getNutanixGuestHost({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      vmId,
      timeConfig
    }
  });
}
