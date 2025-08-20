/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { trackEventRequest, trackEventUrl } from 'in-plg/components/DataConsumptionMessage/segment';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';
import { user } from 'in-stores/user';

export const pageLoadUrl = '/api/tracking/pageLoad';

export interface pageLoadEventRequest {
  pageLoadProperties?: Record<string, any>;
}

export function sendFreeTrialSelectionSegmentEvent(data: trackEventRequest): Observable<trackEventRequest> {
  return http<trackEventRequest>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${trackEventUrl}`,
    data
  }).map(response => response.body);
}

export function triggerFreeTrialSelectionSegmentEvent(data: trackEventRequest) {
  const withAdditionalProperty = {
    ...data,
    additionalProperties: {
      //@ts-expect-error
      altUserId: user?.id
    }
  };
  const result$ = sendFreeTrialSelectionSegmentEvent(withAdditionalProperty);
  const logger = createLogger('in-plg/components/NoviceToPro/GetStartedFreetrial');
  result$.errors().once(error => {
    logger.error(`Failed to send ${data?.requiredProperty} cta event : ${error}`, error);
  });
}

export function sendPageLoadFreeTrial(data: pageLoadEventRequest): Observable<pageLoadEventRequest> {
  return http<pageLoadEventRequest>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${pageLoadUrl}`,
    data
  }).map(response => response.body);
}

export function triggerPageLoadFreeTrial() {
  const withPageLoadProperty = {
    pageLoadProperties: {
      name: 'Page Viewed',
      path: '/',
      parentPageCategory: 'FreeTrialSelection',
      parentPageName: 'GettingStarted.Environmentselection',
      //@ts-expect-error
      altUserId: user?.id
    }
  };
  const result$ = sendPageLoadFreeTrial(withPageLoadProperty);
  const logger = createLogger('in-plg/components/NoviceToPro/FreetrialRoleSelector');
  result$.errors().once(error => {
    logger.error(`Failed to send Page Load event : ${error}`, error);
  });
}

export function sendNextSegmentEvent(data: trackEventRequest): Observable<trackEventRequest> {
  return http<trackEventRequest>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${trackEventUrl}`,
    data
  }).map(response => response.body);
}

export function triggerSendNextFreeTrial() {
  const withAdditionalProperty = {
    requiredProperty: 'RoleSelector.NEXT',
    additionalProperties: {
      //@ts-expect-error
      altUserId: user?.id
    }
  };
  const result$ = sendNextSegmentEvent(withAdditionalProperty);
  const logger = createLogger('in-plg/components/NoviceToPro/GetStartedFreetrial');
  result$.errors().once(error => {
    logger.error(`Failed to send Page Load event : ${error}`, error);
  });
}
