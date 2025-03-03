/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  applicationDashboardUrlParameters,
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { percentage, meanLatencyFixed, number } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import getServices from 'in-applications/subscriptions/getServices';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import Filters from 'in-applications/components/Filters';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

const pathSegment = '/services';
const matrixPrefix = 'service.';

const endpointTypesUrlParameter = createEndpointTypesUrlParameter(pathSegment, matrixPrefix);
const technologiesUrlParameter = createEndpointTechnologiesUrlParameter(pathSegment, matrixPrefix);

function ServiceLabelContent({ item, applicationId, boundaryScope, endpointId }) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);

  return (
    <SeverityAwareEntityLink
      severity={maxSeverity}
      icon="lib_application_service"
      label={item.service.label}
      href={getLinkToServiceDashboard({
        applicationId,
        serviceId: item.service.id,
        boundaryScope,
        endpointId
      })}
    />
  );
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: t('in-applications:labelName'),
    getContent(item, { applicationId, endpointId, boundaryScope }) {
      return (
        <ServiceLabelContent
          item={item}
          applicationId={applicationId}
          boundaryScope={boundaryScope}
          endpointId={endpointId}
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
      return <EndpointTypeBadgeList types={item.service.types} limit={3} />;
    }
  },
  {
    id: 'technologies',
    label: t('in-applications:labelTechnologies'),
    defaultOrderDirection: 'DESC',
    noWrap: true,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.service.technologies} limit={3} />;
    }
  },
  {
    id: 'endpoints',
    label: t('in-applications:labelEndpoints'),
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'endpoints', 0, 1], 0);
      return count;
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
    getContent(item, { result, applicationId, timeConfig }) {
      const openIssues = get(item, ['metrics', 'openIssues', 0, 1], 0);
      const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);
      return (
        <ApplicationEntityHealthIndicatorBehavior
          applicationId={applicationId}
          serviceId={item.service.id}
          openIssues={openIssues}
          maxSeverity={maxSeverity}
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
    title: t('in-applications:dashboards.noDataAvailable.servicesTitle'),
    description: t('in-applications:dashboards.noDataAvailable.servicesDescription')
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
    applicationName
  } = props;

  const [{ endpointTypes, technologies }, setFilter] = useUrlState(urlStateDefinition);

  const boundaryScope = urlBoundaryScope || application.boundaryScope;

  const rightHeader = ({ query }) => (
    <Filters
      endpointTypes={endpointTypes}
      technologies={technologies}
      setFilter={setFilter}
      query={query}
      buttonLabel={t('in-applications:buttonAnalyzeServices')}
      applicationName={applicationName}
      boundaryScope={boundaryScope}
      groupBy={createGroupBy('service.name', entityTypes.DESTINATION)}
    />
  );

  return (
    <>
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
        cardTitle={t('in-applications:viewLists.services')}
      />
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
  timeConfig
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
        aggregation: 'MAX'
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      endpointTypes,
      technologies,
      timeConfig
    }
  });
}
