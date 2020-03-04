import { combineLatest } from 'reactive-observables';
import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import { getApplicationsWithDefaults } from 'in-subscription/application/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import { applicationOpenSubmitFormTracker } from 'in-applications/tracker';
import getApplication from 'in-subscription/application/getApplication';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { newApplicationView } from 'in-applications/navigation/paths';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { applicationsList } from 'in-applications/navigation/paths';
import getMetrics from 'in-subscription/application/getMetrics';
import { hasError, isLoading } from 'in-services/util/result';
import { boundaryScopes } from 'in-applications/constants';
import { getView } from 'in-stores/navigation/navigation';
import KeyValue from 'in-new-components/lists/KeyValue';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';

export default function ApplicationsTopList({ config }) {
  const header = role.canConfigureApplications && (
    <Button
      kind="action"
      href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
      onClick={() => applicationOpenSubmitFormTracker()}
      icon="lib_openclose_add_circle_outline"
    >
      Create Application Perspective
    </Button>
  );

  return (
    <TopListWidget
      {...config}
      getItems={getApplicationsWithDefaults}
      getItem={getItem}
      pinnedItemTypes={[types.APPLCATIONS]}
      getId={item => item.application.id}
      pinItem={id => pin(types.APPLCATIONS, id)}
      unpinItem={id => unpin(types.APPLCATIONS, id)}
      columnDefinitions={columnDefinitions}
      fullListView$={getView(applicationsList)}
      fullListViewLinkTitle="All Applications"
      header={header}
      EmptyStateComponent={ApplicationsNoDataNotification}
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
    time: applicationResult.time
  };
}

const columnDefinitions = [
  {
    column: 1,
    getContent(item) {
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
    column: 2,
    getContent() {
      return <SvgIcon type="lib_application" />;
    }
  },
  {
    column: '3 / span 2',
    getContent(item) {
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
    column: 5,
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
    column: 6,
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={get(item, ['metrics', 'calls'])}
          metric={get(item, ['metrics', 'callsAgg'])}
          label="Calls"
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    column: 7,
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={get(item, ['metrics', 'latency'])}
          metric={get(item, ['metrics', 'latencyAgg'])}
          label="Latency"
          tooltipFormatter={meanLatencyFixed.compact}
        />
      );
    }
  },
  {
    column: 8,
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={get(item, ['metrics', 'errors'])}
          metric={get(item, ['metrics', 'errorsAgg'])}
          label="Erroneous Call Rate"
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];
