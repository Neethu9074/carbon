/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';

export const getMetricTemplates = memoize(getMetricTemplatesInternal, () => '', minutes.toMillis(10));

function getMetricTemplatesInternal() {
  // This is a placeholder for now, in the future metricTemplates will most likely be usable in this product area as well
  return just(undefined);
}
