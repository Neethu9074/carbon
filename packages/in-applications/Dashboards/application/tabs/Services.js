/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { get } from 'lodash';
import { t } from 'in-i18n';

import {
  applicationDashboardUrlParameters,
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { percentage, meanLatencyFixed, number } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { syntheticCallsOptions } from 'in-applications/constants';
import getServices from 'in-subscription/application/getServices';
import { entityTypes } from 'in-analyze/applicationFilter';
import Filters from 'in-applications/components/Filters';
import { getColor } from 'in-applications/endpointTypes';
import Footer from 'in-new-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';
import Card from 'in-new-components/Card';

const pathSegment = '/services';
const matrixPrefix = 'service.';

const endpointTypesUrlParameter = createEndpointTypesUrlParameter(pathSegment, matrixPrefix);
const technologiesUrlParameter = createEndpointTechnologiesUrlParameter(pathSegment, matrixPrefix);

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: t('in-applications:labelName'),
    getContent(item, { applicationId, endpointId, boundaryScope, syntheticCalls }) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_application_service"
          label={item.service.label}
          href$={getServiceDashboard(item.service.id, {
            applicationId,
            boundaryScope,
            endpointId,
            syntheticCalls
          })}
        />
      );
    }
  },
  {
    id: 'types',
    label: t('in-applications:labelTypes'),
    defaultOrderDirection: 'DESC',
    noWrap: true,
    getContent(item) {
      return (
        <Fragment>
          {item.service.types.slice().map(type => (
            <Badge color={getColor(type)} key={type}>
              {type}
            </Badge>
          ))}
        </Fragment>
      );
    }
  },
  {
    id: 'technologies',
    label: t('in-applications:labelTechnologies'),
    defaultOrderDirection: 'DESC',
    noWrap: true,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.service.technologies} />;
    }
  },
  {
    id: 'endpoints',
    label: t('in-applications:labelEndpoints'),
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'endpoints', 0, 1], 0);
      return <EntityCounter count={count} />;
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
          serviceId={item.service.id}
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
    entityName: 'services'
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    endpointTypesUrlParameter,
    technologiesUrlParameter,
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.serviceId,
    applicationDashboardUrlParameters.endpointId,
    applicationDashboardUrlParameters.boundaryScope,
    applicationDashboardUrlParameters.syntheticCalls
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

export default function ServiceList(props) {
  const {
    timeConfig,
    applicationId,
    serviceId,
    endpointId,
    data: application,
    boundaryScope: urlBoundaryScope,
    syntheticCalls: urlSyntheticCalls,
    applicationName
  } = props;

  const [{ endpointTypes, technologies }, setFilter] = useUrlState(urlStateDefinition);

  const boundaryScope = urlBoundaryScope || application.boundaryScope;
  const syntheticCalls = urlSyntheticCalls || syntheticCallsOptions.default;

  const rightHeader = ({ query }) => (
    <Filters
      endpointTypes={endpointTypes}
      technologies={technologies}
      setFilter={setFilter}
      query={query}
      buttonLabel={t('in-applications:labelServices')}
      applicationName={applicationName}
      boundaryScope={boundaryScope}
      groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
    />
  );

  return (
    <>
      <Card>
        <ServerTableWithUrlState
          get={getTableData}
          timeConfig={timeConfig}
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          boundaryScope={boundaryScope}
          rightHeader={rightHeader}
          endpointTypes={endpointTypes}
          technologies={technologies}
          syntheticCalls={syntheticCalls}
        />
      </Card>
      <Footer />
    </>
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
  timeConfig,
  syntheticCalls
}) {
  const granularity = getSparkChartGranularity(timeConfig);
  return getServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      endpoints: {
        metric: 'endpoints',
        aggregation: 'DISTINCT_COUNT'
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity
      },
      erroneousCallsAgg: {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      },
      erroneousCalls: {
        metric: 'erroneousCalls',
        aggregation: 'SUM',
        granularity
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      includeSyntheticCalls: isSyntheticOption(syntheticCalls),
      endpointTypes,
      technologies,
      timeConfig
    }
  });
}
