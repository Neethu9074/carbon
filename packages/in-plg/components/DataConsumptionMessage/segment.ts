/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';
import { user } from 'in-stores/user';

export const trackEventUrl = '/api/tracking/ctaEvent';

export interface trackEventRequest {
  requiredProperty: string;
  additionalProperties?: Record<string, any>;
}

export function sendDataUsageSegmentEvent(data: trackEventRequest): Observable<trackEventRequest> {
  return http<trackEventRequest>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${trackEventUrl}`,
    data
  }).map(response => {
    return response.body;
  });
}

export function triggerDataUsageSegmentEvent(data: trackEventRequest) {
  const withAdditionalProperty = {
    ...data,
    additionalProperties: {
      //@ts-expect-error
      altUserId: user?.id
    }
  };
  const result$ = sendDataUsageSegmentEvent(withAdditionalProperty);
  const logger = createLogger('in-plg/components/DataConsumptionMessage/PushDataConsumptionMessage');
  result$.errors().once(error => {
    logger.error(`Failed to send ${data?.requiredProperty} cta event : ${error}`, error);
  });
}
