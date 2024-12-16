/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ApplicationBoundaryScope, LogMessageItem, OrderDirection, Result, TimeConfig } from '@instana/types';
import { Button, Link, Pill } from '@instana/components';

//@ts-expect-error Needs TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
//@ts-expect-error Needs TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
//@ts-expect-error Needs TS migration
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { getResolvedTimeConfig, getSparkChartGranularity, TimeResult } from 'in-applications/metrics';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { LOGGING_CLICKED_APPLICATION_PERSPECTIVE_LINK } from 'in-services/tracking/eventNames';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { CONTAINS, EQUALS, IS_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { logPillColorMap } from 'in-logging/analyze/AnalyzeView/utils/constants';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import getLogMessages from 'in-applications/subscriptions/getLogMessages';
import { number } from 'in-services/formatters/number';
import { collationLanguage, t } from 'in-i18n';

import locals from './RCALogs.mless';

const pathSegment = '/logMessages';
const matrixPrefix = 'log.';

interface ColumnDefinitionProps extends TableProps<LogMessageItem> {
  boundaryScope: ApplicationBoundaryScope;
  timeConfig?: TimeConfig;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  columnDefinitions: ColumnDefinition<LogMessageItem>[];
  orderBy: string;
  orderDirection: OrderDirection;
  result?: Result<LogMessageItem>;
}

const columnDefinitions: ColumnDefinition<LogMessageItem, ColumnDefinitionProps>[] = [
  {
    id: 'logLevel',
    width: '4.5rem',
    widthInAbsoluteUnit: true,
    label: t('in-applications:labelLogLevel'),
    headCellProps: {
      className: locals.headCell
    },
    cellClassName: locals.logLevelPillCell,
    getContent(item: LogMessageItem) {
      const color = logPillColorMap[item.level.toLowerCase()] ?? 'high-contrast';
      return (
        <Pill className={locals.logLevelPill} type={color}>
          {item.level}
        </Pill>
      );
    }
  },
  {
    id: 'logMessage',
    label: t('in-applications:labelLogMessage'),
    getContent(item, { applicationName, serviceName, endpointName, boundaryScope, timeConfig }) {
      return (
        <Message
          message={item.message}
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          boundaryScope={boundaryScope}
          timeConfig={timeConfig}
        />
      );
    },
    noWrap: true,
    ellipsis: '50vw'
  },
  {
    id: 'logsAgg',
    label: t('in-applications:labelCount'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        timeConfig &&
        result && (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result as TimeResult)}
            metrics={item.metrics.logs}
            metric={item.metrics.logsAgg}
            tooltipFormatter={number.compact}
          />
        )
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-applications:dashboards.noDataAvailable.logMessagesTitle'),
    description: t('in-applications:dashboards.noDataAvailable.logMessagesDescription')
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
  defaultPageSize: 3,
  defaultPageSizes: [3, 5, 20],
  isSearchable: false,
  pathSegment,
  matrixPrefix
});

interface RootCauseLogMessageTableProps {
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig?: TimeConfig;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  cardTitle: JSX.Element;
}

export default function RootCauseLogMessagesTable({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  applicationName,
  serviceName,
  endpointName,
  cardTitle
}: RootCauseLogMessageTableProps) {
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
      cardTitle={cardTitle}
      rightHeader={(headerProps: { query: string }) => (
        <AnalyzeTraceLogsButton
          groupByTagName="log.message"
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          className={locals.analyzeButton}
          boundaryScope={boundaryScope}
          query={headerProps.query}
          includeInternal
          includeSynthetic
          timeConfig={timeConfig}
        />
      )}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 2,
  orderBy = 'logsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointName,
  boundaryScope,
  timeConfig
}: {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: OrderDirection;
  applicationId: string;
  serviceId: string;
  endpointName: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig: TimeConfig;
}) {
  return getLogMessages({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection,
      collation: collationLanguage
    },
    filter: {
      label: query,
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpointName: endpointName,
      applicationBoundaryScope: boundaryScope,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
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
    },
    supportedOrderByCriteria: false
  });
}

interface MessageProps {
  message: string;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig?: TimeConfig;
}
function Message({ message, applicationName, serviceName, endpointName, boundaryScope, timeConfig }: MessageProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const { trackCta } = useSegmentTracking();
  const trackLinkClick = () => {
    trackCta(LOGGING_CLICKED_APPLICATION_PERSPECTIVE_LINK);
  };

  return (
    <Link
      onClick={trackLinkClick}
      href={getLinkToApplicationAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        formModel: [message ? tagFilter('log.message', EQUALS, message) : tagFilter('log.message', IS_EMPTY)],
        hiddenCalls: { includeInternal: true, includeSynthetic: true },
        boundaryScope,
        timeConfig: timeConfig
      })}
    >
      {message ? message : <div className={locals.italic}>{t('in-applications:dashboards.noLogMessage')}</div>}
    </Link>
  );
}

interface AnalyzeTraceLogsButtonProps {
  groupByTagName: string;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  className: string;
  boundaryScope: ApplicationBoundaryScope;
  query: any;
  includeInternal: boolean;
  includeSynthetic: boolean;
  timeConfig: TimeConfig | undefined;
}

function AnalyzeTraceLogsButton({
  groupByTagName,
  applicationName,
  serviceName,
  endpointName,
  className,
  boundaryScope,
  query,
  includeInternal,
  includeSynthetic,
  timeConfig
}: AnalyzeTraceLogsButtonProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const groupBy = { groupbyTag: groupByTagName };
  let formModel: FormModelElement | FormModelElement[] = [];
  if (query.length > 0) {
    formModel = joinExpressions({ expressions: [formModel, tagFilter(groupByTagName, CONTAINS, query)] });
  }

  const hiddenCalls = includeInternal || includeSynthetic ? { includeInternal, includeSynthetic } : null;

  const orderByGroups = { by: 'erroneousCalls_SUM' };
  const chartedMetrics = [createChartedMetric('erroneousCalls', 'SUM')];
  const fields = [createMetricField('erroneousCalls', 'SUM')];
  return (
    <Button
      size="compact"
      icon="lib_application_call"
      className={className}
      kind="primary"
      href={getLinkToApplicationAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        groupBy,
        boundaryScope,
        formModel,
        //@ts-ignore
        orderByGroups,
        chartedMetrics,
        fields,
        hiddenCalls,
        timeConfig
      })}
    >
      {t('in-events:RCA.analyzeTraceLogs')}
    </Button>
  );
}
