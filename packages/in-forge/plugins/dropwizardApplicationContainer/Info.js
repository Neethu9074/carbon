/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  const counters = countMetrics(snapshot, 'metrics.counters');
  const gauges = countMetrics(snapshot, 'metrics.gauges');
  const histograms = countMetrics(snapshot, 'metrics.histograms', 3); // mean, 50th, 99th
  const meters = countMetrics(snapshot, 'metrics.meters');
  const summaries = countMetrics(snapshot, 'metrics.summaries');
  const timers = countMetrics(snapshot, 'metrics.timers', 4); // rate, mean, 50th, 99th

  return (
    <DescriptionList>
      <DescriptionItem title="Dropwizard Version">{data.get('version')}</DescriptionItem>

      <DescriptionItem title="Counters">{counters}</DescriptionItem>
      <DescriptionItem title="Gauges">{gauges}</DescriptionItem>
      <DescriptionItem title="Histograms">{histograms}</DescriptionItem>
      <DescriptionItem title="Meters">{meters}</DescriptionItem>
      <DescriptionItem title="Summaries">{summaries}</DescriptionItem>
      <DescriptionItem title="Timers">{timers}</DescriptionItem>

      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}

function countMetrics(snapshot, prefix, subMetricsCount = 1) {
  const metricCount = snapshot.get('metricIds', emptyList)?.filter(m => m.startsWith(prefix))?.size;

  if (metricCount > 0) {
    return metricCount / subMetricsCount;
  }

  // Don't divide by 'subMetricsCount' because we receive them in a different format so need actual counts
  return snapshot.getIn(['data', prefix], emptyList).size;
}
