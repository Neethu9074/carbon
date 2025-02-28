/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import { Link, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/ServerTable/internalComponents/LegacySeverityIndicatorCellContentWrapper';
import {
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import ServicesNoDataNotification from 'in-applications/lists/components/ServicesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { type as tagFilterType } from 'in-components/QueryBuilder/transformation/tagFilter';
import { servicesList, useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import { serviceListPrefix as matrixPrefix } from 'in-applications/navigation/matrix';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { percentage, meanLatencyFixed, number } from 'in-services/formatters/number';
import { getServicesWithDefaults } from 'in-applications/subscriptions/getServices';
import ScopeNotification from 'in-applications/lists/components/ScopeNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import getApplication from 'in-applications/subscriptions/getApplication';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import getService from 'in-applications/subscriptions/getService';
import { newServiceView } from 'in-applications/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { pageNames } from 'in-services/tracking/pageNames';
import { entityTypes } from 'in-analyze/applicationFilter';
import { playwithEnabled } from 'in-services/featureFlags';
import Filters from 'in-applications/components/Filters';
import { emptyArray } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ServicesList.mless';

const pathSegment = servicesList;

function ServiceLabelContent({ item }) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);
  return (
    <SeverityIndicatorCellContentWrapper severity={maxSeverity}>
      <Link href={item.service.id === 'ROOT' ? null : getLinkToServiceDashboard({ serviceId: item.service.id })}>
        {item.service.label}
      </Link>
    </SeverityIndicatorCellContentWrapper>
  );
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: t('in-applications:labelName'),
    getContent(item) {
      return <ServiceLabelContent item={item} />;
    }
  },
  {
    id: 'types',
    label: t('in-applications:labelTypes'),
    noWrap: true,
    getContent(item) {
      return <EndpointTypeBadgeList types={item.service.types.filter(type => type !== 'UNDEFINED')} limit={3} />;
    }
  },
  {
    id: 'technologies',
    label: t('in-applications:labelTechnologies'),
    noWrap: true,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.service.technologies} limit={3} />;
    }
  },
  {
    id: 'applications',
    label: t('in-applications:labelApplications'),
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'applications', 0, 1], 0);
      return count;
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
    id: 'maxSeverity',
    label: t('in-applications:labelHealth'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      const openIssues = get(item, ['metrics', 'openIssues', 0, 1], 0);
      const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);
      return (
        <ApplicationEntityHealthIndicatorBehavior
          serviceId={item.service.id}
          openIssues={openIssues}
          maxSeverity={maxSeverity}
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
  const { location, createHref } = useNavigation();
  const [callTypes, setCallTypes] = useState(null);
  const service = useObservable(
    contextScope && serviceId
      ? getService({
          id: serviceId,
          filter: {
            timeConfig
          }
        })
      : empty,
    [timeConfig]
  );
  const applicationName = useObservable(getApplicationLabelObservable, [applicationId]);
  const serviceName = useObservable(getServiceLabelObservable, [serviceId]);
  useEffect(() => {
    setCallTypes(
      joinExpressions({
        logicalOperator: or,
        expressions: service?.data?.types?.map(type => ({
          type: tagFilterType,
          name: 'call.type',
          value: type,
          operator: EQUALS
        }))
      })
    );
  }, [service]);

  const rightHeader = ({ query }) => (
    <>
      {role.canConfigureServiceMapping && !playwithEnabled && (
        <Button
          size="compact"
          className={locals.button}
          icon="lib_actions_settings"
          kind="action"
          href={createHref({ ...location, pathname: newServiceView })}
        >
          {t('in-applications:buttonConfigureServices')}
        </Button>
      )}
      <Filters
        contextScope={contextScope}
        endpointTypes={endpointTypes}
        technologies={technologies}
        setFilter={setFilter}
        serviceName={serviceName}
        applicationName={applicationName}
        query={query}
        buttonLabel={t('in-applications:buttonAnalyzeServices')}
        groupBy={
          !contextScope || contextScope === 'DOWNSTREAM'
            ? createGroupBy('service.name', entityTypes.DESTINATION)
            : createGroupBy('service.name', entityTypes.SOURCE)
        }
        callTypes={callTypes ?? emptyArray}
      />
    </>
  );

  const scopeNotification = (!isBlank(applicationId) || !isBlank(serviceId) || !isBlank(endpointId) || tagFilters) &&
    !isBlank(contextScope) && (
      <ScopeNotification
        icon={contextScope === 'UPSTREAM' ? 'lib_context_guide_upstream' : 'lib_context_guide_downstream'}
        productArea="service"
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        contextScope={contextScope}
        tagFilters={tagFilters}
        snapshotId={snapshotId}
        plugin={plugin}
        onClose={() => {
          setFilter({
            applicationId: '',
            serviceId: '',
            endpointId: '',
            contextScope: '',
            tagFilters: [],
            snapshotId: '',
            plugin: ''
          });
          setCallTypes(null);
        }}
      />
    );

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-applications:labelService')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.applications,
            pageRootName: pageNames.services
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={() => getHasDataToRender(timeConfig)}
          FallbackComponent={ServicesNoDataNotification}
        >
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
            cardTitle={t('in-applications:viewLists.services')}
          />
        </WithEmptyStateFallback>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

function getTableData(params) {
  return getServicesWithDefaults(params);
}

function getHasDataToRender(timeConfig) {
  return getServicesWithDefaults({ timeConfig }).map(result => !result.data || result.data.totalHits > 0);
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
