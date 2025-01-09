/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CreateApplicationDialog from 'promise-loader?global,cockpit!in-applications/creation/Dialog/CreateApplicationDialog';
import { get } from 'lodash';
import React from 'react';

import { KeyValue, SvgIcon, Button } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import { getNewApplicationWaiterViewPath } from 'in-applications/creation/CreateApplication';
import { getApplicationsWithDefaults } from 'in-applications/subscriptions/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { application as applicationType } from 'in-cockpit/starredItems/types';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { applicationsList } from 'in-applications/navigation/paths';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { hasError, isLoading } from 'in-services/util/result';
import TopListWidget from 'in-cockpit/widgets/TopListWidget';
import { successObservable } from 'in-services/util/result';
import { boundaryScopes } from 'in-applications/constants';
import { playwithEnabled } from 'in-services/featureFlags';
import { getTimeConfig } from 'in-stores/time/config';
import { add, remove } from 'in-cockpit/starredItems';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const DeferredCreateApplicationDialog = createAsyncViewComponent(CreateApplicationDialog);
export default function ApplicationsTopList({ applicationId, config }) {
  const entityResult = useObservable(getConfig, [applicationId]);
  const { createHrefToPath } = useNavigation();
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const { trackApplicationCreationOpenDialogClicked } = useApplicationTracker();

  const header =
    role.canConfigureApplications && !playwithEnabled ? (
      <Button
        kind="action"
        icon="lib_openclose_add_circle_outline"
        onClick={() => {
          addActiveDialog(
            <DeferredCreateApplicationDialog
              timeConfig={getTimeConfig({ pathname: '/applications', query: {} })}
              formData={entityResult.data}
              onClose={close}
              getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
              editMode
            />
          );
          trackApplicationCreationOpenDialogClicked({
            status: t('in-cockpit:component.applTopList.openCreationDialog')
          });
        }}
      >
        {t('in-cockpit:component.applTopList.newAppPerspect')}
      </Button>
    ) : null;

  return (
    <TopListWidget
      {...config}
      fullListViewLinkTitle={t('in-cockpit:component.applTopList.allApps')}
      header={header}
      getItem={getItem}
      pinnedItemTypes={[applicationType]}
      getId={item => item.application.id}
      pinItem={(id, item) =>
        add({
          id,
          label: item.application.label,
          type: applicationType
        })
      }
      unpinItem={(id, type) => remove({ id, type })}
      columnDefinitions={columnDefinitions}
      getItems={getApplicationsWithDefaults}
      fullListView={createHrefToPath(applicationsList)}
      EmptyStateComponent={ApplicationsNoDataNotification}
      getItemLink={item => getLinkToApplicationDashboard({ applicationId: item.application.id })}
    />
  );
}

function getItem(id, timeConfig) {
  const granularity = getSparkChartGranularity(timeConfig);

  return getApplication({ id }).flatMap(applicationResult => {
    if (isLoading(applicationResult) || hasError(applicationResult)) {
      return just(applicationResult);
    } else {
      const applicationTagFilter =
        applicationResult.data.boundaryScope === boundaryScopes.inbound
          ? tagFilter('boundary.application.id', EQUALS, id)
          : tagFilter('application.id', EQUALS, id, null, DESTINATION);
      return getApplicationMetrics({
        tagFilterExpression: toBackendQueryModel(
          joinExpressions({
            expressions: [applicationTagFilter]
          })
        ),
        includeInternal: false,
        includeSynthetic: false,
        timeShift: { offset: 0 },
        timeConfig,
        metrics: {
          services: {
            metric: 'services',
            aggregation: 'DISTINCT_COUNT'
          },
          calls: {
            metric: 'calls',
            aggregation: 'SUM',
            granularity
          },
          callsAgg: {
            metric: 'calls',
            aggregation: 'SUM'
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
          errorsAgg: {
            metric: 'errors',
            aggregation: 'MEAN'
          },
          errors: {
            metric: 'errors',
            aggregation: 'MEAN',
            granularity
          }
        }
      }).map(metricResult => {
        if (isLoading(metricResult) || hasError(metricResult)) {
          return metricResult;
        } else {
          return {
            application: {
              ...applicationResult.data
            },
            metrics: { ...metricResult.data },
            mainKpiValue: get(metricResult.data, ['callsAgg', 0, 1]),
            time: metricResult.time
          };
        }
      });
    }
  });
}

function BoundaryScopeColumn({ item }) {
  if (item.application.boundaryScope) {
    return (
      <Tooltip content={boundaryScopes.info[item.application.boundaryScope].dashboard}>
        <SvgIcon
          type={boundaryScopes.info[item.application.boundaryScope].icon}
          color={themes.default.ids.color.option.blue['500']}
        />
      </Tooltip>
    );
  }
  return null;
}

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ item }) {
      const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1]);
      if (maxSeverity !== undefined) {
        return <HealthDot severity={maxSeverity} iconSize={10} />;
      }

      return (
        <WithApplicationHealthIndicationBehaviour
          applicationId={item.application.id}
          render={healthInfo => (healthInfo ? <HealthDot severity={healthInfo.maxSeverity} iconSize={10} /> : null)}
        />
      );
    }
  },
  {
    width: '3rem',
    getContent() {
      return <SvgIcon type="lib_application" />;
    }
  },
  {
    getContent({ item }) {
      return (
        <KeyValue
          label={t('in-cockpit:component.applTopList.services', { count: get(item, ['metrics', 'services', 0, 1], 0) })}
          value={item.application.label}
          inverted
          accentuated
        />
      );
    }
  },
  {
    width: '3rem',
    getContent({ item }) {
      return <BoundaryScopeColumn item={item} />;
    }
  },
  {
    width: '12rem',
    getContent({ item, result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={get(item, ['metrics', 'calls'])}
          metric={get(item, ['metrics', 'callsAgg'])}
          label={t('in-cockpit:component.applTopList.calls')}
          tooltipFormatter={number.compact}
          showNullValuesChartOnEmptyMetrics
        />
      );
    }
  },
  {
    width: '12rem',
    getContent({ item, result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={get(item, ['metrics', 'latency'])}
          metric={get(item, ['metrics', 'latencyAgg'])}
          label={t('in-cockpit:component.applTopList.latency')}
          tooltipFormatter={meanLatencyFixed.compact}
          showDashOnMissingOrNullMetric
          hideChartOnEmptyMetrics
        />
      );
    }
  },
  {
    width: '14rem',
    getContent({ item, result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={get(item, ['metrics', 'errors'])}
          metric={get(item, ['metrics', 'errorsAgg'])}
          label={t('in-cockpit:component.applTopList.errCallRate')}
          tooltipFormatter={percentage.detailed}
          showDashOnMissingOrNullMetric
          hideChartOnEmptyMetrics
          percentageMetric
        />
      );
    }
  }
];

function getConfig([applicationId]) {
  return applicationId ? getApplicationConfig(applicationId) : successObservable(createNewApplicationConfig());
}
