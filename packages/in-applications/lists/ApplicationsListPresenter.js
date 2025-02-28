/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { IconButton } from '@instana/components';
import { Link } from '@instana/components';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/ServerTable/internalComponents/LegacySeverityIndicatorCellContentWrapper';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { getTimeConfigAlignedToResultTime, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { applicationsList, useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { getApplicationsWithDefaults } from 'in-applications/subscriptions/getApplications';
import { applicationListPrefix as matrixPrefix } from 'in-applications/navigation/matrix';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import ScopeNotification from 'in-applications/lists/components/ScopeNotification';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import CreateApplication from 'in-applications/creation/CreateApplication';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { boundaryScopes } from 'in-applications/constants';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ApplicationsListPresenter.mless';

const pathSegment = applicationsList;

function ApplicationLabelContent({ item }) {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1], 0);

  return (
    <SeverityIndicatorCellContentWrapper severity={maxSeverity}>
      <Link href={getLinkToApplicationDashboard({ applicationId: item.application.id })}>{item.application.label}</Link>
    </SeverityIndicatorCellContentWrapper>
  );
}

function BoundaryScopeContent({ item }) {
  if (item.application.boundaryScope) {
    return (
      <IconButton
        type={boundaryScopes.info[item.application.boundaryScope].icon}
        className={locals.iconButton}
        align="bottom"
        isWrapperedByTooltip
        noStyling
        iconDescription={boundaryScopes.info[item.application.boundaryScope].dashboard}
      />
    );
  }
  return null;
}

const columnDefinitions = [
  {
    id: 'applicationLabel',
    label: t('in-applications:labelName'),
    getContent(item) {
      return <ApplicationLabelContent item={item} />;
    }
  },
  {
    id: 'boundaryScope',
    label: t('in-applications:labelScope'),
    sortable: false,
    getContent(item) {
      return <BoundaryScopeContent item={item} />;
    }
  },
  {
    id: 'services',
    label: t('in-applications:labelServices'),
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'services', 0, 1], 0);
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
          applicationId={item.application.id}
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

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultPageSizes: [20, 40, 60, 80, 100],
  defaultOrderBy: 'callsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

export default function ApplicationsListPresenter({
  timeConfig,
  setFilter,
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters,
  snapshotId,
  plugin,
  location
}) {
  const scopeNotification = (applicationId || serviceId || endpointId || tagFilters) && contextScope && (
    <ScopeNotification
      icon={contextScope === 'UPSTREAM' ? 'lib_context_guide_upstream' : 'lib_context_guide_downstream'}
      productArea="application"
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
        <Title title={t('in-applications:labelApplications')} />
        <ViewTrackingMeta
          data={{
            pagePath: location?.pathname,
            productArea: productAreas.applications,
            pageRootName: pageNames.applications
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={() => getHasDataToRender(timeConfig)}
          FallbackComponent={ApplicationsNoDataNotification}
        >
          <ServerTableWithUrlState
            get={getTableData}
            timeConfig={timeConfig}
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            contextScope={contextScope}
            scopeNotification={scopeNotification}
            tagFilters={tagFilters}
            cardTitle={t('in-applications:viewLists.application')}
          />
        </WithEmptyStateFallback>
      </LeftRightPadding>

      <Footer />
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          {role.canConfigureApplications && (
            <CreateApplication icon="lib_openclose_add_box" kind="primaryv2" location={location} />
          )}

          {role.canConfigureGlobalApplicationSmartAlerts && <CreateGlobalSmartAlertButton renderAsSimpleButton />}
        </FloatingActionButtonMenu>
      </FloatingActionButtons>
    </Sticky>
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  contextScope,
  tagFilters
}) {
  tagFilters = tagFilters.map(tagFilter => ({ ...tagFilter, stringValue: tagFilter.value }));

  return getApplicationsWithDefaults({
    timeConfig,
    query,
    page,
    pageSize,
    orderBy,
    orderDirection,
    applicationId,
    serviceId,
    endpointId,
    contextScope,
    tagFilters
  });
}

function getHasDataToRender(timeConfig) {
  return getApplicationsWithDefaults({ timeConfig }).map(result => !result.data || result.data.totalHits > 0);
}
