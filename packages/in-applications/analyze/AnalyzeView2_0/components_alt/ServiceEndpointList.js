/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import getTraceParticipants from 'in-applications/subscriptions/getTraceParticipants';
import { latencyFixed } from 'in-services/formatters/number';
import ServerTable from 'in-components/tables/ServerTable';
import { t } from 'in-i18n';

import locals from './ServiceEndpointList.mless';

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: t('in-analyze:traceDetails.labelService'),
    sortable: false,
    getContent(item) {
      return (
        <div className={locals.cell}>
          <SvgIcon type="lib_application_service" className={locals.serviceIcon} />
          <Link className={locals.link} href$={getServiceDashboard(item.service.id)}>
            {item.service.label}
          </Link>
        </div>
      );
    }
  },
  {
    id: 'endpointLabel',
    label: t('in-analyze:traceDetails.labelEndpoint'),
    sortable: false,
    getContent(item) {
      return (
        <div className={locals.cell}>
          <SvgIcon type="lib_application_endpoint" className={locals.endpointIcon} />
          <Link className={locals.link} href$={getEndpointDashboard(item.endpoint.id, { serviceId: item.service.id })}>
            {item.endpoint.label}
          </Link>
        </div>
      );
    }
  },
  {
    id: 'aggregatedTime',
    label: t('in-analyze:traceDetails.labelAggregatedTime'),
    width: '10rem',
    widthInAbsoluteUnit: true,
    getContent(item) {
      return <span className={locals.aggregatedTime}>{latencyFixed.compact(item.aggregatedTime)}</span>;
    }
  },
  {
    id: 'errorCount',
    label: t('in-analyze:traceDetails.labelErroneousCalls'),
    width: '10rem',
    widthInAbsoluteUnit: true,
    getContent(item) {
      return <span>{item.errorCount ? item.errorCount : null}</span>;
    }
  }
];

export default function ServiceEndpointList({ traceId }) {
  return (
    <ServerTable
      isSearchable={false}
      get={getTableData}
      defaultPageSize={20}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={{ traceId }}
      defaultOrderBy="aggregatedTime"
      defaultOrderDirection="DESC"
      size="compact"
      traceId={traceId}
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, traceId }) {
  return getTraceParticipants({
    traceId,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    }
  });
}
