/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import getTraceParticipants from 'in-subscription/application/getTraceParticipants';
import { latencyFixed } from 'in-services/formatters/number';
import ServerTable from 'in-components/tables/ServerTable';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './ServiceEndpointList.mless';

export default function ServiceEndpointList({ traceId, getColor, onListItemMouseEnter, onListItemMouseLeave }) {
  const columnDefinitions = [
    {
      id: 'serviceLabel',
      label: t('in-analyze:traceDetails.labelService'),
      getContent(item) {
        return (
          <div className={locals.cell}>
            <div style={{ background: getColor(item) }} className={locals.colorIndicator} />
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
      ellipsis: '1vw',
      getContent(item) {
        if (!item.endpoint) {
          return null;
        }

        return (
          <div className={locals.cell}>
            <SvgIcon type="lib_application_endpoint" className={locals.endpointIcon} />
            <Link
              className={locals.link}
              href$={getEndpointDashboard(item.endpoint.id, { serviceId: item.service.id })}
            >
              {item.endpoint.label}
            </Link>
          </div>
        );
      }
    },
    {
      id: 'aggregatedTime',
      label: t('in-analyze:traceDetails.labelAggregatedTime'),
      getContent(item) {
        return <span className={locals.aggregatedTime}>{latencyFixed.compact(item.aggregatedTime)}</span>;
      }
    },

    {
      id: 'errorCount',
      label: t('in-analyze:traceDetails.labelErroneousCalls'),
      getContent(item) {
        return <span>{item.errorCount ? item.errorCount : null}</span>;
      }
    }
  ];

  return (
    <ServerTable
      isSearchable={false}
      get={getTableData}
      defaultPageSize={5}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={{ traceId }}
      defaultOrderBy="aggregatedTime"
      defaultOrderDirection="DESC"
      size="compact"
      traceId={traceId}
      onRowMouseEnter={onListItemMouseEnter}
      onRowMouseLeave={onListItemMouseLeave}
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
