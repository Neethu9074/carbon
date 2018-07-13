import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import getTraceParticipants from 'in-subscription/application/getTraceParticipants';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { millis, number } from 'in-services/formatters/number';
import ServerTable from 'in-components/tables/ServerTable';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './ServiceEndpointList.mless';

export default function ServiceEndpointList({ traceId, getColor, onListItemMouseEnter, onListItemMouseLeave }) {
  const columnDefinitions = [
    {
      id: 'serviceLabel',
      label: 'Service',
      getContent(item) {
        return (
          <div className={locals.cell}>
            <div style={{ background: getColor(item) }} className={locals.colorIndicator} />
            <SvgIcon type="lib_application_service" width={24} height={24} className={locals.serviceIcon} />
            <Link className={locals.link} href$={getServiceDashboard(item.service.id)}>
              {item.service.label}
            </Link>
          </div>
        );
      }
    },
    {
      id: 'endpointLabel',
      label: 'Endpoint',
      getContent(item) {
        return (
          <div className={locals.cell}>
            <SvgIcon type="lib_application_endpoint" width={24} height={24} className={locals.endpointIcon} />
            <Link className={locals.link} href$={getEndpointDashboard(item.endpoint.id)}>
              {item.endpoint.label}
            </Link>
          </div>
        );
      }
    },
    {
      id: 'callCount',
      label: 'Calls',
      getContent(item) {
        return <span className={locals.metricValue}>{number.compact(item.callCount)}</span>;
      }
    },
    {
      id: 'aggregatedTime',
      label: 'Aggregated Time',
      getContent(item) {
        return <span className={locals.aggregatedTime}>{millis.fixedCompact(item.aggregatedTime)}</span>;
      }
    },

    {
      id: 'errorCount',
      label: 'Errors',
      getContent(item) {
        return <ErrorIndicator errorCount={item.errorCount} />;
      }
    }
  ];

  return (
    <ServerTable
      tableInCard
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
