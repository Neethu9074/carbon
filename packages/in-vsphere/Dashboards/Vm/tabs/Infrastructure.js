/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getVsphereGuestHost from 'in-vsphere/subscriptions/getVsphereGuestHost';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import { t } from 'in-i18n';

const pathSegment = '/hosts';
const matrixPrefix = 'host.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-vsphere:dashboards.name'),
    sortable: false,
    getContent(item, { timeConfig }) {
      const snapshot = fromJS(item);
      return (
        <EntityLink
          snapshot={snapshot.id}
          label={getLabel(snapshot)}
          href$={getDashboardLink(item.id, {
            pathname: '/physical/dashboard',
            to: timeConfig.to,
            focusedMoment: timeConfig.to
          })}
        />
      );
    }
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
  return getVsphereGuestHost({
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
