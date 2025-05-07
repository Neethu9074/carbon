/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button, Tooltip } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  applicationDashboardUrlParameters,
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { useLinkToEndpointDashboard, useLinkToEndpointConfiguration } from 'in-applications/navigation/paths';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getEndpointTypes from 'in-applications/subscriptions/getEndpointTypes';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { capitalize } from 'in-services/formatters/string';
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

function EndpointLabelContent({ item, applicationId, serviceId, boundaryScope, syntheticCalls }) {
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();
  const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);
  return (
    <SeverityAwareEntityLink
      severity={maxSeverity}
      icon="lib_application_endpoint"
      label={item.endpoint.label}
      tooltip={item.endpoint.synthetic ? t('in-applications:labelSyntheticEndpoint') : null}
      specialIndicator={!!item.endpoint.synthetic}
      href={getLinkToEndpointDashboard({
        applicationId,
        serviceId,
        endpointId: item.endpoint.id,
        boundaryScope,
        syntheticCalls
      })}
    />
  );
}

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: t('in-applications:labelName'),
    widthInAbsoluteUnit: true,
    width: '25vw',
    getContent(item, { applicationId, serviceId, boundaryScope, syntheticCalls }) {
      return (
        <EndpointLabelContent
          item={item}
          applicationId={applicationId}
          serviceId={serviceId}
          boundaryScope={boundaryScope}
          syntheticCalls={syntheticCalls}
        />
      );
    }
  },
  {
    id: 'Type',
    label: t('in-applications:labelTypes'),
    sortable: false,
    getContent(item) {
      return (
        <div className={locals.typeWrapper}>
          <Badge color={getColor(item.endpoint.type)}>{item.endpoint.type}</Badge>
          {item.endpoint.synthetic ? (
            <Tooltip
              align="topMiddle"
              content={
                item.endpoint.syntheticType === 'MIXED'
                  ? t('in-applications:syntheticAndNonsynthetic')
                  : t('in-applications:synthetic')
              }
            >
              <Badge type="magenta">{capitalize(item.endpoint.syntheticType)}</Badge>
            </Tooltip>
          ) : null}
        </div>
      );
    }
  },
  {
    id: 'Technology',
    label: t('in-applications:labelTechnologies'),
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
    widthInAbsoluteUnit: true,
    width: '5rem',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, applicationId, serviceId, timeConfig }) {
      const openIssues = get(item, ['metrics', 'openIssues', 0, 1], 0);
      const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);
      return (
        <ApplicationEntityHealthIndicatorBehavior
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={item.endpoint.id}
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
    fixedLayout: true,
    title: t('in-applications:dashboards.noDataAvailable.endpointsTitle'),
    description: t('in-applications:dashboards.noDataAvailable.endpointsDescription')
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

  const endpointTypesSyntheticIncluded = useObservable(
    getEndpointTypes({
      filter: {
        application: applicationId,
        service: serviceId,
        timeConfig,
        applicationBoundaryScope: boundaryScope,
        includeInternalCalls: false,
        // custom HTTP rules should still be configurable if an endpoint receives only synthetic calls in a certain time window
        includeSyntheticCalls: true,
        useLongTermDataOnly: false
      }
    }).map(result => result?.data),
    [applicationId, serviceId, timeConfig, boundaryScope]
  );

  const applicationLabel = useObservable(getApplicationLabelObservable, [applicationId]);
  const serviceLabel = useObservable(getServiceLabelObservable, [serviceId]);
  const [{ endpointTypes, technologies }, setFilter] = useUrlState(urlStateDefinition);
  const getLinkToEndpointConfig = useLinkToEndpointConfiguration();
  const hasHttpType = endpointTypesSyntheticIncluded?.includes('HTTP');

  const rightHeader = ({ query }) => (
    <>
      {role.canConfigureServiceMapping && (
        <Button
          size="compact"
          className={locals.button}
          icon="lib_actions_settings"
          kind="action"
          href={getLinkToEndpointConfig(hasHttpType)}
        >
          {t('in-applications:buttonConfigureEndpoints')}
        </Button>
      )}

      <Filters
        endpointTypes={endpointTypes}
        restrictedEndpointTypes={endpointTypesSyntheticIncluded}
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
      cardTitle={t('in-applications:viewLists.endpoints')}
    />
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
        aggregation: 'MAX'
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
