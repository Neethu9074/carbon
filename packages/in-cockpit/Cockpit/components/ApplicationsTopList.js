/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { getNewApplicationWaiterViewPath } from 'in-applications/creation/CreateApplication';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import { getApplicationsWithDefaults } from 'in-subscription/application/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { applicationCreationOpenDialogClick } from 'in-applications/creation/tracker';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { application as applicationType } from 'in-stores/starredItems/types';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplication from 'in-subscription/application/getApplication';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { applicationsList } from 'in-applications/navigation/paths';
import getMetrics from 'in-subscription/application/getMetrics';
import { hasError, isLoading } from 'in-services/util/result';
import TopListWidget from 'in-cockpit/widgets/TopListWidget';
import { successObservable } from 'in-services/util/result';
import { boundaryScopes } from 'in-applications/constants';
import { getView } from 'in-stores/navigation/navigation';
import KeyValue from 'in-new-components/lists/KeyValue';
import { getTimeConfig } from 'in-stores/time/config';
import { add, remove } from 'in-stores/starredItems';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function ApplicationsTopList({ applicationId, config }) {
  const entityResult = useObservable(getConfig, [applicationId]);

  const header = role.canConfigureApplications && (
    <Button
      kind="action"
      icon="lib_openclose_add_circle_outline"
      onClick={() => {
        addActiveDialog(
          <CreateApplicationDialog
            timeConfig={getTimeConfig({ pathname: '/applications', query: {} })}
            formData={entityResult.data}
            onClose={close}
            getOnSavePath={app => getNewApplicationWaiterViewPath(app)}
            editMode
          />
        );
        applicationCreationOpenDialogClick({ status: t('in-cockpit:component.applTopList.openCreationDialog') });
      }}
    >
      {t('in-cockpit:component.applTopList.newAppPerspect')}
    </Button>
  );

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
      fullListView$={getView(applicationsList)}
      EmptyStateComponent={ApplicationsNoDataNotification}
      getItemLink={item => getApplicationDashboard(item.application.id)}
    />
  );
}

function getItem(id, timeConfig) {
  const granularity = getSparkChartGranularity(timeConfig);

  return combineLatest([
    getApplication({ id }),
    getMetrics({
      filter: {
        timeConfig,
        application: id
      },
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
    })
  ]).map(([applicationResult, metricResult]) => combineResults(applicationResult, metricResult));
}

function combineResults(applicationResult, metricResult) {
  if (isLoading(applicationResult) || hasError(applicationResult)) {
    return applicationResult;
  }
  if (isLoading(metricResult) || hasError(metricResult)) {
    return metricResult;
  }

  return {
    application: {
      ...applicationResult.data
    },
    metrics: { ...metricResult.data },
    mainKpiValue: get(metricResult.data, ['callsAgg', 0, 1]),
    time: metricResult.time
  };
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
          label={`${get(item, ['metrics', 'services', 0, 1], 0)} Services`}
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
      if (item.application.boundaryScope) {
        return (
          <Tooltip content={boundaryScopes.info[item.application.boundaryScope].dashboard}>
            <SvgIcon type={boundaryScopes.info[item.application.boundaryScope].icon} color={theme.lib.colors.blue800} />
          </Tooltip>
        );
      }
      return null;
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
