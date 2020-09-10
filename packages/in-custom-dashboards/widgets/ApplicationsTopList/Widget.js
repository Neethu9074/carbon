import { combineLatest } from 'reactive-observables';
import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import { getApplicationsWithDefaults } from 'in-subscription/application/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { applicationCreationOpenDialogClick } from 'in-applications/creation/tracker';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { application as applicationType } from 'in-stores/starredItems/types';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplication from 'in-subscription/application/getApplication';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { applicationsList } from 'in-applications/navigation/paths';
import getMetrics from 'in-subscription/application/getMetrics';
import { hasError, isLoading } from 'in-services/util/result';
import { boundaryScopes } from 'in-applications/constants';
import { getView } from 'in-stores/navigation/navigation';
import KeyValue from 'in-new-components/lists/KeyValue';
import { add, remove } from 'in-stores/starredItems';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';

export default function ApplicationsTopList({ config, setApDialogOpen }) {
  const header = role.canConfigureApplications && (
    <Button
      kind="action"
      icon="lib_openclose_add_circle_outline"
      onClick={() => {
        setApDialogOpen(true);
        applicationCreationOpenDialogClick({ status: 'Open Creation Dialog' });
      }}
    >
      New Application Perspective
    </Button>
  );

  return (
    <TopListWidget
      {...config}
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
      fullListViewLinkTitle="All Applications"
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
          label="Calls"
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
          label="Latency"
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
          label="Erroneous Call Rate"
          tooltipFormatter={percentage.detailed}
          showDashOnMissingOrNullMetric
          hideChartOnEmptyMetrics
          percentageMetric
        />
      );
    }
  }
];
