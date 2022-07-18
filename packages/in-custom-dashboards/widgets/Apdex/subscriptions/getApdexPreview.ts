/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { ApdexPreviewQuery, MetricResult, Result } from 'in-types';

const getApdexPreviewObservable = createResultSubscriptionFactory<Partial<ApdexPreviewQuery>, Result<MetricResult[]>>({
  eventId: 'getApdexPreview',
  trackSubscriptionStatistics: true
});

export default function getApdexPreview(metrics: ApdexPreviewQuery): Observable<Result<MetricResult[]>> {
  return getApdexPreviewObservable(metrics);
}
