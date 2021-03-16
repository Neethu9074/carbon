/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const counters = countMetrics(snapshot, 'metrics.counters');
  const gauges = countMetrics(snapshot, 'metrics.gauges');
  const histograms = countMetrics(snapshot, 'metrics.histograms');
  const summaries = countMetrics(snapshot, 'metrics.summaries');
  const untyped = countMetrics(snapshot, 'metrics.untyped');

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

function countMetrics(snapshot, prefix) {
  const metricCount = snapshot.get('metricIds', emptyList).filter(m => m.startsWith(prefix)).size;

  if (metricCount > 0) {
    return metricCount;
  }

  return snapshot.getIn(['data', prefix], emptyList).size;
}
