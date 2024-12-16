/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import useMetricIds from 'in-infrastructure/hooks/useMetricIds';
import { emptyList } from 'in-services/fixedImmutables';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  const timeConfig = useTimeConfig();
  const metricIds = useMetricIds({ snapshotId: snapshot.get('id'), timeConfig: timeConfig });

  const counters = countMetrics(metricIds, snapshot, 'metrics.counters');
  const gauges = countMetrics(metricIds, snapshot, 'metrics.gauges');
  const histograms = countMetrics(metricIds, snapshot, 'metrics.histograms', 3); // mean, 50th, 99th
  const meters = countMetrics(metricIds, snapshot, 'metrics.meters');
  const summaries = countMetrics(metricIds, snapshot, 'metrics.summaries');
  const timers = countMetrics(metricIds, snapshot, 'metrics.timers', 4); // rate, mean, 50th, 99th

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.dropwizardVersion')}>
        {data.get('version')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.counters')}>
        {counters}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.gauges')}>{gauges}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.histograms')}>
        {histograms}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.meters')}>{meters}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.summaries')}>
        {summaries}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.timers')}>{timers}</DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.dropwizardApplicationContainer.processId')}>
        {data.get('pid')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}

function countMetrics(metricIds, snapshot, prefix, subMetricsCount = 1) {
  const metricCount = metricIds.data?.filter(m => m.startsWith(prefix))?.length ?? 0;

  if (metricCount > 0) {
    return metricCount / subMetricsCount;
  }

  // Don't divide by 'subMetricsCount' because we receive them in a different format so need actual counts
  return snapshot.getIn(['data', prefix], emptyList).size;
}
