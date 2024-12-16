/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { segmentData, segmentWithMetaData } from 'in-plg/api/segmentData';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';
import { user } from 'in-stores/user';

const baseUrl = '/api/tracking/dataUsageNotification';

export function sendDataUsageSegmentEvent(data: segmentWithMetaData): Observable<segmentWithMetaData> {
  return http<segmentData>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}`,
    data
  }).map(response => response.body);
}

export function triggerDataUsageSegmentEvent(data: segmentData) {
  //@ts-expect-error
  const withMetaData = { ...data, altUserId: user?.id };
  const result$ = sendDataUsageSegmentEvent(withMetaData);
  const logger = createLogger('in-plg/components/DataConsumptionMessage/PushDataConsumptionMessage');
  result$.errors().once(error => {
    logger.error(`Failed to send ${data?.type} cta event : ${error}`, error);
  });
}
