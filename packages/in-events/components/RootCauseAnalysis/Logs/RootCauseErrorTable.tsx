/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ApplicationBoundaryScope, ErrorMessageItem, OrderDirection, Result, TimeConfig } from '@instana/types';
import { Button, Link } from '@instana/components';

//@ts-expect-error Needs TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
//@ts-expect-error Needs TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
//@ts-expect-error Needs TS migration
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { getResolvedTimeConfig, getSparkChartGranularity, TimeResult } from 'in-applications/metrics';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { CONTAINS, EQUALS, IS_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { ColumnDefinition, TableProps } from 'in-components/tables/ServerTable/types';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getErrorMessages from 'in-applications/subscriptions/getErrorMessages';
import RootCauseLogsComboButton from './RootCauseLogsComboButton';
import { loggingEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import { collationLanguage, t } from 'in-i18n';

const pathSegment = '/errorMessages';
const matrixPrefix = 'error.';

interface ColumnDefinitionProps extends TableProps<ErrorMessageItem> {
  boundaryScope: ApplicationBoundaryScope;
  timeConfig?: TimeConfig;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  columnDefinitions: ColumnDefinition<ErrorMessageItem>[];
  orderBy: string;
  orderDirection: OrderDirection;
  result?: Result<ErrorMessageItem>;
}

const columnDefinitions: ColumnDefinition<ErrorMessageItem, ColumnDefinitionProps>[] = [
  {
    id: 'errorMessage',
    label: t('in-applications:labelErrorMessage'),
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
    id: 'erroneousCallsAgg',
    label: t('in-applications:labelErroneousCallCount'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        timeConfig &&
        result && (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result as TimeResult)}
            metrics={item.metrics.erroneousCalls}
            metric={item.metrics.erroneousCallsAgg}
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
    title: t('in-applications:dashboards.noDataAvailable.errorMessagesTitle'),
    description: t('in-applications:dashboards.noDataAvailable.errorMessagesDescription')
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.serviceId,
    applicationDashboardUrlParameters.endpointId
  ],
  columnDefinitions,
  defaultOrderBy: 'erroneousCallsAgg',
  defaultOrderDirection: 'DESC',
  defaultPageSize: 3,
  defaultPageSizes: [3, 5, 20],
  isSearchable: false,
  pathSegment,
  matrixPrefix
});

interface RootCauseErrorMessageTableProps {
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig?: TimeConfig;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  rcaEntityType: string;
  processId: string;
  containerId: string;
  processContainerType: string;
  hostName: string;
  plugin: string;
  cardTitle: JSX.Element;
}

export default function RootCauseErrorMessagesTable({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  applicationName,
  serviceName,
  endpointName,
  rcaEntityType,
  processId,
  containerId,
  processContainerType,
  hostName,
  plugin,
  cardTitle
}: RootCauseErrorMessageTableProps) {
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
      rightHeader={(headerProps: { query: string }) =>
        loggingEnabled ? (
          <RootCauseLogsComboButton
            query={headerProps.query}
            boundaryScope={boundaryScope}
            applicationName={applicationName}
            serviceName={serviceName}
            endpointName={endpointName}
            rcaEntityType={rcaEntityType}
            processId={processId}
            containerId={containerId}
            processContainerType={processContainerType}
            hostName={hostName}
            plugin={plugin}
            includeInternal
            includeSynthetic
            isErrorMessagesTable
            timeConfig={timeConfig}
          />
        ) : (
          <AnalyzeErrorMessagesButton
            groupByTagName="call.error.message"
            applicationName={applicationName}
            serviceName={serviceName}
            endpointName={endpointName}
            boundaryScope={boundaryScope}
            query={headerProps.query}
            includeInternal
            includeSynthetic
            timeConfig={timeConfig}
          />
        )
      }
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 3,
  orderBy = 'erroneousCallsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
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
  endpointId: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig: TimeConfig;
}) {
  return getErrorMessages({
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
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    metrics: {
      erroneousCallsAgg: {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      },
      erroneousCalls: {
        metric: 'erroneousCalls',
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

  let displayedMessage;
  let errorMessageFilter;
  const erroneousFilter = tagFilter('call.erroneous', EQUALS, true);

  if (!message || message === '') {
    displayedMessage = t('in-applications:dashboards.errorCallWithoutMessage');
    errorMessageFilter = tagFilter('call.error.message', IS_EMPTY);
  } else {
    displayedMessage = message;
    errorMessageFilter = tagFilter('call.error.message', EQUALS, message);
  }

  return (
    <Link
      href={getLinkToApplicationAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        formModel: joinExpressions({ expressions: [erroneousFilter, errorMessageFilter] }),
        hiddenCalls: { includeInternal: true, includeSynthetic: true },
        boundaryScope,
        timeConfig
      })}
    >
      {displayedMessage}
    </Link>
  );
}

interface AnalyzeErrorMessagesButtonProps {
  groupByTagName: string;
  applicationName: string;
  serviceName: string;
  endpointName: string;
  className?: string;
  boundaryScope: ApplicationBoundaryScope;
  query: any;
  includeInternal: boolean;
  includeSynthetic: boolean;
  timeConfig: TimeConfig | undefined;
}

function AnalyzeErrorMessagesButton({
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
}: AnalyzeErrorMessagesButtonProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const groupBy = { groupbyTag: groupByTagName };
  let formModel: FormModelElement | FormModelElement[] = [];
  if (query.length > 0) {
    formModel = joinExpressions({ expressions: [formModel, tagFilter(groupByTagName, CONTAINS, query)] });
  }

  formModel = joinExpressions({ expressions: [formModel, tagFilter('call.erroneous', EQUALS, true)] });

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
      {t('in-events:RCA.analyzeErrors')}
    </Button>
  );
}
