/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { useLinkToEndpointDashboard, useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { latency, number, withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import getTraceParticipants from 'in-applications/subscriptions/getTraceParticipants';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ServiceEndpointList.mless';

function ServiceLabelContent({ getColor, item, onClickTracker }) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  return (
    <div className={locals.cell}>
      <div style={{ background: getColor(item) }} className={locals.colorIndicator} />
      <SvgIcon type="lib_application_service" className={locals.serviceIcon} />
      <Link
        className={locals.link}
        href={getLinkToServiceDashboard({ serviceId: item.service.id })}
        onClick={() => onClickTracker?.({ service: item.service.label })}
      >
        {item.service.label}
      </Link>
    </div>
  );
}

function EndpointLabelContent({ item, onClickTracker }) {
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  if (!item.endpoint) {
    return null;
  }

  return (
    <div className={locals.cell}>
      <SvgIcon type="lib_application_endpoint" className={locals.endpointIcon} />
      <Link
        className={locals.link}
        href={getLinkToEndpointDashboard({ serviceId: item.service.id, endpointId: item.endpoint.id })}
        onClick={() => onClickTracker?.({ endpoint: item.endpoint.label })}
      >
        {item.endpoint.label}
      </Link>
    </div>
  );
}

export default function ServiceEndpointList({
  traceId,
  getColor,
  onListItemMouseEnter,
  onListItemMouseLeave,
  onClickTracker
}) {
  const columnDefinitions = [
    {
      id: 'serviceLabel',
      label: t('in-analyze:traceDetails.labelService'),
      getContent(item) {
        return <ServiceLabelContent getColor={getColor} item={item} onClickTracker={onClickTracker} />;
      }
    },
    {
      id: 'endpointLabel',
      label: t('in-analyze:traceDetails.labelEndpoint'),
      getContent(item) {
        return <EndpointLabelContent item={item} onClickTracker={onClickTracker} />;
      }
    },
    {
      id: 'aggregatedTime',
      label: t('in-analyze:traceDetails.labelAggregatedTime'),
      getContent(item) {
        return <span className={locals.aggregatedTime}>{latency.detailed(item.aggregatedTime)}</span>;
      }
    },
    {
      id: 'callCount',
      label: t('in-analyze:traceDetails.labelCalls'),
      getContent(item) {
        return (
          <Tooltip content={number.compact(item.callCount ?? 0)} delay={500}>
            <span>{withSiPrefixOneDecimalPlace(item.callCount ?? 0)}</span>
          </Tooltip>
        );
      }
    },

    {
      id: 'errorCount',
      label: t('in-analyze:traceDetails.labelErroneousCalls'),
      getContent(item) {
        return (
          <Tooltip content={number.compact(item.errorCount ?? 0)} delay={500}>
            <span>{withSiPrefixOneDecimalPlace(item.errorCount ?? 0)}</span>
          </Tooltip>
        );
      }
    }
  ];
  const ServiceEndpointListTable = createServerTableWithUrlState({
    columnDefinitions,
    pathSegment: '/analyze',
    defaultPageSize: 5,
    defaultPageSizes: [5],
    defaultOrderBy: 'aggregatedTime',
    defaultOrderDirection: 'DESC',
    isSearchable: false,
    matrixPrefix: 'analyze'
  });
  return (
    <ServiceEndpointListTable
      get={getTableData}
      paginationResettingProps={[traceId]}
      size="compact"
      traceId={traceId}
      onRowMouseEnter={onListItemMouseEnter}
      onRowMouseLeave={onListItemMouseLeave}
      fixedLayout
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
