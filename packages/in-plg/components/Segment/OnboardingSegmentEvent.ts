/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { createLogger } from '@instana/logger';

import { getHeader as getCsrfHeader, token$ } from 'in-services/security/csrf';
import { pageLoadEventRequest } from 'in-plg/components/NoviceToPro/segment';
import http from 'in-services/http/http';
import { user } from 'in-stores/user';

export const pageLoadUrl = '/api/tracking/pageLoad';

export function sendPageLoadInstanaOnbaording(data: pageLoadEventRequest): Observable<pageLoadEventRequest> {
  return http<pageLoadEventRequest>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${pageLoadUrl}`,
    data
  }).map(response => response.body);
}

export default function triggerPageLoadInstanaOnbaoridng() {
  const withPageLoadProperty = {
    pageLoadProperties: {
      name: 'Page Viewed',
      path: '/',
      parentPageCategory: 'Instana.Onboarding',
      parentPageName: 'Instana.OnboardingPage',
      //@ts-expect-error
      altUserId: user?.id
    }
  };
  token$.subscribe(() => {
    const result$ = sendPageLoadInstanaOnbaording(withPageLoadProperty);
    const logger = createLogger('in-init/steps/InstanaOnboardingComponent');
    result$.errors().once(error => {
      logger.error(`Failed to send Page Load event : ${error}`, error);
    });
  });
}
