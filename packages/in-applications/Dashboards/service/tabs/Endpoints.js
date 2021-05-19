/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { Card } from '@instana/components';

import {
  applicationDashboardUrlParameters,
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getEndpointDashboard, configureEndpointsView } from 'in-applications/navigation/paths';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import getApplication from 'in-subscription/application/getApplication';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import Filters from 'in-applications/components/Filters';
import { getColor } from 'in-applications/endpointTypes';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Endpoints.mless';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoint.';

const endpointTypesUrlParameter = createEndpointTypesUrlParameter(pathSegment, matrixPrefix);
const technologiesUrlParameter = createEndpointTechnologiesUrlParameter(pathSegment, matrixPrefix);

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: t('in-applications:labelName'),
    getContent(item, { applicationId, serviceId, boundaryScope, syntheticCalls }) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_application_endpoint"
          label={item.endpoint.label}
          tooltip={item.endpoint.synthetic ? t('in-applications:labelSyntheticEndpoint') : null}
          specialIndicator={item.endpoint.synthetic ? true : false}
          href$={getEndpointDashboard(item.endpoint.id, {
            applicationId,
            serviceId,
            boundaryScope,
            syntheticCalls
          })}
        />
      );
    }
  },
  {
    id: 'Type',
    sortable: false,
    getContent(item) {
      return <Badge color={getColor(item.endpoint.type)}>{item.endpoint.type}</Badge>;
    }
  },
  {
    id: 'Technology',
    sortable: false,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.endpoint.technologies} />;
    }
  },
  {
    id: 'callsAgg',
    label: t('in-applications:labelCalls'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.calls}
          metric={item.metrics.callsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'erroneousCallsAgg',
    label: t('in-applications:titleErroneousCalls'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.erroneousCalls}
          metric={item.metrics.erroneousCallsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'errorsAgg',
    label: t('in-applications:titleErroneousCallRate'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.detailed}
          percentageMetric
        />
      );
    }
  },
  {
    id: 'latencyAgg',
    label: t('in-applications:labelLatency'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.latency}
          metric={item.metrics.latencyAgg}
          tooltipFormatter={meanLatencyFixed.compact}
        />
      );
    }
  },
  {
    id: 'maxSeverity',
    label: t('in-applications:labelHealth'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          endpointId={item.endpoint.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          IndicatorPresenter={HealthIndicatorPresenter}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'endpoints'
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.serviceId,
    applicationDashboardUrlParameters.endpointId,
    applicationDashboardUrlParameters.boundaryScope,
    applicationDashboardUrlParameters.syntheticCalls,
    'endpointTypes',
    'technologies'
  ],
  columnDefinitions,
  defaultOrderBy: 'callsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

const urlStateDefinition = {
  bind: [endpointTypesUrlParameter, technologiesUrlParameter],
  reducer: (prevState, { endpointTypes, technologies }) => ({
    endpointTypes: endpointTypes || prevState.endpointTypes,
    technologies: technologies || prevState.technologies
  })
};

export default function Endpoints(props) {
  const { timeConfig, data, applicationId, serviceId, endpointId, boundaryScope, syntheticCalls } = props;

  const applicationLabel = useObservable(getApplicationLabelObservable, [applicationId]);
  const serviceLabel = useObservable(getServiceLabelObservable, [serviceId]);
  const [{ endpointTypes, technologies }, setFilter] = useUrlState(urlStateDefinition);

  const hasHttpType = data.types.indexOf('HTTP') >= 0;
  const rightHeader = ({ query }) => (
    <>
      {hasHttpType && role.canConfigureServiceMapping && (
        <Button
          className={locals.button}
          icon="lib_actions_settings"
          kind="action"
          href$={getModifiedUrlStream(p => (p.pathname = configureEndpointsView))}
        >
          {t('in-applications:buttonConfigureEndpoints')}
        </Button>
      )}

      <Filters
        endpointTypes={endpointTypes}
        restrictedEndpointTypes={data.types}
        technologies={technologies}
        restrictedTechnologies={data.technologies}
        setFilter={setFilter}
        query={query}
        applicationName={applicationLabel}
        serviceName={serviceLabel}
        buttonLabel={t('in-applications:buttonAnalyzeEndpoints')}
        boundaryScope={boundaryScope}
        groupBy={createGroupBy('endpoint.name', entityTypes.DESTINATION)}
      />
    </>
  );

  return (
    <Card>
      <ServerTableWithUrlState
        get={getTableData}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        syntheticCalls={syntheticCalls}
        timeConfig={timeConfig}
        rightHeader={rightHeader}
        endpointTypes={endpointTypes}
        technologies={technologies}
      />
    </Card>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  endpointTypes = [],
  technologies = [],
  timeConfig
}) {
  return getEndpoints({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      includeSyntheticCalls: true,
      endpointTypes,
      technologies,
      label: query,
      timeConfig
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      erroneousCallsAgg: {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      },
      erroneousCalls: {
        metric: 'erroneousCalls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  });
}

function getServiceLabelObservable([id]) {
  if (!id) {
    return null;
  }
  return getServiceLabel({ id }).map(result => result.data?.label);
}

function getApplicationLabelObservable([id]) {
  if (!id) {
    return null;
  }
  return getApplication({ id }).map(result => result.data?.label);
}
