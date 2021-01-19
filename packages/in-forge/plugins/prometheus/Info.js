/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const counters = countMetrics(snapshot, 'metrics.counters');
  const gauges = countMetrics(snapshot, 'metrics.gauges');
  const histograms = countMetrics(snapshot, 'metrics.histograms');
  const summaries = countMetrics(snapshot, 'metrics.summaries');
  const untyped = countMetrics(snapshot, 'metrics.untyped');

  return (
    <DescriptionList>
      <DescriptionItem title="Counters">{counters}</DescriptionItem>
      <DescriptionItem title="Gauges">{gauges}</DescriptionItem>
      <DescriptionItem title="Histograms">{histograms}</DescriptionItem>
      <DescriptionItem title="Summaries">{summaries}</DescriptionItem>
      <DescriptionItem title="Untyped">{untyped}</DescriptionItem>
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
