/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import useMetricIds from 'in-infrastructure/hooks/useMetricIds';
import { emptyList } from 'in-services/fixedImmutables';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const timeConfig = useTimeConfig();
  const metricIds = useMetricIds({ snapshotId: snapshot.get('id'), timeConfig: timeConfig });

  const counters = countMetrics(metricIds, snapshot, 'metrics.counters');
  const gauges = countMetrics(metricIds, snapshot, 'metrics.gauges');
  const histograms = countMetrics(metricIds, snapshot, 'metrics.histograms');
  const summaries = countMetrics(metricIds, snapshot, 'metrics.summaries');
  const untyped = countMetrics(metricIds, snapshot, 'metrics.untyped');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.prometheus.counters')}>{counters}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.prometheus.gauges')}>{gauges}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.prometheus.histograms')}>{histograms}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.prometheus.summaries')}>{summaries}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.prometheus.untyped')}>{untyped}</DescriptionItem>
    </DescriptionList>
  );
}

function countMetrics(metricIds, snapshot, prefix) {
  const metricCount = metricIds.data?.filter(m => m.startsWith(prefix))?.length ?? 0;

  if (metricCount > 0) {
    return metricCount;
  }

  return snapshot.getIn(['data', prefix], emptyList).size;
}
