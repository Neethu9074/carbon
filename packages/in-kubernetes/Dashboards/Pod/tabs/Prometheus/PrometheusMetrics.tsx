/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { KubernetesPrometheusMetricListItem, PaginatedResult, Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs ts migration
import PrometheusCustomMetrics from 'in-forge/plugins/prometheus/Dashboard/PrometheusCustomMetrics';
// @ts-expect-error
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent';
import { getKubernetesPrometheusMetricsWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesPrometheusMetrics';
import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import useMetricIds from 'in-infrastructure/hooks/useMetricIds';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface PrometheusMetricsProps {
  podId: string;
  timeConfig: TimeConfig;
}

export default function PrometheusMetrics({ podId, timeConfig }: Readonly<PrometheusMetricsProps>) {
  const prometheusEndpoints: Result<PaginatedResult<KubernetesPrometheusMetricListItem>> =
    useObservable(() => getKubernetesPrometheusMetricsWithDefaults({ podId, timeConfig }), [podId]) ?? pendingResult;
  const isLoading = prometheusEndpoints && get(prometheusEndpoints, ['progress', 'loading']);
  const hasNoDataAvailable = prometheusEndpoints?.data?.items?.length === 0 || isLoading;
  const hasErrors = prometheusEndpoints?.errors.length > 0;

  if (hasNoDataAvailable || hasErrors) {
    return (
      <NoDataAvailable
        title={t('in-kubernetes:dashboards.noDataAvailable.prometheusMetricsTitle')}
        text={t('in-kubernetes:dashboards.noDataAvailable.prometheusMetricsNoData')}
        height={140}
      />
    );
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const navigationTree = getNavigationTree(prometheusEndpoints);

  return (
    <SideNavigationAndContent
      navigationTree={navigationTree}
      sidebarWidth={3}
      timeConfig={timeConfig}
      titlePrefix="Prometheus"
    />
  );
}

function getNavigationTree(prometheusEndpoints: Result<PaginatedResult<KubernetesPrometheusMetricListItem>>) {
  if (!prometheusEndpoints) {
    return null;
  }

  const items = prometheusEndpoints?.data?.items;
  const pages = items?.map(({ metric: { id, label } }: KubernetesPrometheusMetricListItem, index: number) => {
    const page = index > 0 ? '/' + index : '';

    return {
      path: `${podDashboardFullyQualified}/prometheus${page}`,
      label,
      component: (props: Result<PaginatedResult<KubernetesPrometheusMetricListItem>>) => (
        <PrometheusCustomMetric {...props} snapshotId={id} />
      )
    };
  });

  return [
    {
      title: t('in-kubernetes:dashboards.prometheusEndpoints'),
      pages
    }
  ];
}

interface PrometheusCustomMetricProps extends Result<PaginatedResult<KubernetesPrometheusMetricListItem>> {
  snapshotId: string;
}

function PrometheusCustomMetric({ snapshotId, ...props }: Readonly<PrometheusCustomMetricProps>) {
  const snapshot = useObservable(() => getSnapshot(snapshotId), [snapshotId]) ?? pendingResult;
  const isLoading = snapshot && get(snapshot, ['progress', 'loading']);
  const timeConfig = useTimeConfig();
  const metricIdsResult = useMetricIds({ snapshotId, timeConfig });
  const hasPrometheusMetrics = Array.isArray(metricIdsResult?.data) && metricIdsResult?.data?.length > 0;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!hasPrometheusMetrics) {
    return (
      <NoDataAvailable
        title={t('in-kubernetes:dashboards.noDataAvailable.prometheusMetricsTitle')}
        text={t('in-kubernetes:dashboards.noDataAvailable.prometheusMetricsDescription')}
        height={140}
      />
    );
  }

  return <PrometheusCustomMetrics snapshot={snapshot} {...props} />;
}
