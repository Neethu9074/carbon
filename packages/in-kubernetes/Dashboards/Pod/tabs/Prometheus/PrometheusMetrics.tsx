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
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface PrometheusMetricsProps {
  podId: string;
  timeConfig: TimeConfig;
}

export default function PrometheusMetrics({ podId, timeConfig }: Readonly<PrometheusMetricsProps>) {
  const prometheusEndpoints: Result<PaginatedResult<KubernetesPrometheusMetricListItem>> =
    useObservable(() => getKubernetesPrometheusMetricsWithDefaults({ podId, timeConfig }), [podId]) ?? pendingResult;
  const isLoading = prometheusEndpoints && get(prometheusEndpoints, ['progress', 'loading']);

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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <PrometheusCustomMetrics snapshot={snapshot} {...props} />;
}
