/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { EQUALS, IS_EMPTY } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getLogMessages from 'in-applications/subscriptions/getLogMessages';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { number } from 'in-services/formatters/number';
import Pill from 'in-new-components/Pill';
import { t } from 'in-i18n';

import locals from './MessagesTable.mless';

const pathSegment = '/logMessages';
const matrixPrefix = 'log.';

const columnDefinitions = [
  {
    id: 'logMessage',
    label: t('in-applications:labelLogMessage'),
    getContent(item, { applicationName, serviceName, endpointName, boundaryScope }) {
      return (
        <Message
          message={item.message}
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          boundaryScope={boundaryScope}
        />
      );
    },
    noWrap: true,
    ellipsis: '50vw'
  },
  {
    id: 'logLevel',
    label: t('in-applications:labelLogLevel'),
    getContent(item) {
      return <Pill kind="lighter">{item.level}</Pill>;
    }
  },
  {
    id: 'logsAgg',
    label: t('in-applications:labelCount'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          metrics={item.metrics.logs}
          metric={item.metrics.logsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: t('in-applications:dashboards.logMessages')
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.serviceId,
    applicationDashboardUrlParameters.endpointId
  ],
  columnDefinitions,
  defaultOrderBy: 'logsAgg',
  defaultOrderDirection: 'DESC',
  defaultPageSize: 10,
  pathSegment,
  matrixPrefix
});

export default function LogMessagesTable({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  applicationName,
  serviceName,
  endpointName
}) {
  return (
    <ServerTableWithUrlState
      size="compact"
      get={getTableData}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      applicationName={applicationName}
      serviceName={serviceName}
      endpointName={endpointName}
      boundaryScope={boundaryScope}
      timeConfig={timeConfig}
      rightHeader={({ query }) => (
        <AnalyzeMessagesButton
          groupByTagName="log.message"
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          className={locals.analyzeButton}
          boundaryScope={boundaryScope}
          query={query}
          includeInternal
          includeSynthetic
        />
      )}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'logsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointName,
  boundaryScope,
  timeConfig
}) {
  return getLogMessages({
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
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpointName: endpointName, // logs are still using endpoint names as ids
      applicationBoundaryScope: boundaryScope
    },
    metrics: {
      logsAgg: {
        metric: 'logs',
        aggregation: 'SUM'
      },
      logs: {
        metric: 'logs',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}

function Message({ message, applicationName, serviceName, endpointName, boundaryScope }) {
  return (
    <Link
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        formModel: [message ? tagFilter('log.message', EQUALS, message) : tagFilter('log.message', IS_EMPTY)],
        hiddenCalls: { includeInternal: true, includeSynthetic: true },
        boundaryScope
      })}
    >
      {message ? message : <div className={locals.italic}>{t('in-applications:dashboards.noLogMessage')}</div>}
    </Link>
  );
}
