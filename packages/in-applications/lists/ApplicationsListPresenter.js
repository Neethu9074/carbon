/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import {
  getTimeConfigAlignedToResultTime,
  timeConfig$,
  urlParameters as timeConfigUrlParameters
} from 'in-stores/time/config';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateGlobalSmartAlertButton';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import FloatingActionButtonMenu from 'in-new-components/FloatingActionButton/FloatingActionButtonMenu';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import FloatingActionButtons from 'in-new-components/FloatingActionButton/FloatingActionButtons';
import { getApplicationDashboard, applicationsList } from 'in-applications/navigation/paths';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import { applicationListPrefix as matrixPrefix } from 'in-applications/navigation/matrix';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { getApplicationsWithDefaults } from 'in-subscription/application/getApplications';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import ScopeNotification from 'in-applications/lists/components/ScopeNotification';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import CreateApplication from 'in-applications/creation/CreateApplication';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { boundaryScopes } from 'in-applications/constants';
import Footer from 'in-new-components/Footer';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

const pathSegment = applicationsList;

const columnDefinitions = [
  {
    id: 'applicationLabel',
    label: t('in-applications:labelName'),
    getContent(item) {
      return (
        <SeverityIndicatorCellContentWrapper severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}>
          <Link href$={getApplicationDashboard(item.application.id)}>{item.application.label}</Link>
        </SeverityIndicatorCellContentWrapper>
      );
    }
  },
  {
    id: 'boundaryScope',
    label: t('in-applications:labelScope'),
    sortable: false,
    getContent(item) {
      const href$ = getApplicationDashboard(item.application.id);
      const iconColor = href$ && theme.lib.colors.blue800;
      if (item.application.boundaryScope) {
        return (
          <Tooltip content={boundaryScopes.info[item.application.boundaryScope].dashboard}>
            <SvgIcon type={boundaryScopes.info[item.application.boundaryScope].icon} color={iconColor} />
          </Tooltip>
        );
      }
      return null;
    }
  },
  {
    id: 'services',
    label: t('in-applications:labelServices'),
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'services', 0, 1], 0);
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
      return (
        <ApplicationEntityHealthIndicatorBehavior
          applicationId={item.application.id}
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

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
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
  plugin
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
            productArea: 'Applications',
            pageRootName: 'Applications'
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={ApplicationsNoDataNotification}
        >
          <Card useMaxAvailableHeight={false} hasMarginBottom>
            <ServerTableWithUrlState
              get={getTableData}
              timeConfig={timeConfig}
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
              contextScope={contextScope}
              scopeNotification={scopeNotification}
              tagFilters={tagFilters}
            />
          </Card>
        </WithEmptyStateFallback>
      </LeftRightPadding>

      <Footer />
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          {role.canConfigureApplications && <CreateApplication icon="lib_openclose_add_box" kind="primaryv2" />}

          {role.canConfigureGlobalAlertConfigs && applicationSmartAlertsEnabled && (
            <CreateGlobalSmartAlertButton renderAsSimpleButton />
          )}
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

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getApplicationsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
