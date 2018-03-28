import React from 'react';

import getTraceParticipants from 'in-subscription/application/getTraceParticipants';
import ServerTable from 'in-components/tables/ServerTable';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ServiceEndpointList.mless';

export default function ServiceEndpointList({ traceId, getColor }) {
  const columnDefinitions = [
    {
      id: 'serviceLabel',
      label: 'Service',
      getContent(item) {
        return (
          <div className={locals.cell}>
            <div style={{ background: getColor(item) }} className={locals.colorIndicator} />
            <SvgIcon type="app_service" width={16} height={16} className={locals.serviceIcon} color="#47626A" />
            <span className={locals.label}>{item.service.label}</span>
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
            <SvgIcon type="app_endpoint" width={16} height={16} className={locals.endpointIcon} color="#47626A" />
            {item.endpoint.label}
          </div>
        );
      }
    },
    {
      id: 'aggregatedTime',
      label: 'Aggregated Time',
      getContent(item) {
        return (
          <div className={locals.cell}>
            <span className={locals.aggregatedTime}>{item.aggregatedTime}</span>
            <SvgIcon type="time" width={12} height={12} className={locals.timeIcon} color="#47626A" />
          </div>
        );
      }
    },

    {
      id: 'errorCount',
      label: 'Errors',
      getContent(item) {
        return <div className={locals.errorIndicator}>{item.errorCount}</div>;
      }
    }
  ];

  return (
    <ServerTable
      get={getTableData}
      pageSize={10}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={{ traceId }}
      defaultOrderBy="serviceLabel"
      defaultOrderDirection="ASC"
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
