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

const baseUrl = '/api/tracking/intentToPurchase';

export function sendSegmentEvent(data: segmentWithMetaData): Observable<segmentWithMetaData> {
  return http<segmentData>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}`,
    data
  }).map(response => response.body);
}

export interface segmentData {
  type?: string;
}

export interface segmentWithMetaData {
  type?: string;
  altUserId?: string;
}

export function triggerSegmentEvent(data: segmentData) {
  //@ts-expect-error
  const withMetaData = { ...data, altUserId: user?.id };
  const result$ = sendSegmentEvent(withMetaData);
  const logger = createLogger('/in-plg/components/BuyNowDialog/BuyNowDialog');
  result$.errors().once(error => {
    logger.error(`Failed to send ${data?.type} cta event : ${error}`, error);
  });
}
