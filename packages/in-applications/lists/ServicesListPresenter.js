/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import {
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import ServicesNoDataNotification from 'in-applications/lists/components/ServicesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { serviceListPrefix as matrixPrefix } from 'in-applications/navigation/matrix';
import { getServiceDashboard, servicesList } from 'in-applications/navigation/paths';
import { percentage, meanLatencyFixed, number } from 'in-services/formatters/number';
import ScopeNotification from 'in-applications/lists/components/ScopeNotification';
import { getServicesWithDefaults } from 'in-subscription/application/getServices';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { newServiceView } from 'in-applications/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import Filters from 'in-applications/components/Filters';
import { timeConfig$ } from 'in-stores/time/config';
import { isBlank } from 'in-services/util/string';
import Footer from 'in-new-components/Footer';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';

import locals from './ServicesList.mless';

const pathSegment = servicesList;

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityIndicatorCellContentWrapper severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}>
          <Link href$={item.service.id == 'ROOT' ? null : getServiceDashboard(item.service.id)}>
            {item.service.label}
          </Link>
        </SeverityIndicatorCellContentWrapper>
      );
    }
  },
  {
    id: 'types',
    label: 'Types',
    noWrap: true,
    getContent(item) {
      return <EndpointTypeBadgeList types={item.service.types.filter(type => type !== 'UNDEFINED')} />;
    }
  },
  {
    id: 'technologies',
    label: 'Technologies',
    noWrap: true,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.service.technologies} />;
    }
  },
  {
    id: 'applications',
    label: 'Applications',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'applications', 0, 1], 0);
      return <EntityCounter count={count} />;
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'endpoints', 0, 1], 0);
      return <EntityCounter count={count} />;
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
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
    id: 'latencyAgg',
    label: 'Latency',
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
    id: 'errorsAgg',
    label: 'Erroneous Call Rate',
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
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          serviceId={item.service.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];

const endpointTypesUrlParameter = createEndpointTypesUrlParameter(pathSegment, matrixPrefix);
const technologiesUrlParameter = createEndpointTechnologiesUrlParameter(pathSegment, matrixPrefix);

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters, endpointTypesUrlParameter, technologiesUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'callsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

export default function ServicesList({
  timeConfig,
  setFilter,
  endpointTypes,
  technologies,
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters,
  snapshotId,
  plugin
}) {
  tagFilters = tagFilters ? tagFilters.map(tagFilter => ({ ...tagFilter, stringValue: tagFilter.value })) : [];
  const rightHeader = ({ query }) => (
    <>
      {role.canConfigureServiceMapping && (
        <Button
          className={locals.button}
          icon="lib_actions_settings"
          kind="action"
          href$={getModifiedUrlStream(p => (p.pathname = newServiceView))}
        >
          Configure Services
        </Button>
      )}
      <Filters
        endpointTypes={endpointTypes}
        technologies={technologies}
        setFilter={setFilter}
        query={query}
        buttonLabel="Services"
        groupByTag={{ name: 'service.name', entity: entityTypes.DESTINATION }}
      />
    </>
  );

  const scopeNotification = (!isBlank(applicationId) || !isBlank(serviceId) || !isBlank(endpointId) || tagFilters) &&
    !isBlank(contextScope) && (
      <ScopeNotification
        icon={contextScope == 'UPSTREAM' ? 'lib_context_guide_upstream' : 'lib_context_guide_downstream'}
        productArea="service"
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        contextScope={contextScope}
        tagFilters={tagFilters}
        snapshotId={snapshotId}
        plugin={plugin}
        onClose={() =>
          setFilter({
            applicationId: '',
            serviceId: '',
            endpointId: '',
            contextScope: '',
            tagFilters: [],
            snapshotId: '',
            plugin: ''
          })
        }
      />
    );

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title="Services" />
        <ViewTrackingMeta
          data={{
            productArea: 'Applications',
            pageRootName: 'Services'
          }}
        />

        <WithEmptyStateFallback getHasDataToRender={getHasDataToRender} FallbackComponent={ServicesNoDataNotification}>
          <Card useMaxAvailableHeight={false} hasMarginBottom>
            <ServerTableWithUrlState
              get={getTableData}
              timeConfig={timeConfig}
              endpointTypes={endpointTypes}
              technologies={technologies}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              contextScope={contextScope}
              rightHeader={rightHeader}
              scopeNotification={scopeNotification}
              tagFilters={tagFilters}
            />
          </Card>
        </WithEmptyStateFallback>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

function getTableData(params) {
  return getServicesWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getServicesWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
