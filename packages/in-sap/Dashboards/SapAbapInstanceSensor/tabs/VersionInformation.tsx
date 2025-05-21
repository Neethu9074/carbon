/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { getMetricForFocusedMoment } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface VersionProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

interface VersionItem {
  key: string;
  label: string;
  metricId: string;
  metricValue: number;
}

export default function VersionUse({ snapshotId, timeConfig }: VersionProps) {
  const metrics = [
    'versionstats.version810',
    'versionstats.version800',
    'versionstats.version780',
    'versionstats.version770',
    'versionstats.version760',
    'versionstats.versionOthers'
  ];

  const labels = [
    t('in-sap:dashboards.noOfVersion810'),
    t('in-sap:dashboards.noOfVersion800'),
    t('in-sap:dashboards.noOfVersion780'),
    t('in-sap:dashboards.noOfVersion770'),
    t('in-sap:dashboards.noOfVersion760'),
    t('in-sap:dashboards.noOfVersionOthers')
  ];

  const data: Record<string, number> =
    useObservable(
      snapshotId
        ? () => {
            const observables = metrics.map(metricId =>
              getMetricForFocusedMoment({
                snapshotId,
                metric: metricId
              })
                .map((v: [number, number]) => v[1])
                .distinct()
            );
            return combineLatest(observables, false).map((values: number[]) => {
              const result: Record<string, number> = {};
              metrics.forEach((metricId, index) => {
                result[metricId] = values[index];
              });
              return result;
            });
          }
        : undefined,
      [snapshotId, timeConfig]
    ) ?? {};

  if (!data) return null;

  const items: VersionItem[] = metrics.map((metricId, index) => ({
    key: String(index),
    label: labels[index],
    metricId,
    metricValue: Number(data[metricId] ?? 0)
  }));

  return (
    <TopListCardPresenter
      selectedMetricFormatter={number.compact}
      showMetricSelectorsForSingleMetrics
      header={t('in-sap:dashboards.count')}
      title={t('in-sap:dashboards.versionInfo')}
      result={{
        progress: { loading: false },
        errors: [],
        data: {
          items,
          totalHits: items.length
        }
      }}
      metrics={metrics}
      labels={labels}
      selectedMetric="metricValue"
      Label={Label}
      Metric={Metric}
      getMetricValueFromItem={getMetricValueFromItem}
      renderHistoricDataIndicator
      config={{ metricConfiguration: { grouping: [{ maxResults: 5 }] } }}
      useMaxAvailableHeight={false}
      isScrollbarVisible
    />
  );
}

function Label({ item }: { item: VersionItem }) {
  return <Fragment>{item.label}</Fragment>;
}

function Metric({ formattedMetricValue }: { formattedMetricValue: string }) {
  return formattedMetricValue;
}

function getMetricValueFromItem(_metricId: string, item: VersionItem) {
  return item.metricValue;
}
